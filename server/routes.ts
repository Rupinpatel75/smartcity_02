import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertUserSchema, insertCaseSchema, createEmployeeSchema, adminLoginSchema, citizenLoginSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const upload = multer({ dest: "uploads/" });

interface AuthRequest extends Request {
  user?: { userId: number };
}

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

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

const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(req.user.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

export async function registerRoutes(app: express.Express): Promise<Server> {
  // Citizen signup (mobile number + password)
  app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByMobile(validatedData.phoneNo);
      if (existingUser) {
        return res.status(400).json({ message: "User with this mobile number already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create citizen user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          points: user.points || 0
        },
      });
    } catch (error: any) {
      console.error("Signup Error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Citizen login (mobile number + password or OTP)
  app.post("/api/v1/login", async (req: Request, res: Response) => {
    try {
      // Handle both password and OTP login
      const { phoneNo, mobile, password, otp } = req.body;
      
      // Use phoneNo if provided, otherwise use mobile (for OTP login)
      const mobileNumber = phoneNo || mobile;
      
      if (!mobileNumber) {
        return res.status(400).json({ message: "Mobile number is required" });
      }

      const user = await storage.getUserByMobile(mobileNumber);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Handle OTP login
      if (otp) {
        // For demo purposes, accept 1234 as valid OTP
        if (otp !== "1234") {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      } else {
        // Handle password login
        if (!password) {
          return res.status(400).json({ message: "Password is required" });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      }

      if (!user.isActive) {
        return res.status(400).json({ message: "Account is inactive" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          points: user.points || 0
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Admin login (username + password)
  app.post("/api/v1/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== "admin") {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }

      if (!user.isActive) {
        return res.status(400).json({ message: "Admin account is inactive" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city
        },
      });
    } catch (error) {
      console.error("Admin Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Employee login (username + password)
  app.post("/api/v1/employee/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== "employee") {
        return res.status(400).json({ message: "Invalid employee credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid employee credentials" });
      }

      if (!user.isActive) {
        return res.status(400).json({ message: "Employee account is inactive" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          adminId: user.adminId
        },
      });
    } catch (error) {
      console.error("Employee Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Admin creates employee
  app.post("/api/v1/admin/employees", authenticateUser, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = createEmployeeSchema.parse(req.body);
      const adminId = req.user!.userId;

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create employee
      const employee = await storage.createEmployee({
        ...validatedData,
        password: hashedPassword,
      }, adminId);

      res.status(201).json({
        message: "Employee created successfully",
        employee: {
          id: employee.id,
          username: employee.username,
          email: employee.email,
          role: employee.role,
          city: employee.city,
          adminId: employee.adminId
        }
      });
    } catch (error: any) {
      console.error("Create Employee Error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Get employees under admin
  app.get("/api/v1/admin/employees", authenticateUser, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
    try {
      const adminId = req.user!.userId;
      const employees = await storage.getEmployeesByAdmin(adminId);
      
      res.json(employees.map(emp => ({
        id: emp.id,
        username: emp.username,
        email: emp.email,
        city: emp.city,
        isActive: emp.isActive,
        createdAt: emp.createdAt
      })));
    } catch (error) {
      console.error("Get Employees Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Submit case/complaint
  app.post("/api/v1/cases", authenticateUser, upload.single("image"), async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      
      console.log("Form submission received:", {
        body: req.body,
        file: req.file ? { filename: req.file.filename, size: req.file.size } : null,
        userId: userId
      });
      
      const { title, description, category, priority, location, latitude, longitude } = req.body;

      // Enhanced validation with detailed logging
      const missingFields = [];
      if (!title || title.trim() === '') missingFields.push('title');
      if (!description || description.trim() === '') missingFields.push('description');
      if (!category) missingFields.push('category');
      if (!latitude) missingFields.push('latitude');
      if (!longitude) missingFields.push('longitude');

      if (missingFields.length > 0) {
        console.log("Validation failed - missing fields:", missingFields);
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        });
      }

      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const caseData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority || "medium",
        location: location || `${latitude}, ${longitude}`,
        latitude,
        longitude,
        imageUrl,
        userId,
      };

      console.log("Creating case with data:", caseData);

      const newCase = await storage.createCase(caseData);

      console.log("Case created successfully:", { id: newCase.id, title: newCase.title });
      res.status(201).json(newCase);
    } catch (error) {
      console.error("Create Case Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

  // Get cases for different user roles
  app.get("/api/v1/cases", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let cases;
      if (user.role === "admin") {
        cases = await storage.getCasesByAdmin(user.id);
      } else if (user.role === "employee") {
        cases = await storage.getCasesByEmployee(user.id);
      } else {
        cases = await storage.getCases();
      }

      res.json(cases);
    } catch (error) {
      console.error("Get Cases Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Admin assigns case to employee
  app.patch("/api/v1/admin/cases/:id/assign", authenticateUser, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
    try {
      const caseId = parseInt(req.params.id);
      const { employeeId } = req.body;
      const adminId = req.user!.userId;

      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      const updatedCase = await storage.assignCase(caseId, employeeId, adminId);
      if (!updatedCase) {
        return res.status(404).json({ message: "Case not found" });
      }

      res.json(updatedCase);
    } catch (error) {
      console.error("Assign Case Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Employee updates case status
  app.patch("/api/v1/cases/:id/status", authenticateUser, requireRole(["employee", "admin"]), async (req: AuthRequest, res: Response) => {
    try {
      const caseId = parseInt(req.params.id);
      const { status } = req.body;
      const userId = req.user!.userId;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedCase = await storage.updateCaseStatus(caseId, status, userId);
      if (!updatedCase) {
        return res.status(404).json({ message: "Case not found" });
      }

      res.json(updatedCase);
    } catch (error) {
      console.error("Update Case Status Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Get current user info
  app.get("/api/v1/user/me", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        city: user.city,
        points: user.points || 0
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Map endpoint
  app.get("/api/cases/map", async (req: Request, res: Response) => {
    try {
      const cases = await storage.getCases();
      res.json(cases);
    } catch (error) {
      console.error("Map Cases Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}