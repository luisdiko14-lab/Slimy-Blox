import type { Express } from "express";
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const clients = new Map<string, { ws: WebSocket; state: any }>();

  wss.on("connection", (ws) => {
    let playerId: string | null = null;

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "PLAYER_STATE") {
          playerId = message.payload.id;
          clients.set(playerId!, { ws, state: message.payload });
          
          // Broadcast to everyone else
          const broadcastMsg = JSON.stringify({
            type: "PLAYER_STATE",
            payload: message.payload
          });
          
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          });
        } else if (message.type === "CHAT_MESSAGE") {
          const chatMsg = JSON.stringify({
            type: "CHAT_MESSAGE",
            payload: message.payload
          });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(chatMsg);
            }
          });
        } else if (message.type === "KICK_PLAYER") {
          const target = message.payload.target;
          const kickMsg = JSON.stringify({ type: "KICK_ALL" });

          if (target === "@everyone") {
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(kickMsg);
              }
            });
          } else {
            // Find client by name (case-insensitive for better UX)
            const targetLower = target.toLowerCase();
            clients.forEach((c) => {
              if (c.state.name.toLowerCase() === targetLower) {
                if (c.ws.readyState === WebSocket.OPEN) {
                  c.ws.send(kickMsg);
                }
              }
            });
          }
        }
      } catch (e) {}
    });

    ws.on("close", () => {
      if (playerId) {
        clients.delete(playerId);
        const leaveMsg = JSON.stringify({
          type: "PLAYER_LEAVE",
          payload: { id: playerId }
        });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(leaveMsg);
          }
        });
      }
    });
  });
  
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
