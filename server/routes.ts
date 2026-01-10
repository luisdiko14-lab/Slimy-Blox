import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const log = await storage.logCommand(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid log data" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.logs.list.path, async (req, res) => {
    const logs = await storage.getCommandLogs();
    res.json(logs);
  });

  return httpServer;
}
