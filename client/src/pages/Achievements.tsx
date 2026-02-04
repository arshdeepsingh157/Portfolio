import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { AchievementCreateDialog } from "@/components/forms/SimpleCreateDialogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileX2, Plus, Trophy } from "lucide-react";
import { useAchievements } from "@/hooks/use-portfolio";
import { isAdmin } from "@/lib/admin";

export default function AchievementsPage() {
  const q = useAchievements();
  const [open, setOpen] = useState(false);
  const admin = isAdmin();

  const sorted = useMemo(() => {
    const items = q.data ?? [];
    return [...items].sort((a, b) => b.year - a.year);
  }, [q.data]);

  return (
    <AppShell>
      <Seo
        title="Achievements — Arshdeep Singh"
        description="Achievements across security, awards, sports, and more."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader
          title="Achievements"
          eyebrow="signals"
          data-testid="achievements-header"
          right={
            admin ? (
              <Button onClick={() => setOpen(true)} data-testid="achievements-create" className="gap-2">
                <Plus className="h-4 w-4" /> Add Achievement
              </Button>
            ) : null
          }
        />

        {q.isError ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Failed to load achievements</div>
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
                <Skeleton className="mt-4 h-16 w-full bg-muted/40" />
              </Card>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <Card className="glass neon-ring rounded-2xl p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
              <FileX2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-semibold">No achievements</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">Add achievements to show impact.</div>
            <div className="mt-4">
              {admin ? (
                <Button onClick={() => setOpen(true)} data-testid="achievements-empty-create">
                  Add Achievement
                </Button>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((a, idx) => (
              <Card
                key={a.id}
                className="glass neon-ring rounded-2xl p-5 hover-elevate transition-all duration-300"
                data-testid={`achievement-card-${idx}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold whitespace-normal break-words">{a.title}</div>
                    <div className="mt-1 text-xs font-mono text-muted-foreground">
                      {a.type.toUpperCase()} • {a.year}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/25 p-2">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <Separator className="my-4 bg-border/70" />

                <div className="text-sm text-foreground whitespace-pre-wrap">{a.details}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {admin ? <AchievementCreateDialog open={open} onOpenChange={setOpen} /> : null}
    </AppShell>
  );
}
