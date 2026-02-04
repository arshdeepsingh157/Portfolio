import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectFormDialog } from "@/components/forms/ProjectFormDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileX2, Plus, Github, ExternalLink, Search } from "lucide-react";
import { useProjects } from "@/hooks/use-portfolio";
import { isAdmin } from "@/lib/admin";

export default function ProjectsPage() {
  const q = useProjects();
  const admin = isAdmin();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const items = q.data ?? [];
    return items.filter((p) => {
      const s = search.trim().toLowerCase();
      const matchesSearch =
        !s ||
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tools.toLowerCase().includes(s);
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [q.data, search, category]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!q.data || !selectedId) return null;
    return q.data.find((p) => p.id === selectedId) ?? null;
  }, [q.data, selectedId]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <AppShell>
      <Seo
        title="Projects — Arshdeep Singh"
        description="Cybersecurity projects presented like SOC playbooks: what I did, tools, and key findings."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader
          title="Projects"
          eyebrow="capabilities"
          data-testid="projects-header"
          right={
            admin ? (
              <Button
                onClick={() => {
                  setFormMode("create");
                  setFormOpen(true);
                }}
                data-testid="projects-create"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            ) : null
          }
        />

        <Card className="glass neon-ring rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <Search className="h-4 w-4" /> search
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, tools, description..."
                className="mt-1"
                data-testid="projects-search"
              />
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground">category</div>
              <Select value={category} onValueChange={(v) => setCategory(v)} >
                <SelectTrigger className="mt-1" data-testid="projects-category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {["web_security", "defensive_security", "automation", "network_security", "training"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.replaceAll("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {q.isError ? (
          <Card className="glass rounded-2xl p-6">
            <div className="text-sm font-semibold">Failed to load projects</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">
              {(q.error as any)?.message ?? "Unknown error"}
            </div>
          </Card>
        ) : q.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass rounded-2xl p-5">
                <Skeleton className="h-5 w-2/3 bg-muted/40" />
                <Skeleton className="mt-3 h-3 w-full bg-muted/40" />
                <Skeleton className="mt-2 h-3 w-4/5 bg-muted/40" />
                <Skeleton className="mt-5 h-9 w-full bg-muted/40" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="glass neon-ring rounded-2xl p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
              <FileX2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-semibold">No matching projects</div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">
              Try different filters, or create a new project record.
            </div>
            <div className="mt-4">
              {admin ? (
                <Button
                  onClick={() => {
                    setFormMode("create");
                    setFormOpen(true);
                  }}
                  data-testid="projects-empty-create"
                >
                  Create Project
                </Button>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, idx) => (
              <Card
                key={p.id}
                className="glass neon-ring rounded-2xl p-5 hover-elevate transition-all duration-300"
                data-testid={`project-card-${idx}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="mt-1 text-xs font-mono text-muted-foreground">
                      {p.category.replaceAll("_", " ")}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/25 p-2">
                    <Github className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <Separator className="my-4 bg-border/70" />

                <div className="text-sm text-muted-foreground line-clamp-4">{p.description}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedId(p.id);
                      setOpen(true);
                    }}
                    data-testid={`project-open-${idx}`}
                  >
                    Open
                  </Button>
                  {admin ? (
                    <Button
                      onClick={() => {
                        setSelectedId(p.id);
                        setFormMode("edit");
                        setFormOpen(true);
                      }}
                      variant="secondary"
                      data-testid={`project-edit-${idx}`}
                    >
                      Edit
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ProjectModal open={open} onOpenChange={setOpen} project={selected as any} />
      {admin ? (
        <ProjectFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          initial={formMode === "edit" ? (selected as any) : null}
        />
      ) : null}
    </AppShell>
  );
}
