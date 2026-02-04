import { useEffect, useState } from "react";
import { z } from "zod";
import { api, type AchievementInput } from "@shared/routes";
import { useCreateAchievement } from "@/hooks/use-achievements";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const formSchema = api.achievements.create.input.extend({
  year: z.coerce.number().min(1990).max(2100),
});

type FormValues = AchievementInput;

function initial(): FormValues {
  return {
    title: "Blue Team Lab Completion",
    type: "security",
    details: "Completed a set of log analysis and incident response drills; documented findings and remediation steps.",
    year: new Date().getFullYear(),
  };
}

export default function AchievementCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { toast } = useToast();
  const create = useCreateAchievement();
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
        toast({ title: "Achievement added", description: "Entry appended." });
        onOpenChange(false);
      },
      onError: (e) => toast({ title: "Create failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="ach-create-title">Add Achievement</DialogTitle>
          <DialogDescription>Highlight security wins, awards, and milestones.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              data-testid="ach-form-title"
              id="title"
              value={values.title}
              onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select value={values.type} onValueChange={(v) => setValues((p) => ({ ...p, type: v as FormValues["type"] }))}>
              <SelectTrigger data-testid="ach-form-type" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="security">security</SelectItem>
                <SelectItem value="award">award</SelectItem>
                <SelectItem value="sports">sports</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              data-testid="ach-form-year"
              id="year"
              type="number"
              value={values.year}
              onChange={(e) => setValues((p) => ({ ...p, year: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea
              data-testid="ach-form-details"
              id="details"
              value={values.details}
              onChange={(e) => setValues((p) => ({ ...p, details: e.target.value }))}
              className="mt-1 min-h-[110px]"
            />
          </div>
        </div>

        <Separator className="my-2 bg-border/60" />

        <div className="flex items-center justify-end gap-2">
          <Button data-testid="ach-form-cancel" variant="outline" className="rounded-2xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button data-testid="ach-form-submit" className="rounded-2xl" disabled={create.isPending} onClick={submit}>
            {create.isPending ? "Saving..." : "Add Achievement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
