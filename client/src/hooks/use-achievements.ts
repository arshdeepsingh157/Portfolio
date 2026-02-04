import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AchievementInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useAchievements() {
  return useQuery({
    queryKey: [api.achievements.list.path],
    queryFn: async () => {
      const res = await fetch(api.achievements.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return parseWithLogging(api.achievements.list.responses[200], await res.json(), "achievements.list");
    },
  });
}

export function useCreateAchievement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AchievementInput) => {
      const validated = api.achievements.create.input.parse(input);
      const res = await fetch(api.achievements.create.path, {
        method: api.achievements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(
            api.achievements.create.responses[400],
            await res.json(),
            "achievements.create.400",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to create achievement");
      }

      return parseWithLogging(
        api.achievements.create.responses[201],
        await res.json(),
        "achievements.create.201",
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.achievements.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}
