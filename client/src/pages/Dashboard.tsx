import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Radar, ShieldCheck, FlaskConical, GraduationCap, FolderKanban, Activity } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { TerminalHero } from "@/components/TerminalHero";
import { SectionHeader } from "@/components/SectionHeader";
import { KpiCard } from "@/components/KpiCard";
import { ProjectModal } from "@/components/ProjectModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioOverview } from "@/hooks/use-portfolio";

export default function Dashboard() {
  const [, nav] = useLocation();
  const overview = usePortfolioOverview();
  const [projectOpen, setProjectOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    if (!overview.data || !selectedProjectId) return null;
    return overview.data.projects.find((p) => p.id === selectedProjectId) ?? null;
  }, [overview.data, selectedProjectId]);

  const kpis = useMemo(() => {
    const labs = overview.data?.labs ?? [];
    const certs = overview.data?.certifications ?? [];
    return {
      labs: labs.length,
      certs: certs.length,
    };
  }, [overview.data]);

  return (
    <AppShell>
      <Seo
        title="SOC Dashboard — Arshdeep Singh"
        description="SOC-console style cybersecurity portfolio: live alerts, projects, labs, certifications, and experience timeline."
      />

      <div className="space-y-6 lg:space-y-7">
        <TerminalHero
          onViewProjects={() => nav("/projects")}
          onResume={() => {
            // onClick handler required even when disabled; browser will ignore if disabled
            window.location.href = "/ArshdeepSinghResume.pdf";
          }}
        />

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {overview.isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="glass rounded-2xl p-5">
                <Skeleton className="h-4 w-32 bg-muted/40" />
                <Skeleton className="mt-4 h-10 w-24 bg-muted/40" />
                <Skeleton className="mt-3 h-3 w-40 bg-muted/40" />
              </Card>
            ))
          ) : (
            <>
              <KpiCard
                title="Labs Completed"
                value={kpis.labs}
                hint="hands-on practice"
                icon={FlaskConical}
                accent="primary"
                data-testid="kpi-labs"
              />
              <KpiCard
                title="Certifications"
                value={kpis.certs}
                hint="validated skills"
                icon={GraduationCap}
                accent="primary"
                data-testid="kpi-certs"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7">
          {/* Experience timeline */}
          <div className="lg:col-span-12">
            <SectionHeader
              title="Experience Timeline"
              eyebrow="ops history"
              data-testid="dashboard-experience-header"
              right={
                <Button variant="secondary" onClick={() => nav("/experience")} data-testid="dashboard-go-experience">
                  View All
                </Button>
              }
            />
            <div className="mt-3 glass neon-ring-accent rounded-2xl p-4 sm:p-5">
              {overview.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full bg-muted/40" />
                  ))}
                </div>
              ) : (overview.data?.experience?.length ?? 0) === 0 ? (
                <div className="p-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="mt-3 text-sm font-semibold">No experience items</div>
                  <div className="mt-1 text-xs font-mono text-muted-foreground">Add entries from the Experience page.</div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[10px] top-2 bottom-2 w-px bg-border/70" />
                  <div className="grid gap-3">
                    {(overview.data?.experience ?? []).slice(0, 4).map((e, i) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 * i }}
                        className="relative pl-8"
                        data-testid={`dashboard-exp-${i}`}
                      >
                        <div className="absolute left-0 top-2 h-5 w-5 rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_24px_rgba(60,255,210,0.22)]" />
                        <div className="rounded-2xl border border-border/70 bg-background/25 p-4 hover-elevate transition-all duration-300">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold">{e.role}</div>
                              <div className="mt-1 text-xs font-mono text-muted-foreground truncate">
                                {e.org} • {e.location}
                              </div>
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground shrink-0">
                              {String(e.startMonth).padStart(2, "0")}/{e.startYear}{" "}
                              {e.isCurrent ? "→ present" : e.endMonth && e.endYear ? `→ ${String(e.endMonth).padStart(2, "0")}/${e.endYear}` : ""}
                            </div>
                          </div>
                          <Separator className="my-3 bg-border/70" />
                          <div className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                            {e.highlights}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects spotlight */}
        <div>
          <SectionHeader
            title="Projects Spotlight"
            eyebrow="tooling + impact"
            data-testid="dashboard-projects-header"
            right={
              <Button onClick={() => nav("/projects")} data-testid="dashboard-go-projects" className="gap-2">
                <FolderKanban className="h-4 w-4" />
                View All Projects
              </Button>
            }
          />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overview.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="glass rounded-2xl p-5">
                  <Skeleton className="h-5 w-2/3 bg-muted/40" />
                  <Skeleton className="mt-3 h-3 w-full bg-muted/40" />
                  <Skeleton className="mt-2 h-3 w-4/5 bg-muted/40" />
                  <Skeleton className="mt-5 h-9 w-full bg-muted/40" />
                </Card>
              ))
            ) : (overview.data?.projects?.length ?? 0) === 0 ? (
              <Card className="glass rounded-2xl p-8 sm:col-span-2 lg:col-span-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30">
                  <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="mt-3 text-sm font-semibold">No projects found</div>
                <div className="mt-1 text-xs font-mono text-muted-foreground">
                  Add projects from the Projects page to populate spotlight cards.
                </div>
              </Card>
            ) : (
              (overview.data?.projects ?? []).slice(0, 4).map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setProjectOpen(true);
                  }}
                  data-testid={`dashboard-project-card-${idx}`}
                  className="glass neon-ring rounded-2xl p-5 text-left hover-elevate transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="mt-1 text-xs font-mono text-muted-foreground">
                        {p.category.replaceAll("_", " ")}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/25 p-2">
                      <Radar className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <Separator className="my-4 bg-border/70" />
                  <div className="text-sm text-muted-foreground line-clamp-4">{p.description}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-primary">
                    open details <span className="opacity-70">↗</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <ProjectModal open={projectOpen} onOpenChange={setProjectOpen} project={selectedProject as any} />
    </AppShell>
  );
}
