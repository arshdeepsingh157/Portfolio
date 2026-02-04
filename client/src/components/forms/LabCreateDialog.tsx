import { useEffect, useState } from "react";
import { api, type LabInput } from "@shared/routes";
import { useCreateLab } from "@/hooks/use-labs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type FormValues = LabInput;

function initial(): FormValues {
  return {
    name: "Log Analysis — Suspicious PowerShell",
    type: "log_analysis",
    description: "Analyze Windows event logs to identify suspicious PowerShell execution and trace parent process chain.",
    tools: "Windows Event Viewer, Sigma rules, PowerShell, Sysmon",
    outcome: "Identified encoded commands; built detection notes and recommended blocking policy.",
    difficulty: "Intermediate",
    badge: "log_analysis",
    link: "https://example.com/lab",
  };
}

export default function LabCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { toast } = useToast();
  const create = useCreateLab();
  const [values, setValues] = useState<FormValues>(initial());

  useEffect(() => {
    if (open) setValues(initial());
  }, [open]);

  const submit = () => {
    const parsed = api.labs.create.input.safeParse(values);
    if (!parsed.success) {
      toast({ title: "Validation error", description: parsed.error.issues[0]?.message ?? "Invalid input", variant: "destructive" });
      return;
    }

    create.mutate(parsed.data, {
      onSuccess: () => {
        toast({ title: "Lab added", description: "New drill recorded." });
        onOpenChange(false);
      },
      onError: (e) => toast({ title: "Create failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="lab-create-title">Add Lab</DialogTitle>
          <DialogDescription>Hands-on lab entry: tools, outcome, and link.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input data-testid="lab-form-name" id="name" value={values.name} onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))} />
          </div>

          <div>
            <Label>Type</Label>
            <Select value={values.type} onValueChange={(v) => setValues((p) => ({ ...p, type: v as FormValues["type"] }))}>
              <SelectTrigger data-testid="lab-form-type" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sql_injection">sql_injection</SelectItem>
                <SelectItem value="password_strength">password_strength</SelectItem>
                <SelectItem value="siem_lab">siem_lab</SelectItem>
                <SelectItem value="firewall_lab">firewall_lab</SelectItem>
                <SelectItem value="networking">networking</SelectItem>
                <SelectItem value="log_analysis">log_analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Input
              data-testid="lab-form-difficulty"
              id="difficulty"
              value={values.difficulty}
              onChange={(e) => setValues((p) => ({ ...p, difficulty: e.target.value }))}
              className="mt-1"
              placeholder="Beginner / Intermediate / Advanced"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              data-testid="lab-form-description"
              id="description"
              value={values.description}
              onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
              className="mt-1 min-h-[92px]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="tools">Tools</Label>
            <Textarea
              data-testid="lab-form-tools"
              id="tools"
              value={values.tools}
              onChange={(e) => setValues((p) => ({ ...p, tools: e.target.value }))}
              className="mt-1 min-h-[72px]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Textarea
              data-testid="lab-form-outcome"
              id="outcome"
              value={values.outcome}
              onChange={(e) => setValues((p) => ({ ...p, outcome: e.target.value }))}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="badge">Badge</Label>
            <Input data-testid="lab-form-badge" id="badge" value={values.badge} onChange={(e) => setValues((p) => ({ ...p, badge: e.target.value }))} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="link">Link</Label>
            <Input data-testid="lab-form-link" id="link" value={values.link} onChange={(e) => setValues((p) => ({ ...p, link: e.target.value }))} className="mt-1" />
          </div>
        </div>

        <Separator className="my-2 bg-border/60" />

        <div className="flex items-center justify-end gap-2">
          <Button data-testid="lab-form-cancel" variant="outline" className="rounded-2xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button data-testid="lab-form-submit" className="rounded-2xl" disabled={create.isPending} onClick={submit}>
            {create.isPending ? "Saving..." : "Add Lab"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
