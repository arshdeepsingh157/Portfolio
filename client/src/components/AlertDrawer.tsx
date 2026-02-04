import { useMemo, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { useUpdateAlert } from "@/hooks/use-portfolio";

type AlertLike = {
  id: string;
  title: string;
  summary: string;
  severity: string;
  status: string;
  source: string;
  environment: string;
  technique: string;
  indicator: string;
  mitreTactic: string;
  mitreTechnique: string;
  firstSeen: number;
  lastSeen: number;
  count: number;
  isSuppressed: boolean;
};

function fmt(ts: number) {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return String(ts);
  }
}

export function AlertDrawer(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  alert: AlertLike | null;
}) {
  const { toast } = useToast();
  const update = useUpdateAlert();
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const actions = useMemo(
    () => [
      { label: "Open", value: "open" },
      { label: "Investigating", value: "investigating" },
      { label: "Contained", value: "contained" },
      { label: "Resolved", value: "resolved" },
      { label: "False Positive", value: "false_positive" },
    ],
    [],
  );

  const doUpdate = async (updates: Record<string, unknown>) => {
    if (!props.alert) return;
    try {
      await update.mutateAsync({ id: props.alert.id, updates });
      toast({ title: "Alert updated", description: "Change committed to the incident record." });
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent className="bg-background/90 border-border/70">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-5">
          <DrawerHeader className="px-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DrawerTitle className="text-2xl leading-tight" data-testid="alert-drawer-title">
                    {props.alert?.title ?? "Alert"}
                  </DrawerTitle>
                  <DrawerDescription className="mt-2 text-sm text-muted-foreground" data-testid="alert-drawer-summary">
                    {props.alert?.summary ?? "No summary available."}
                  </DrawerDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <SeverityBadge severity={props.alert?.severity} />
                  <StatusBadge status={props.alert?.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground">
                  id: <span className="text-foreground">{props.alert?.id ?? "-"}</span>
                </div>
                <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground">
                  count: <span className="text-foreground">{props.alert?.count ?? 0}</span>
                </div>
                <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground">
                  suppressed:{" "}
                  <span className="text-foreground">{props.alert?.isSuppressed ? "true" : "false"}</span>
                </div>
              </div>
            </div>
          </DrawerHeader>

          <Separator className="my-5 bg-border/70" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4">
              <div className="text-xs font-mono text-muted-foreground">telemetry</div>
              <dl className="mt-3 grid gap-3">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Source</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert?.source ?? "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Environment</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert?.environment ?? "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Indicator</dt>
                  <dd className="text-sm font-mono text-foreground text-right break-all">{props.alert?.indicator ?? "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">First Seen</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert ? fmt(props.alert.firstSeen) : "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Last Seen</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert ? fmt(props.alert.lastSeen) : "-"}</dd>
                </div>
              </dl>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="text-xs font-mono text-muted-foreground">mitre</div>
              <dl className="mt-3 grid gap-3">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Tactic</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert?.mitreTactic ?? "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Technique</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert?.mitreTechnique ?? "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Observed Technique</dt>
                  <dd className="text-sm font-mono text-foreground text-right">{props.alert?.technique ?? "-"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <Separator className="my-5 bg-border/70" />

          <div className="glass rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs font-mono text-muted-foreground">response</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Update alert workflow status or suppression flag (writes to backend).
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => doUpdate({ isSuppressed: !(props.alert?.isSuppressed ?? false) })}
                  disabled={!props.alert || update.isPending}
                  data-testid="alert-toggle-suppress"
                >
                  {props.alert?.isSuppressed ? "Unsuppress" : "Suppress"}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {actions.map((a) => (
                <Button
                  key={a.value}
                  variant={props.alert?.status === a.value ? "default" : "secondary"}
                  onClick={async () => {
                    setPendingStatus(a.value);
                    await doUpdate({ status: a.value });
                    setPendingStatus(null);
                  }}
                  disabled={!props.alert || update.isPending}
                  data-testid={`alert-set-status-${a.value}`}
                  className="transition-all"
                >
                  {pendingStatus === a.value && update.isPending ? "Updating..." : a.label}
                </Button>
              ))}
            </div>
          </div>

          <DrawerFooter className="px-0 pt-5">
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => props.onOpenChange(false)} data-testid="alert-close">
                Close
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
