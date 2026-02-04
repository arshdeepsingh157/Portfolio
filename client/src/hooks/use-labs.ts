import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type LabInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useLabs() {
  return useQuery({
    queryKey: [api.labs.list.path],
    queryFn: async () => {
      const res = await fetch(api.labs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch labs");
      return parseWithLogging(api.labs.list.responses[200], await res.json(), "labs.list");
    },
  });
}

export function useCreateLab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LabInput) => {
      const validated = api.labs.create.input.parse(input);
      const res = await fetch(api.labs.create.path, {
        method: api.labs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.labs.create.responses[400], await res.json(), "labs.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create lab");
      }

      return parseWithLogging(api.labs.create.responses[201], await res.json(), "labs.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.labs.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}
