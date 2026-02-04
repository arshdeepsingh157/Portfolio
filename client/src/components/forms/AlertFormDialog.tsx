import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCreateAlert, useUpdateAlert } from "@/hooks/use-portfolio";

const formSchema = api.alerts.create.input.extend({
  firstSeen: z.coerce.number(),
  lastSeen: z.coerce.number(),
  count: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AlertLike = {
  id: string;
  title: string;
  summary: string;
  severity: any;
  status: any;
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

export function AlertFormDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: AlertLike | null;
}) {
  const { toast } = useToast();
  const create = useCreateAlert();
  const update = useUpdateAlert();

  const defaults = useMemo<FormValues>(() => {
    const now = Math.floor(Date.now() / 1000);
    if (props.mode === "edit" && props.initial) {
      return {
        title: props.initial.title,
        summary: props.initial.summary,
        severity: props.initial.severity,
        status: props.initial.status,
        source: props.initial.source,
        environment: props.initial.environment,
        technique: props.initial.technique,
        indicator: props.initial.indicator,
        mitreTactic: props.initial.mitreTactic,
        mitreTechnique: props.initial.mitreTechnique,
        firstSeen: props.initial.firstSeen,
        lastSeen: props.initial.lastSeen,
        count: props.initial.count ?? 1,
        isSuppressed: props.initial.isSuppressed ?? false,
      };
    }
    return {
      title: "",
      summary: "",
      severity: "medium",
      status: "open",
      source: "SIEM",
      environment: "lab",
      technique: "suspicious_auth",
      indicator: "ip: 0.0.0.0",
      mitreTactic: "TA0006 Credential Access",
      mitreTechnique: "T1110 Brute Force",
      firstSeen: now - 3600,
      lastSeen: now,
      count: 1,
      isSuppressed: false,
    };
  }, [props.mode, props.initial]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaults);
  }, [defaults]); // eslint-disable-line react-hooks/exhaustive-deps

  const pending = create.isPending || update.isPending;

  const onSubmit = async (values: FormValues) => {
    try {
      if (props.mode === "create") {
        await create.mutateAsync(values);
        toast({ title: "Alert created", description: "New incident added to your console feed." });
      } else {
        if (!props.initial?.id) throw new Error("Missing alert id");
        // updates are partial per contract
        await update.mutateAsync({ id: props.initial.id, updates: values });
        toast({ title: "Alert updated", description: "Incident record updated." });
      }
      props.onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Action failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-3xl border-border/70 bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="alert-form-title">
            {props.mode === "create" ? "Create Alert" : "Edit Alert"}
          </DialogTitle>
          <DialogDescription>
            SOC-style alert record: title, indicator, MITRE mapping, and workflow status.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2 bg-border/70" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="alert-form">
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Title</label>
            <Input
              data-testid="alert-title"
              placeholder="e.g., Multiple failed logins from suspicious ASN"
              {...form.register("title")}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Summary</label>
            <Textarea
              data-testid="alert-summary"
              placeholder="Short analyst summary..."
              {...form.register("summary")}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Severity</label>
            <Select
              value={form.watch("severity")}
              onValueChange={(v) => form.setValue("severity", v as any, { shouldValidate: true })}
            >
              <SelectTrigger data-testid="alert-severity" className="mt-1">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {["critical", "high", "medium", "low", "info"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Status</label>
            <Select
              value={form.watch("status")}
              onValueChange={(v) => form.setValue("status", v as any, { shouldValidate: true })}
            >
              <SelectTrigger data-testid="alert-status" className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {["open", "investigating", "contained", "resolved", "false_positive"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replaceAll("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Source</label>
            <Input data-testid="alert-source" {...form.register("source")} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Environment</label>
            <Input data-testid="alert-environment" {...form.register("environment")} className="mt-1" />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Technique</label>
            <Input data-testid="alert-technique" {...form.register("technique")} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Indicator</label>
            <Input data-testid="alert-indicator" {...form.register("indicator")} className="mt-1" />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">MITRE Tactic</label>
            <Input data-testid="alert-mitre-tactic" {...form.register("mitreTactic")} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">MITRE Technique</label>
            <Input data-testid="alert-mitre-technique" {...form.register("mitreTechnique")} className="mt-1" />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">First Seen (epoch sec)</label>
            <Input data-testid="alert-first-seen" type="number" {...form.register("firstSeen")} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Last Seen (epoch sec)</label>
            <Input data-testid="alert-last-seen" type="number" {...form.register("lastSeen")} className="mt-1" />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Count</label>
            <Input data-testid="alert-count" type="number" {...form.register("count")} className="mt-1" />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => props.onOpenChange(false)}
              data-testid="alert-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || pending} data-testid="alert-submit">
              {pending ? "Saving..." : props.mode === "create" ? "Create Alert" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
