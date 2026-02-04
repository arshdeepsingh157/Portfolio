import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type { PortfolioAlert } from "@shared/schema";
import { api } from "@shared/routes";
import { useCreateAlert, useUpdateAlert } from "@/hooks/use-alerts";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = api.alerts.create.input.extend({
  firstSeen: z.coerce.number(),
  lastSeen: z.coerce.number(),
  count: z.coerce.number().min(1).default(1),
  isSuppressed: z.coerce.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

function nowEpochSec() {
  return Math.floor(Date.now() / 1000);
}

function initialForCreate(): FormValues {
  const now = nowEpochSec();
  return {
    title: "Suspicious Auth Burst",
    summary: "Multiple failed logins followed by a successful attempt.",
    severity: "high",
    status: "open",
    source: "SIEM",
    environment: "prod",
    technique: "Credential Access",
    indicator: "user=jdoe ip=203.0.113.55",
    mitreTactic: "Credential Access",
    mitreTechnique: "T1110 Brute Force",
    firstSeen: now - 3600,
    lastSeen: now,
    count: 7,
    isSuppressed: false,
  };
}

export default function AlertUpsertDialog({
  open,
  onOpenChange,
  mode,
  alert,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  mode: "create" | "edit";
  alert?: PortfolioAlert | null;
}) {
  const { toast } = useToast();
  const create = useCreateAlert();
  const update = useUpdateAlert();

  const [values, setValues] = useState<FormValues>(initialForCreate());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const header = useMemo(() => {
    return mode === "create" ? "Create Alert" : "Edit Alert";
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setValues(initialForCreate());
      setErrors({});
      return;
    }
    if (mode === "edit" && alert) {
      setValues({
        title: alert.title,
        summary: alert.summary,
        severity: alert.severity,
        status: alert.status,
        source: alert.source,
        environment: alert.environment,
        technique: alert.technique,
        indicator: alert.indicator,
        mitreTactic: alert.mitreTactic,
        mitreTechnique: alert.mitreTechnique,
        firstSeen: alert.firstSeen,
        lastSeen: alert.lastSeen,
        count: alert.count,
        isSuppressed: alert.isSuppressed,
      });
      setErrors({});
    }
  }, [open, mode, alert]);

  const submit = async () => {
    setErrors({});
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path.join(".") || "form";
        next[key] = i.message;
      });
      setErrors(next);
      toast({ title: "Validation error", description: "Check highlighted fields.", variant: "destructive" });
      return;
    }

    if (mode === "create") {
      create.mutate(parsed.data, {
        onSuccess: () => {
          toast({ title: "Alert created", description: "New alert ingested into the console." });
          onOpenChange(false);
        },
        onError: (e) => {
          toast({ title: "Create failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
        },
      });
      return;
    }

    if (mode === "edit" && alert) {
      update.mutate(
        { id: alert.id, updates: parsed.data },
        {
          onSuccess: () => {
            toast({ title: "Alert updated", description: "Changes synced." });
            onOpenChange(false);
          },
          onError: (e) => {
            toast({ title: "Update failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
          },
        },
      );
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="alert-upsert-title">{header}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Simulate a SOC ingestion event with realistic fields."
              : "Tune the alert metadata and response state."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              data-testid="alert-form-title"
              id="title"
              value={values.title}
              onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
              className={cn(errors.title && "border-destructive focus-visible:ring-destructive/20")}
              placeholder="Alert title"
            />
            {errors.title ? <div className="mt-1 text-xs text-destructive">{errors.title}</div> : null}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              data-testid="alert-form-summary"
              id="summary"
              value={values.summary}
              onChange={(e) => setValues((p) => ({ ...p, summary: e.target.value }))}
              className={cn("min-h-[90px]", errors.summary && "border-destructive focus-visible:ring-destructive/20")}
              placeholder="Short investigation-friendly summary"
            />
            {errors.summary ? <div className="mt-1 text-xs text-destructive">{errors.summary}</div> : null}
          </div>

          <div>
            <Label>Severity</Label>
            <Select
              value={values.severity}
              onValueChange={(v) => setValues((p) => ({ ...p, severity: v as FormValues["severity"] }))}
            >
              <SelectTrigger data-testid="alert-form-severity" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">critical</SelectItem>
                <SelectItem value="high">high</SelectItem>
                <SelectItem value="medium">medium</SelectItem>
                <SelectItem value="low">low</SelectItem>
                <SelectItem value="info">info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={values.status}
              onValueChange={(v) => setValues((p) => ({ ...p, status: v as FormValues["status"] }))}
            >
              <SelectTrigger data-testid="alert-form-status" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">open</SelectItem>
                <SelectItem value="investigating">investigating</SelectItem>
                <SelectItem value="contained">contained</SelectItem>
                <SelectItem value="resolved">resolved</SelectItem>
                <SelectItem value="false_positive">false_positive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              data-testid="alert-form-source"
              id="source"
              value={values.source}
              onChange={(e) => setValues((p) => ({ ...p, source: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="environment">Environment</Label>
            <Input
              data-testid="alert-form-environment"
              id="environment"
              value={values.environment}
              onChange={(e) => setValues((p) => ({ ...p, environment: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="technique">Technique</Label>
            <Input
              data-testid="alert-form-technique"
              id="technique"
              value={values.technique}
              onChange={(e) => setValues((p) => ({ ...p, technique: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="indicator">Indicator</Label>
            <Input
              data-testid="alert-form-indicator"
              id="indicator"
              value={values.indicator}
              onChange={(e) => setValues((p) => ({ ...p, indicator: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mitreTactic">MITRE Tactic</Label>
            <Input
              data-testid="alert-form-mitre-tactic"
              id="mitreTactic"
              value={values.mitreTactic}
              onChange={(e) => setValues((p) => ({ ...p, mitreTactic: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mitreTechnique">MITRE Technique</Label>
            <Input
              data-testid="alert-form-mitre-technique"
              id="mitreTechnique"
              value={values.mitreTechnique}
              onChange={(e) => setValues((p) => ({ ...p, mitreTechnique: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="firstSeen">First Seen (epoch seconds)</Label>
            <Input
              data-testid="alert-form-first-seen"
              id="firstSeen"
              type="number"
              value={values.firstSeen}
              onChange={(e) => setValues((p) => ({ ...p, firstSeen: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="lastSeen">Last Seen (epoch seconds)</Label>
            <Input
              data-testid="alert-form-last-seen"
              id="lastSeen"
              type="number"
              value={values.lastSeen}
              onChange={(e) => setValues((p) => ({ ...p, lastSeen: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="count">Count</Label>
            <Input
              data-testid="alert-form-count"
              id="count"
              type="number"
              value={values.count}
              onChange={(e) => setValues((p) => ({ ...p, count: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-card-border bg-card/30 px-4 py-3 mt-6 md:mt-0">
            <div>
              <div className="text-sm font-semibold">Suppressed</div>
              <div className="text-xs text-muted-foreground">Hide from active triage noise</div>
            </div>
            <Switch
              data-testid="alert-form-suppressed"
              checked={values.isSuppressed}
              onCheckedChange={(v) => setValues((p) => ({ ...p, isSuppressed: v }))}
            />
          </div>
        </div>

        <Separator className="my-2 bg-border/60" />

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
          <Button
            data-testid="alert-form-cancel"
            variant="outline"
            className="rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            data-testid="alert-form-submit"
            className="rounded-2xl"
            disabled={isPending}
            onClick={submit}
          >
            {isPending ? "Saving..." : mode === "create" ? "Create Alert" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
