import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ProjectInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return parseWithLogging(api.projects.list.responses[200], await res.json(), "projects.list");
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      return parseWithLogging(api.projects.get.responses[200], await res.json(), "projects.get");
    },
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectInput) => {
      const validated = api.projects.create.input.parse(input);
      const res = await fetch(api.projects.create.path, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.projects.create.responses[400], await res.json(), "projects.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create project");
      }
      return parseWithLogging(api.projects.create.responses[201], await res.json(), "projects.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.projects.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProjectInput> }) => {
      const validated = api.projects.update.input.parse(updates);
      const url = buildUrl(api.projects.update.path, { id });
      const res = await fetch(url, {
        method: api.projects.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.projects.update.responses[400], await res.json(), "projects.update.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.projects.update.responses[404], await res.json(), "projects.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update project");
      }
      return parseWithLogging(api.projects.update.responses[200], await res.json(), "projects.update.200");
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [api.projects.list.path] });
      qc.invalidateQueries({ queryKey: [api.projects.get.path, vars.id] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}
