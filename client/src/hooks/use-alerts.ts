import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type AlertInput, type AlertUpdateInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export type AlertsListParams = NonNullable<z.infer<typeof api.alerts.list.input>>;

function toQueryString(params?: AlertsListParams) {
  if (!params) return "";
  const sp = new URLSearchParams();
  if (params.severity) sp.set("severity", params.severity);
  if (params.status) sp.set("status", params.status);
  if (typeof params.suppressed === "boolean") sp.set("suppressed", String(params.suppressed));
  if (params.search) sp.set("search", params.search);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function useAlerts(params?: AlertsListParams) {
  const url = `${api.alerts.list.path}${toQueryString(params)}`;
  return useQuery({
    queryKey: [api.alerts.list.path, params ?? {}],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return parseWithLogging(api.alerts.list.responses[200], await res.json(), "alerts.list");
    },
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: [api.alerts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.alerts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch alert");
      return parseWithLogging(api.alerts.get.responses[200], await res.json(), "alerts.get");
    },
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AlertInput) => {
      const validated = api.alerts.create.input.parse(input);
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
    mutationFn: async ({ id, updates }: { id: string; updates: AlertUpdateInput }) => {
      const validated = api.alerts.update.input.parse(updates);
      const url = buildUrl(api.alerts.update.path, { id });
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
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [api.alerts.list.path] });
      qc.invalidateQueries({ queryKey: [api.alerts.get.path, vars.id] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}
