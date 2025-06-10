import { users, cases, type User, type InsertUser, type InsertCase, type Case } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  getCases(): Promise<Case[]>;
  getCaseById(id: number): Promise<Case | undefined>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return this.normalizeUser(user);
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

  async getCaseById(id: number): Promise<Case | undefined> {
    const [case_] = await db.select().from(cases).where(eq(cases.id, id));
    return case_ || undefined;
  }
}

export const storage = new DatabaseStorage();
