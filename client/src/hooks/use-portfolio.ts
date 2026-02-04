import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { staticOverview, staticPortfolioData } from "@/lib/static-data";

const shouldUseStaticData = () => {
  if (import.meta.env.VITE_STATIC_DATA === "true") return true;
  if (typeof window === "undefined") return false;
  return window.location.hostname.includes("netlify.app");
};

function parseWithLogging<T>(schema: { safeParse: (data: unknown) => any }, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data as T;
}

export function usePortfolioOverview() {
  return useQuery({
    queryKey: [api.portfolio.overview.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(api.portfolio.overview.responses[200], staticOverview, "portfolio.overview");
      }
      const res = await fetch(api.portfolio.overview.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch portfolio overview");
      const json = await res.json();
      return parseWithLogging(api.portfolio.overview.responses[200], json, "portfolio.overview");
    },
  });
}

export function useAlertsList(params?: unknown) {
  return useQuery({
    queryKey: [api.alerts.list.path, params ?? {}],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(api.alerts.list.responses[200], staticPortfolioData.alerts, "alerts.list");
      }
      const validated = api.alerts.list.input?.optional().safeParse(params).success
        ? (params as any)
        : api.alerts.list.input?.optional().parse(params);

      const url = new URL(api.alerts.list.path, window.location.origin);
      const p = (validated ?? {}) as Record<string, unknown>;
      Object.entries(p).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        url.searchParams.set(k, String(v));
      });

      const res = await fetch(url.toString().replace(window.location.origin, ""), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const json = await res.json();
      return parseWithLogging(api.alerts.list.responses[200], json, "alerts.list");
    },
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: [api.alerts.get.path, id],
    queryFn: async () => {
      const url = api.alerts.get.path.replace(":id", encodeURIComponent(id));
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch alert");
      const json = await res.json();
      return parseWithLogging(api.alerts.get.responses[200], json, "alerts.get");
    },
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = api.alerts.create.input.parse(data);
      const res = await fetch(api.alerts.create.path, {
        method: api.alerts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.alerts.create.responses[400], await res.json(), "alerts.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create alert");
      }
      return parseWithLogging(api.alerts.create.responses[201], await res.json(), "alerts.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.alerts.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useUpdateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; updates: unknown }) => {
      const validated = api.alerts.update.input.parse(payload.updates);
      const url = api.alerts.update.path.replace(":id", encodeURIComponent(payload.id));
      const res = await fetch(url, {
        method: api.alerts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.alerts.update.responses[400], await res.json(), "alerts.update.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.alerts.update.responses[404], await res.json(), "alerts.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update alert");
      }
      return parseWithLogging(api.alerts.update.responses[200], await res.json(), "alerts.update.200");
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [api.alerts.list.path] });
      qc.invalidateQueries({ queryKey: [api.alerts.get.path, variables.id] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(api.projects.list.responses[200], staticPortfolioData.projects, "projects.list");
      }
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
      const url = api.projects.get.path.replace(":id", encodeURIComponent(id));
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
    mutationFn: async (data: unknown) => {
      const validated = api.projects.create.input.parse(data);
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
    mutationFn: async (payload: { id: string; updates: unknown }) => {
      const validated = api.projects.update.input.parse(payload.updates);
      const url = api.projects.update.path.replace(":id", encodeURIComponent(payload.id));
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
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [api.projects.list.path] });
      qc.invalidateQueries({ queryKey: [api.projects.get.path, variables.id] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useCertifications() {
  return useQuery({
    queryKey: [api.certifications.list.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(
          api.certifications.list.responses[200],
          staticPortfolioData.certifications,
          "certifications.list",
        );
      }
      const res = await fetch(api.certifications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch certifications");
      return parseWithLogging(api.certifications.list.responses[200], await res.json(), "certifications.list");
    },
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = api.certifications.create.input.parse(data);
      const res = await fetch(api.certifications.create.path, {
        method: api.certifications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.certifications.create.responses[400], await res.json(), "certifications.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create certification");
      }
      return parseWithLogging(api.certifications.create.responses[201], await res.json(), "certifications.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.certifications.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useExperience() {
  return useQuery({
    queryKey: [api.experience.list.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(
          api.experience.list.responses[200],
          staticPortfolioData.experience,
          "experience.list",
        );
      }
      const res = await fetch(api.experience.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch experience");
      return parseWithLogging(api.experience.list.responses[200], await res.json(), "experience.list");
    },
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = api.experience.create.input.parse(data);
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

export function useEducation() {
  return useQuery({
    queryKey: [api.education.list.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(
          api.education.list.responses[200],
          staticPortfolioData.education,
          "education.list",
        );
      }
      const res = await fetch(api.education.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch education");
      return parseWithLogging(api.education.list.responses[200], await res.json(), "education.list");
    },
  });
}

export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = api.education.create.input.parse(data);
      const res = await fetch(api.education.create.path, {
        method: api.education.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.education.create.responses[400], await res.json(), "education.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create education");
      }

      return parseWithLogging(api.education.create.responses[201], await res.json(), "education.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.education.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: [api.achievements.list.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(
          api.achievements.list.responses[200],
          staticPortfolioData.achievements,
          "achievements.list",
        );
      }
      const res = await fetch(api.achievements.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return parseWithLogging(api.achievements.list.responses[200], await res.json(), "achievements.list");
    },
  });
}

export function useCreateAchievement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = api.achievements.create.input.parse(data);
      const res = await fetch(api.achievements.create.path, {
        method: api.achievements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.achievements.create.responses[400], await res.json(), "achievements.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create achievement");
      }
      return parseWithLogging(api.achievements.create.responses[201], await res.json(), "achievements.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.achievements.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}

export function useLabs() {
  return useQuery({
    queryKey: [api.labs.list.path],
    queryFn: async () => {
      if (shouldUseStaticData()) {
        return parseWithLogging(api.labs.list.responses[200], staticPortfolioData.labs, "labs.list");
      }
      const res = await fetch(api.labs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch labs");
      return parseWithLogging(api.labs.list.responses[200], await res.json(), "labs.list");
    },
  });
}

export function useCreateLab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = api.labs.create.input.parse(data);
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
