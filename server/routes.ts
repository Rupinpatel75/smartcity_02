import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });



  // export async function registerRoutes(app: Express): Promise<Server> {
  //   app.post('/api/cases', async (req, res) => {
  //     try {
  //       const caseData = req.body;
  //       const result = await storage.createCase(caseData);
  //       res.json(result);
  //     } catch (error) {
  //       res.status(500).json({ error: 'Failed to submit report' });
  //     }
  //   });
  
  //   const httpServer = createServer(app);
  //   return httpServer;
  // }
  
  wss.on("connection", (ws) => {
    console.log("Client connected");
    
    ws.on("message", (message) => {
      console.log("Received:", message);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return httpServer;
}