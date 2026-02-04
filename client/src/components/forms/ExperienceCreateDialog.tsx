import { useEffect, useState } from "react";
import { z } from "zod";
import { api, type ExperienceInput } from "@shared/routes";
import { useCreateExperience } from "@/hooks/use-experience";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const formSchema = api.experience.create.input.extend({
  startMonth: z.coerce.number().min(1).max(12),
  startYear: z.coerce.number().min(1990).max(2100),
  endMonth: z.coerce.number().min(1).max(12).optional().nullable(),
  endYear: z.coerce.number().min(1990).max(2100).optional().nullable(),
  isCurrent: z.coerce.boolean().default(false),
});

type FormValues = ExperienceInput;

function initial(): FormValues {
  return {
    role: "SOC Analyst Intern",
    org: "Security Operations Lab",
    type: "internship",
    location: "Remote",
    startMonth: 6,
    startYear: 2024,
    endMonth: 9,
    endYear: 2024,
    isCurrent: false,
    highlights: "- Triaged alerts and enriched with MITRE context\n- Built queries to reduce noise\n- Documented findings for stakeholders",
  };
}

export default function ExperienceCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { toast } = useToast();
  const create = useCreateExperience();
  const [values, setValues] = useState<FormValues>(initial());

  useEffect(() => {
    if (open) setValues(initial());
  }, [open]);

  const submit = () => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      toast({ title: "Validation error", description: parsed.error.issues[0]?.message ?? "Invalid input", variant: "destructive" });
      return;
    }

    create.mutate(parsed.data, {
      onSuccess: () => {
        toast({ title: "Experience added", description: "Timeline updated." });
        onOpenChange(false);
      },
      onError: (e) => toast({ title: "Create failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="exp-create-title">Add Experience</DialogTitle>
          <DialogDescription>Timeline entries should be concise and impact-focused.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="role">Role</Label>
            <Input data-testid="exp-form-role" id="role" value={values.role} onChange={(e) => setValues((p) => ({ ...p, role: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="org">Organization</Label>
            <Input data-testid="exp-form-org" id="org" value={values.org} onChange={(e) => setValues((p) => ({ ...p, org: e.target.value }))} />
          </div>

          <div>
            <Label>Type</Label>
            <Select value={values.type} onValueChange={(v) => setValues((p) => ({ ...p, type: v as FormValues["type"] }))}>
              <SelectTrigger data-testid="exp-form-type" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job">job</SelectItem>
                <SelectItem value="internship">internship</SelectItem>
                <SelectItem value="training">training</SelectItem>
                <SelectItem value="volunteer">volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              data-testid="exp-form-location"
              id="location"
              value={values.location}
              onChange={(e) => setValues((p) => ({ ...p, location: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startMonth">Start Month</Label>
              <Input
                data-testid="exp-form-start-month"
                id="startMonth"
                type="number"
                value={values.startMonth}
                onChange={(e) => setValues((p) => ({ ...p, startMonth: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="startYear">Start Year</Label>
              <Input
                data-testid="exp-form-start-year"
                id="startYear"
                type="number"
                value={values.startYear}
                onChange={(e) => setValues((p) => ({ ...p, startYear: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="endMonth">End Month</Label>
              <Input
                data-testid="exp-form-end-month"
                id="endMonth"
                type="number"
                value={values.endMonth ?? ""}
                onChange={(e) => setValues((p) => ({ ...p, endMonth: e.target.value ? Number(e.target.value) : null }))}
                className="mt-1"
                disabled={values.isCurrent}
              />
            </div>
            <div>
              <Label htmlFor="endYear">End Year</Label>
              <Input
                data-testid="exp-form-end-year"
                id="endYear"
                type="number"
                value={values.endYear ?? ""}
                onChange={(e) => setValues((p) => ({ ...p, endYear: e.target.value ? Number(e.target.value) : null }))}
                className="mt-1"
                disabled={values.isCurrent}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-card-border bg-card/30 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Current</div>
              <div className="text-xs text-muted-foreground">If enabled, end date is ignored.</div>
            </div>
            <Switch
              data-testid="exp-form-current"
              checked={values.isCurrent}
              onCheckedChange={(v) => setValues((p) => ({ ...p, isCurrent: v, endMonth: v ? null : p.endMonth, endYear: v ? null : p.endYear }))}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="highlights">Highlights</Label>
            <Textarea
              data-testid="exp-form-highlights"
              id="highlights"
              value={values.highlights}
              onChange={(e) => setValues((p) => ({ ...p, highlights: e.target.value }))}
              className="mt-1 min-h-[120px]"
            />
          </div>
        </div>

        <Separator className="my-2 bg-border/60" />

        <div className="flex items-center justify-end gap-2">
          <Button data-testid="exp-form-cancel" variant="outline" className="rounded-2xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button data-testid="exp-form-submit" className="rounded-2xl" disabled={create.isPending} onClick={submit}>
            {create.isPending ? "Saving..." : "Add Experience"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
