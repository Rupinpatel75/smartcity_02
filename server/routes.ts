import express, { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import type { Server } from "http";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = "123123";

// Create uploads directory
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: multerStorage });

// Auth middleware
interface AuthRequest extends Request {
  user?: { userId: number };
}

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Schemas
const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  state: z.string(),
  district: z.string(),
  city: z.string(),
  phoneNo: z.string()
});

const LoginSchema = z.object({
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  password: z.string().min(8).optional(),
  otp: z.string().optional()
}).refine(data => {
  // Either email+password or mobile+password or mobile+otp
  return (data.email && data.password) || 
         (data.mobile && data.password) || 
         (data.mobile && data.otp);
}, "Invalid login credentials");

export async function registerRoutes(app: express.Express): Promise<Server> {
  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // Signup route
  app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
      const result = UserSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: result.error.format() 
        });
      }

      const data = result.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create new user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Login route
  app.post("/api/v1/login", async (req: Request, res: Response) => {
    try {
      const result = LoginSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed", 
          errors: result.error.format()
        });
      }

      const { email, mobile, password, otp } = result.data;

      let user;
      
      // Find user by email or mobile
      if (email) {
        user = await storage.getUserByEmail(email);
      } else if (mobile) {
        user = await storage.getUserByMobile(mobile);
      }
      
      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials"
        });
      }

      // Handle OTP authentication
      if (otp) {
        // For testing, accept OTP 1234
        if (otp !== "1234") {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      } else if (password) {
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      } else {
        return res.status(400).json({ message: "Password or OTP required" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.isAdmin ? "admin" : "citizen",
          points: user.points || 0
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Create case route
  app.post("/api/v1/cases", authenticateUser, upload.single("image"), async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category, priority, location, latitude, longitude } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate required fields
      if (!title || !description || !category || !latitude || !longitude) {
        return res.status(400).json({ message: "All required fields must be provided." });
      }

      // Create new case
      const case_ = await storage.createCase({
        title,
        description,
        category,
        priority: priority || "low",
        location: location || "",
        latitude,
        longitude,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        userId,
      });

      res.status(201).json({ message: "Report created successfully", case: case_ });
    } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  // Get all cases
  app.get("/api/v1/cases", async (req: Request, res: Response) => {
    try {
      const cases = await storage.getCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Error fetching cases" });
    }
  });

  // Get current user
  app.get("/api/v1/user/me", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Update user
  app.post("/api/v1/user/update", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
      const { username, email, phoneNo, city } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedUser = await storage.updateUser(userId, {
        username,
        email,
        phoneNo,
        city
      });

      if (!updatedUser) {
        return res.status(400).json({ message: "Update failed" });
      }

      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  const { createServer } = await import("http");
  const server = createServer(app);
  return server;
}