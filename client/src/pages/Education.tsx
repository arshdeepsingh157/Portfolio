import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { EducationCreateDialog } from "@/components/forms/SimpleCreateDialogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileX2, GraduationCap, Plus } from "lucide-react";
import { useEducation } from "@/hooks/use-portfolio";
import { isAdmin } from "@/lib/admin";

export default function EducationPage() {
  const q = useEducation();
  const [open, setOpen] = useState(false);
  const admin = isAdmin();

  const sorted = useMemo(() => {
    const items = q.data ?? [];
    return [...items].sort((a, b) => {
      const aKey = (a.endYear ?? a.startYear) * 100 + 1;
      const bKey = (b.endYear ?? b.startYear) * 100 + 1;
      return bKey - aKey;
    });
  }, [q.data]);

  return (
    <AppShell>
      <Seo
        title="Education — Arshdeep Singh"
        description="Academic background and education milestones."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader
          title="Education"
          eyebrow="academics"
          data-testid="education-header"
          right={
            admin ? (
              <Button onClick={() => setOpen(true)} data-testid="education-create" className="gap-2">
                <Plus className="h-4 w-4" /> Add Education
              </Button>
            ) : null
          }
        />

        {q.isError ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Failed to load education</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">
              {(q.error as any)?.message ?? "Unknown error"}
            </div>
          </Card>
        ) : q.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass rounded-2xl p-5">
                <Skeleton className="h-5 w-1/2 bg-muted/40" />
                <Skeleton className="mt-2 h-3 w-2/3 bg-muted/40" />
                <Skeleton className="mt-4 h-16 w-full bg-muted/40" />
              </Card>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <Card className="glass neon-ring rounded-2xl p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
              <FileX2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-semibold">No education entries</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">
              Add your academic history.
            </div>
            <div className="mt-4">
              {admin ? (
                <Button onClick={() => setOpen(true)} data-testid="education-empty-create">
                  Add Education
                </Button>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sorted.map((e, idx) => (
              <Card
                key={e.id}
                className="glass neon-ring rounded-2xl p-5 hover-elevate transition-all duration-300"
                data-testid={`education-card-${idx}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-lg">{e.institution}</div>
                      <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-[11px] font-mono text-muted-foreground">
                        {e.level.replaceAll("_", " ").toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {e.degree}{e.field ? ` • ${e.field}` : ""} • {e.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="rounded-2xl border border-border/70 bg-background/25 px-3 py-2 text-xs font-mono text-muted-foreground">
                      {e.startYear} {e.endYear ? `→ ${e.endYear}` : "→ present"}
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/25 p-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-border/70" />

                <div className="text-sm text-foreground whitespace-pre-wrap">{e.details}</div>
                <div className="mt-3 text-xs font-mono text-muted-foreground">Status: {e.status}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {admin ? <EducationCreateDialog open={open} onOpenChange={setOpen} /> : null}
    </AppShell>
  );
}
