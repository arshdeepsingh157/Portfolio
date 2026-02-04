import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Bug, Crosshair, Database, EyeOff, Fingerprint, ShieldCheck, ShieldX, Zap } from "lucide-react";
import type { PortfolioAlert } from "@shared/schema";
import { useUpdateAlert } from "@/hooks/use-alerts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { buildUrl, api } from "@shared/routes";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge, StatusBadge } from "@/components/SeverityBadge";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function epochToDate(epochSeconds: number) {
  const ms = epochSeconds * 1000;
  return new Date(ms);
}

export default function AlertDetailsDrawer({
  alert,
  open,
  onOpenChange,
}: {
  alert: PortfolioAlert | null;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { toast } = useToast();
  const update = useUpdateAlert();
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const title = alert?.title ?? "Alert Details";
  const seen = useMemo(() => {
    if (!alert) return null;
    return {
      first: format(epochToDate(alert.firstSeen), "PPpp"),
      last: format(epochToDate(alert.lastSeen), "PPpp"),
    };
  }, [alert]);

  const setStatus = async (status: PortfolioAlert["status"]) => {
    if (!alert) return;
    setBusyAction(status);
    update.mutate(
      { id: alert.id, updates: { status } },
      {
        onSuccess: () => {
          toast({ title: "Status updated", description: `Alert moved to "${status}".` });
          setBusyAction(null);
        },
        onError: (e) => {
          toast({ title: "Update failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
          setBusyAction(null);
        },
      },
    );
  };

  const toggleSuppress = async () => {
    if (!alert) return;
    setBusyAction(alert.isSuppressed ? "unsuppress" : "suppress");
    update.mutate(
      { id: alert.id, updates: { isSuppressed: !alert.isSuppressed } },
      {
        onSuccess: () => {
          toast({
            title: alert.isSuppressed ? "Alert unsuppressed" : "Alert suppressed",
            description: alert.isSuppressed
              ? "Alert will reappear in active triage."
              : "Alert removed from active noise floor.",
          });
          setBusyAction(null);
        },
        onError: (e) => {
          toast({ title: "Update failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
          setBusyAction(null);
        },
      },
    );
  };

  const copyDeepLink = async () => {
    if (!alert) return;
    const url = `${window.location.origin}${buildUrl(api.alerts.get.path.replace("/api", ""), { id: alert.id })}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Copied link", description: "Deep link copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard permission denied.", variant: "destructive" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle data-testid="alert-drawer-title" className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" />
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Investigation context, indicators, and response actions.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6 sm:px-6">
            {!alert ? (
              <div className="rounded-2xl border border-card-border bg-card/35 p-5 text-sm text-muted-foreground">
                Select an alert row to open details.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-4">
                <div className="rounded-3xl border border-card-border bg-card/35 p-5 soc-noise">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={alert.severity} />
                    <StatusBadge status={alert.status} />
                    {alert.isSuppressed ? (
                      <Badge variant="outline" className="rounded-xl border-border/70 bg-muted/20 text-muted-foreground">
                        <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                        suppressed
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-card-border bg-background/20 p-4">
                      <div className="text-xs text-muted-foreground">Summary</div>
                      <div data-testid="alert-summary" className="mt-2 text-sm leading-relaxed">
                        {alert.summary}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-card-border bg-background/20 p-4">
                      <div className="text-xs text-muted-foreground">Indicator</div>
                      <div data-testid="alert-indicator" className="mt-2 font-mono text-sm text-foreground/90 break-all">
                        {alert.indicator}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Count: <span className="text-foreground">{alert.count}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-card-border bg-background/20 p-4">
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-secondary" />
                        Source / Env
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">{alert.source}</span>{" "}
                        <span className="text-muted-foreground">•</span>{" "}
                        <span className="text-foreground/90">{alert.environment}</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        First seen: <span className="text-foreground">{seen?.first}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Last seen: <span className="text-foreground">{seen?.last}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-card-border bg-background/20 p-4">
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Fingerprint className="h-3.5 w-3.5 text-accent" />
                        Technique / MITRE
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">{alert.technique}</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Tactic: <span className="text-foreground">{alert.mitreTactic}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Technique: <span className="text-foreground">{alert.mitreTechnique}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-5 bg-border/60" />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      data-testid="alert-action-investigating"
                      onClick={() => setStatus("investigating")}
                      disabled={update.isPending}
                      className={cn("rounded-2xl", busyAction === "investigating" && "opacity-80")}
                      variant="secondary"
                    >
                      <Crosshair className="mr-2 h-4 w-4 text-accent" />
                      {busyAction === "investigating" ? "Updating..." : "Mark Investigating"}
                    </Button>

                    <Button
                      data-testid="alert-action-contained"
                      onClick={() => setStatus("contained")}
                      disabled={update.isPending}
                      className={cn("rounded-2xl", busyAction === "contained" && "opacity-80")}
                      variant="secondary"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4 text-secondary" />
                      {busyAction === "contained" ? "Updating..." : "Mark Contained"}
                    </Button>

                    <Button
                      data-testid="alert-action-resolved"
                      onClick={() => setStatus("resolved")}
                      disabled={update.isPending}
                      className={cn("rounded-2xl", busyAction === "resolved" && "opacity-80")}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {busyAction === "resolved" ? "Updating..." : "Resolve"}
                    </Button>

                    <Button
                      data-testid="alert-action-fp"
                      onClick={() => setStatus("false_positive")}
                      disabled={update.isPending}
                      className={cn("rounded-2xl", busyAction === "false_positive" && "opacity-80")}
                      variant="outline"
                    >
                      <ShieldX className="mr-2 h-4 w-4 text-muted-foreground" />
                      False Positive
                    </Button>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          data-testid="alert-action-suppress"
                          onClick={toggleSuppress}
                          disabled={update.isPending}
                          className="rounded-2xl"
                          variant="outline"
                        >
                          <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
                          {busyAction === "suppress" || busyAction === "unsuppress"
                            ? "Updating..."
                            : alert.isSuppressed
                              ? "Unsuppress"
                              : "Suppress"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {alert.isSuppressed
                          ? "Bring alert back to active triage."
                          : "Suppress repetitive noise (still preserved)."}
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      data-testid="alert-action-copy-link"
                      onClick={copyDeepLink}
                      className="rounded-2xl"
                      variant="outline"
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-card-border bg-card/35 p-5 soc-noise">
                  <div className="text-sm font-semibold">Investigation Notes</div>
                  <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Use these fields as recruiter-readable context. Keep it short: what happened, why it matters, and what you did.
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-card-border bg-background/20 p-4">
                      <div className="text-xs text-muted-foreground">Suggested Next Steps</div>
                      <ul className="mt-2 space-y-2 text-xs text-foreground/90">
                        <li className="flex gap-2">
                          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-secondary" />
                          Pivot indicator to other hosts/users; confirm lateral movement.
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
                          Check for persistence via scheduled tasks / registry keys.
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                          Validate with additional telemetry (EDR, auth logs).
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-card-border bg-background/20 p-4">
                      <div className="text-xs text-muted-foreground">Recruiter Summary</div>
                      <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        This drawer is wired to <span className="font-mono text-foreground/90">PUT /api/alerts/:id</span>.
                        Actions update status/suppression and refresh queries.
                      </div>
                    </div>
                  </div>

                  <Separator className="my-5 bg-border/60" />

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">State</div>
                    <div className="text-xs text-muted-foreground">
                      {update.isPending ? "syncing..." : "ready"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
