import { users, cases, type User, type InsertUser, type InsertCase, type Case } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  getCases(): Promise<Case[]>;
  getCaseById(id: number): Promise<Case | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cases: Map<number, Case>;
  private currentUserId: number;
  private currentCaseId: number;

  constructor() {
    this.users = new Map();
    this.cases = new Map();
    this.currentUserId = 1;
    this.currentCaseId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      points: 0,
      isAdmin: false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const id = this.currentCaseId++;
    const case_: Case = { 
      ...insertCase, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertCase.status || 'pending',
      imageUrl: insertCase.imageUrl || null
    };
    this.cases.set(id, case_);
    return case_;
  }

  async getCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async getCaseById(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  // Keep legacy method for compatibility
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
}

export const storage = new MemStorage();
