import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  city: text("city").notNull(),
  phoneNo: text("phone_no").notNull(),
  points: integer("points").default(0),
  role: text("role").notNull().default("citizen"), // citizen, employee, admin
  adminId: integer("admin_id"), // For employees - which admin created them
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").default("pending"),
  priority: text("priority").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  imageUrl: text("image_url"),
  userId: integer("user_id").notNull(),
  assignedTo: integer("assigned_to"), // Employee assigned to handle this case
  assignedBy: integer("assigned_by"), // Admin who assigned this case
  assignedAt: timestamp("assigned_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  role: true,
  adminId: true,
  isActive: true,
  createdAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  assignedTo: true,
  assignedBy: true,
  assignedAt: true,
  resolvedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  location: z.string().min(1, "Location is required"),
  latitude: z.string().min(1, "Location coordinates are required"),
  longitude: z.string().min(1, "Location coordinates are required"),
  userId: z.number().min(1, "User ID is required"),
});

// Admin creates employee schema
export const createEmployeeSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  state: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  phoneNo: z.string().min(10),
});

// Login schemas for different user types
export const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const citizenLoginSchema = z.object({
  phoneNo: z.string().min(10),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type CreateEmployee = z.infer<typeof createEmployeeSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type CitizenLogin = z.infer<typeof citizenLoginSchema>;
