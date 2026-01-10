import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const commandLogs = pgTable("command_logs", {
  id: serial("id").primaryKey(),
  command: text("command").notNull(),
  args: text("args"),
  userRank: text("user_rank").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertCommandLogSchema = createInsertSchema(commandLogs).omit({ 
  id: true, 
  timestamp: true 
});

export type CommandLog = typeof commandLogs.$inferSelect;
export type InsertCommandLog = z.infer<typeof insertCommandLogSchema>;

// --- WebSocket Types ---
export const WS_EVENTS = {
  PLAYER_STATE: 'player_state',
  PLAYER_JOIN: 'player_join',
  PLAYER_LEAVE: 'player_leave',
  ANNOUNCEMENT: 'announcement',
} as const;

export interface PlayerState {
  id: string;
  pos: { x: number; y: number };
  rank: string;
  size: number;
  name: string;
  effects: string[];
  secondsPlayed: number;
  npcsEaten: number;
}

export interface WsMessage {
  type: keyof typeof WS_EVENTS;
  payload: any;
}
