import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertCommandLog } from "@shared/routes";

export function useCreateLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCommandLog) => {
      const res = await fetch(api.logs.create.path, {
        method: api.logs.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to create log');
      }
      
      return api.logs.create.responses[201].parse(await res.json());
    },
    // We don't necessarily need to invalidate queries if we aren't showing the logs in UI
    // but good practice if we ever add a log viewer
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    }
  });
}
