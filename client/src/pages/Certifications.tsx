import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { CertificationCreateDialog } from "@/components/forms/SimpleCreateDialogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileX2, Plus } from "lucide-react";
import { useCertifications } from "@/hooks/use-portfolio";

export default function CertificationsPage() {
  const q = useCertifications();
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => {
    const items = q.data ?? [];
    return [...items].sort((a, b) => b.year - a.year);
  }, [q.data]);

  return (
    <AppShell>
      <Seo
        title="Certifications — Arshdeep Singh"
        description="Certifications and credentials: issuer, year, and verification link."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader
          title="Certifications"
          eyebrow="credentials"
          data-testid="certifications-header"
          right={
            <Button onClick={() => setOpen(true)} data-testid="certifications-create" className="gap-2">
              <Plus className="h-4 w-4" /> Add Certification
            </Button>
          }
        />

        {q.isError ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Failed to load certifications</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">
              {(q.error as any)?.message ?? "Unknown error"}
            </div>
          </Card>
        ) : q.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass rounded-2xl p-5">
                <Skeleton className="h-5 w-2/3 bg-muted/40" />
                <Skeleton className="mt-2 h-3 w-1/2 bg-muted/40" />
                <Skeleton className="mt-5 h-9 w-full bg-muted/40" />
              </Card>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <Card className="glass neon-ring rounded-2xl p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
              <FileX2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-semibold">No certifications</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">Add your first credential.</div>
            <div className="mt-4">
              <Button onClick={() => setOpen(true)} data-testid="certifications-empty-create">
                Add Certification
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((c, idx) => (
              <Card
                key={c.id}
                className="glass neon-ring rounded-2xl p-5 hover-elevate transition-all duration-300"
                data-testid={`cert-card-${idx}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">{c.name}</div>
                    <div className="mt-1 text-xs font-mono text-muted-foreground">
                      {c.issuer.replaceAll("_", " ")} • {c.year}
                    </div>
                  </div>
                  <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-[11px] font-mono text-muted-foreground">
                    verified
                  </div>
                </div>

                <Separator className="my-4 bg-border/70" />

              </Card>
            ))}
          </div>
        )}
      </div>

      <CertificationCreateDialog open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
