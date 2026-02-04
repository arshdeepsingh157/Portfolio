import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type CertificationInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCertifications() {
  return useQuery({
    queryKey: [api.certifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.certifications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch certifications");
      return parseWithLogging(api.certifications.list.responses[200], await res.json(), "certifications.list");
    },
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CertificationInput) => {
      const validated = api.certifications.create.input.parse(input);
      const res = await fetch(api.certifications.create.path, {
        method: api.certifications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(
            api.certifications.create.responses[400],
            await res.json(),
            "certifications.create.400",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to create certification");
      }

      return parseWithLogging(
        api.certifications.create.responses[201],
        await res.json(),
        "certifications.create.201",
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.certifications.list.path] });
      qc.invalidateQueries({ queryKey: [api.portfolio.overview.path] });
    },
  });
}
