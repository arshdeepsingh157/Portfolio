import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertDrawer } from "@/components/AlertDrawer";
import { AlertFormDialog } from "@/components/forms/AlertFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileX2, Plus, SlidersHorizontal } from "lucide-react";
import { useAlertsList } from "@/hooks/use-portfolio";
import { isAdmin } from "@/lib/admin";

export default function AlertsPage() {
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [suppressed, setSuppressed] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const params = useMemo(() => {
    const p: Record<string, any> = {};
    if (severity !== "all") p.severity = severity;
    if (status !== "all") p.status = status;
    if (suppressed !== "all") p.suppressed = suppressed === "true";
    if (search.trim()) p.search = search.trim();
    return p;
  }, [severity, status, suppressed, search]);

  const q = useAlertsList(params);
  const admin = isAdmin();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!q.data || !selectedId) return null;
    return q.data.find((a) => a.id === selectedId) ?? null;
  }, [q.data, selectedId]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  return (
    <AppShell>
      <Seo
        title="Alerts Console — Arshdeep Singh"
        description="SOC alerts console with filtering, triage view, and investigation drawer."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader
          title="Alerts Console"
          eyebrow="detections"
          data-testid="alerts-header"
          right={
            <div className="flex items-center gap-2">
              {admin ? (
                <Button
                  onClick={() => {
                    setFormMode("create");
                    setFormOpen(true);
                  }}
                  data-testid="alerts-create"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Alert
                </Button>
              ) : null}
            </div>
          }
        />

        {/* Filters */}
        <Card className="glass neon-ring rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              filters (server-side query params)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full md:max-w-4xl">
              <div>
                <div className="text-xs font-mono text-muted-foreground">Severity</div>
                <Select value={severity} onValueChange={(v) => setSeverity(v)} >
                  <SelectTrigger data-testid="filter-severity" className="mt-1">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {["critical", "high", "medium", "low", "info"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-xs font-mono text-muted-foreground">Status</div>
                <Select value={status} onValueChange={(v) => setStatus(v)}>
                  <SelectTrigger data-testid="filter-status" className="mt-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {["open", "investigating", "contained", "resolved", "false_positive"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replaceAll("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-xs font-mono text-muted-foreground">Suppressed</div>
                <Select value={suppressed} onValueChange={(v) => setSuppressed(v)}>
                  <SelectTrigger data-testid="filter-suppressed" className="mt-1">
                    <SelectValue placeholder="Suppressed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Suppressed</SelectItem>
                    <SelectItem value="false">Not suppressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-xs font-mono text-muted-foreground">Search</div>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title / indicator..."
                  data-testid="filter-search"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="glass neon-ring rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-border/70 flex items-center justify-between">
            <div className="text-xs font-mono text-muted-foreground">
              results: <span className="text-foreground">{q.data?.length ?? 0}</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => q.refetch()}
              data-testid="alerts-refresh"
            >
              Refresh
            </Button>
          </div>

          {q.isError ? (
            <div className="p-6">
              <div className="text-sm font-semibold">Failed to load alerts</div>
              <div className="mt-1 text-xs font-mono text-muted-foreground">
                {(q.error as any)?.message ?? "Unknown error"}
              </div>
            </div>
          ) : q.isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted/40" />
              ))}
            </div>
          ) : (q.data?.length ?? 0) === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
                <FileX2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="mt-3 text-sm font-semibold">No matching alerts</div>
              <div className="mt-1 text-xs font-mono text-muted-foreground">
                Adjust filters or create a new alert.
              </div>
              <div className="mt-4">
                {admin ? (
                  <Button
                    onClick={() => {
                      setFormMode("create");
                      setFormOpen(true);
                    }}
                    data-testid="empty-create-alert"
                  >
                    Create Alert
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {q.data!.map((a, idx) => (
                <div key={a.id} className="px-4 sm:px-5 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <button
                      type="button"
                      className="text-left min-w-0 hover:opacity-95 transition-opacity"
                      onClick={() => {
                        setSelectedId(a.id);
                        setDrawerOpen(true);
                      }}
                      data-testid={`alert-open-${idx}`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-semibold">{a.title}</div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          id:{a.id.slice(0, 8)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {a.summary}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                          src: <span className="text-foreground">{a.source}</span>
                        </span>
                        <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                          env: <span className="text-foreground">{a.environment}</span>
                        </span>
                        <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                          count: <span className="text-foreground">{a.count}</span>
                        </span>
                        <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                          suppressed: <span className="text-foreground">{a.isSuppressed ? "true" : "false"}</span>
                        </span>
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={a.severity} />
                      <StatusBadge status={a.status} />
                      <Separator orientation="vertical" className="h-7 bg-border/70 hidden sm:block" />
                      {admin ? (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setFormMode("edit");
                            setSelectedId(a.id);
                            setFormOpen(true);
                          }}
                          data-testid={`alert-edit-${idx}`}
                        >
                          Edit
                        </Button>
                      ) : null}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedId(a.id);
                          setDrawerOpen(true);
                        }}
                        data-testid={`alert-investigate-${idx}`}
                      >
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <AlertDrawer open={drawerOpen} onOpenChange={setDrawerOpen} alert={selected as any} />
      {admin ? (
        <AlertFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          initial={formMode === "edit" ? (selected as any) : null}
        />
      ) : null}
    </AppShell>
  );
}
