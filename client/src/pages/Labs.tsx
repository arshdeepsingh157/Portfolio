import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { LabCreateDialog } from "@/components/forms/SimpleCreateDialogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileX2, Plus, Search, FlaskConical } from "lucide-react";
import { useLabs } from "@/hooks/use-portfolio";

export default function LabsPage() {
  const q = useLabs();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const items = q.data ?? [];
    if (!s) return items;
    return items.filter((l) => {
      return (
        l.name.toLowerCase().includes(s) ||
        l.type.toLowerCase().includes(s) ||
        l.description.toLowerCase().includes(s) ||
        l.tools.toLowerCase().includes(s)
      );
    });
  }, [q.data, search]);

  return (
    <AppShell>
      <Seo
        title="Labs — Arshdeep Singh"
        description="Hands-on cybersecurity labs with tools, outcomes, and links."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader
          title="Labs"
          eyebrow="hands-on"
          data-testid="labs-header"
          right={
            <Button onClick={() => setOpen(true)} data-testid="labs-create" className="gap-2">
              <Plus className="h-4 w-4" /> Add Lab
            </Button>
          }
        />

        <Card className="glass neon-ring rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
            <Search className="h-4 w-4" /> search
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search labs by name, type, tools..."
            className="mt-1"
            data-testid="labs-search"
          />
        </Card>

        {q.isError ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Failed to load labs</div>
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
        ) : filtered.length === 0 ? (
          <Card className="glass neon-ring rounded-2xl p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
              <FileX2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-semibold">No matching labs</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">Add a lab record to populate this page.</div>
            <div className="mt-4">
              <Button onClick={() => setOpen(true)} data-testid="labs-empty-create">
                Add Lab
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((l, idx) => (
              <Card
                key={l.id}
                className="glass neon-ring rounded-2xl p-5 hover-elevate transition-all duration-300"
                data-testid={`lab-card-${idx}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{l.name}</div>
                    <div className="mt-1 text-xs font-mono text-muted-foreground">
                      {l.type.replaceAll("_", " ")} • {l.difficulty}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/25 p-2">
                    <FlaskConical className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <Separator className="my-4 bg-border/70" />

                <div className="text-sm text-muted-foreground line-clamp-3">{l.description}</div>

                <div className="mt-3 rounded-2xl border border-border/70 bg-background/20 p-3">
                  <div className="text-xs font-mono text-muted-foreground">outcome</div>
                  <div className="mt-1 text-sm text-foreground line-clamp-4 whitespace-pre-wrap">{l.outcome}</div>
                </div>

                <div className="mt-3 text-[11px] font-mono text-muted-foreground">
                  badge: <span className="text-foreground">{l.badge}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <LabCreateDialog open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
