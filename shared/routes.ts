import { z } from 'zod';
import { insertCommandLogSchema, commandLogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  logs: {
    create: {
      method: 'POST' as const,
      path: '/api/logs',
      input: insertCommandLogSchema,
      responses: {
        201: z.custom<typeof commandLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: {
        200: z.array(z.custom<typeof commandLogs.$inferSelect>()),
      },
    },
  },
};
