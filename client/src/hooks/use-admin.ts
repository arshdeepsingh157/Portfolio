import { useQuery } from "@tanstack/react-query";

export function useAdmin() {
  const { data } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      if (res.status === 401) {
        return { admin: false } as const;
      }
      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(text);
      }
      return (await res.json()) as { admin: boolean };
    },
    retry: false,
    staleTime: 60_000,
  });

  return data?.admin ?? false;
}
