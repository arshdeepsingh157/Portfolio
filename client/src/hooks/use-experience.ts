import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ExperienceInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useExperience() {
  return useQuery({
    queryKey: [api.experience.list.path],
    queryFn: async () => {
      const res = await fetch(api.experience.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch experience");
      return parseWithLogging(api.experience.list.responses[200], await res.json(), "experience.list");
    },
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExperienceInput) => {
      const validated = api.experience.create.input.parse(input);
      const res = await fetch(api.experience.create.path, {
        method: api.experience.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.experience.create.responses[400], await res.json(), "experience.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create experience");
      }

      return parseWithLogging(api.experience.create.responses[201], await res.json(), "experience.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.experience.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}
