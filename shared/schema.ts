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
