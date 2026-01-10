import { db } from "./db";
import { commandLogs, type InsertCommandLog, type CommandLog } from "@shared/schema";

export interface IStorage {
  logCommand(log: InsertCommandLog): Promise<CommandLog>;
  getCommandLogs(): Promise<CommandLog[]>;
}

export class DatabaseStorage implements IStorage {
  async logCommand(log: InsertCommandLog): Promise<CommandLog> {
    const [entry] = await db.insert(commandLogs).values(log).returning();
    return entry;
  }

  async getCommandLogs(): Promise<CommandLog[]> {
    return await db.select().from(commandLogs).orderBy(commandLogs.timestamp);
  }
}

export const storage = new DatabaseStorage();
