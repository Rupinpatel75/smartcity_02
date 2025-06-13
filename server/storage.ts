import { users, cases, type User, type InsertUser, type InsertCase, type Case } from "@shared/schema";
import { db } from "./db";
import { eq, or, sql } from "drizzle-orm";
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getEmployeesByAdmin(adminId: number): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  createEmployee(employee: any, adminId: number): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  createCase(case_: InsertCase): Promise<Case>;
  getCases(): Promise<Case[]>;
  getCasesByAdmin(adminId: number): Promise<Case[]>;
  getCasesByEmployee(employeeId: number): Promise<Case[]>;
  getCasesByUser(userId: number): Promise<Case[]>;
  getCaseById(id: number): Promise<Case | undefined>;
  assignCase(caseId: number, employeeId: number, adminId: number): Promise<Case | undefined>;
  updateCaseStatus(caseId: number, status: string, userId: number): Promise<Case | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? this.normalizeUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user ? this.normalizeUser(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ? this.normalizeUser(user) : undefined;
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNo, mobile));
    return user ? this.normalizeUser(user) : undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(user => this.normalizeUser(user));
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, role: "citizen" })
      .returning();
    return this.normalizeUser(user);
  }

  async getEmployeesByAdmin(adminId: number): Promise<User[]> {
    const employees = await db.select().from(users).where(eq(users.adminId, adminId));
    return employees.map(user => this.normalizeUser(user));
  }

  async createEmployee(employee: any, adminId: number): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...employee, role: "employee", adminId })
      .returning();
    return this.normalizeUser(user);
  }

  async getCasesByAdmin(adminId: number): Promise<Case[]> {
    // Get cases from admin's city only
    const admin = await this.getUser(adminId);
    if (!admin) return [];
    
    const results = await db.select({
      id: cases.id,
      title: cases.title,
      description: cases.description,
      category: cases.category,
      status: cases.status,
      priority: cases.priority,
      location: cases.location,
      latitude: cases.latitude,
      longitude: cases.longitude,
      imageUrl: cases.imageUrl,
      userId: cases.userId,
      assignedTo: cases.assignedTo,
      assignedBy: cases.assignedBy,
      assignedAt: cases.assignedAt,
      resolvedAt: cases.resolvedAt,
      createdAt: cases.createdAt,
      updatedAt: cases.updatedAt
    })
    .from(cases)
    .innerJoin(users, eq(cases.userId, users.id))
    .where(eq(users.city, admin.city));
    
    return results;
  }

  async getCasesByEmployee(employeeId: number): Promise<Case[]> {
    return db.select().from(cases).where(eq(cases.assignedTo, employeeId));
  }

  async assignCase(caseId: number, employeeId: number, adminId: number): Promise<Case | undefined> {
    const [updatedCase] = await db
      .update(cases)
      .set({ 
        assignedTo: employeeId, 
        assignedBy: adminId,
        assignedAt: new Date()
      })
      .where(eq(cases.id, caseId))
      .returning();
    return updatedCase;
  }

  async updateCaseStatus(caseId: number, status: string, userId: number): Promise<Case | undefined> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const [updatedCase] = await db
      .update(cases)
      .set(updateData)
      .where(eq(cases.id, caseId))
      .returning();
    return updatedCase;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user ? this.normalizeUser(user) : undefined;
  }

  private normalizeUser(user: any): User {
    return {
      ...user,
      isAdmin: user.isAdmin || false,
      points: user.points || 0
    };
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const [case_] = await db
      .insert(cases)
      .values(insertCase)
      .returning();
    return case_;
  }

  async getCases(): Promise<Case[]> {
    return await db.select().from(cases);
  }

  async getCasesByUser(userId: number): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.userId, userId));
  }

  async getCaseById(id: number): Promise<Case | undefined> {
    const [case_] = await db.select().from(cases).where(eq(cases.id, id));
    return case_ || undefined;
  }
}

export const storage = new DatabaseStorage();
