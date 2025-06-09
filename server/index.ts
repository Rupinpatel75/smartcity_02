import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "./models/User";
import Report from "./models/Report.js";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { z } from "zod";
import { authenticateUser, AuthRequest } from "./authMiddleware.ts";
import bcrypt from "bcrypt";
import upload from "./uploadConfig.ts";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const JWT_SECRET = "123123";

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

mongoose
  .connect("mongodb://localhost:27017/UrbanHero")
  .then(() => log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/uploads", express.static(uploadDir)); // Serve uploaded images
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});



//SignupZodobject
const UserSchema = z.object({
  username:z.string(),
  email:z.string().email(),
  password:z.string().min(8),
  state: z.string(),
  district: z.string(),
  city:z.string(),
  phone_no:z.number()
})

app.post("/api/v1/signup", async (req: Request, res: Response) => {
  
  try {
    const data = req.body;
    const result = UserSchema.safeParse(data);

    if(!result.success) {
      console.error("Validation Error:", result.error.format());
      return res.status(400).json({ message: "Validation failed", errors: result.error.format() });
    }
    

    // Check if user already exists
    let user = await User.findOne({ email:data.email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create new user
    user = new User({
      username:data.username,
      email:data.email,
      password:hashedPassword,
      state:data.state,
      district: data.district,
      city:data.city,
      phone_no:data.phone_no
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



//LoginZodobject
const LoginSchema = z.object({
  email:z.string().email(),
  password:z.string().min(8)
})

// Login Route
app.post("/api/v1/login", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log(req.body);
    const result = LoginSchema.safeParse(data);

    if(!result.success) {
      console.error("Validation Error:", result.error.format());
      return res.status(400).json({
        message: "Validation failed", errors: result.error.format()
      });
    }

    // Find user by email
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials // email already used"
      });
    }

    // Compare passwords using the model method
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.username,  // Send username instead of hardcoded "Admin"
        email: user.email
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/api/v1/cases", authenticateUser, upload.single("image"), async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.body); // Should contain form fields
    console.log(req.file); // Should contain uploaded file info

    const { title, description, category, priority, location, latitude, longitude } = req.body;
    const userId = req.user?.userId; // Convert to number

    // Validate required fields
    if (!title || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Create new report
    const report = new Report({
      title,
      description,
      category,
      priority: priority || "low",
      location: location || "",
      latitude,
      longitude,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      userId,
    });

    console.log("Received userId:", req.body.userId, "Type:", typeof req.body.userId);
    // Save report
    await report.save();
    console.log("Report saved successfully:", report);

    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report" });
  }
});

// to get all the cases
app.get("/api/v1/cases", async (req: Request, res: Response) => {
  try {
    const cases = await Report.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cases" });
  }
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/api/v1/user/me", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId; // Extract userId from middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userE = await User.findById(userId).select("-password");

    if (!userE) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userE); 
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/api/v1/user/update", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, phone_no, city } = req.body;
    const userId = req.user?.userId; // Now TypeScript recognizes `user`

    console.log("User ID from Middleware:", userId);
    console.log("Request Body:", req.body);

    // Force update with $set
    const result = await User.updateOne({ _id: userId }, { $set: { username, email, phone_no, city } });

    console.log("Update Result:", result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes detected or update failed" });
    }

    const updatedUser = await User.findById(userId);
    res.json({ message: "User updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
