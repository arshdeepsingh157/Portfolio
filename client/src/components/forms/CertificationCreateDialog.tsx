import { useEffect, useState } from "react";
import { z } from "zod";
import { api, type CertificationInput } from "@shared/routes";
import { useCreateCertification } from "@/hooks/use-certifications";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = api.certifications.create.input.extend({
  year: z.coerce.number().min(1990).max(2100),
});

type FormValues = CertificationInput;

function initial(): FormValues {
  return {
    name: "Introduction to Cybersecurity",
    issuer: "udemy",
    credentialUrl: "https://example.com/credential",
    year: new Date().getFullYear(),
  };
}

export default function CertificationCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { toast } = useToast();
  const create = useCreateCertification();
  const [values, setValues] = useState<FormValues>(initial());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setValues(initial());
      setErrors({});
    }
  }, [open]);

  const submit = () => {
    setErrors({});
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[i.path.join(".") || "form"] = i.message));
      setErrors(next);
      toast({ title: "Validation error", description: "Please correct fields.", variant: "destructive" });
      return;
    }

    create.mutate(parsed.data, {
      onSuccess: () => {
        toast({ title: "Certification added", description: "Credential appended to portfolio." });
        onOpenChange(false);
      },
      onError: (e) =>
        toast({ title: "Create failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="cert-create-title">Add Certification</DialogTitle>
          <DialogDescription>Keep this recruiter-scannable: issuer, year, and link.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              data-testid="cert-form-name"
              id="name"
              value={values.name}
              onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive/20")}
            />
          </div>

          <div>
            <Label>Issuer</Label>
            <Select value={values.issuer} onValueChange={(v) => setValues((p) => ({ ...p, issuer: v as FormValues["issuer"] }))}>
              <SelectTrigger data-testid="cert-form-issuer" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Issuer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cdi">cdi</SelectItem>
                <SelectItem value="sensation_software_solutions">sensation_software_solutions</SelectItem>
                <SelectItem value="udemy">udemy</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="credentialUrl">Credential URL</Label>
            <Input
              data-testid="cert-form-url"
              id="credentialUrl"
              value={values.credentialUrl}
              onChange={(e) => setValues((p) => ({ ...p, credentialUrl: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              data-testid="cert-form-year"
              id="year"
              type="number"
              value={values.year}
              onChange={(e) => setValues((p) => ({ ...p, year: Number(e.target.value) }))}
              className={cn(errors.year && "border-destructive focus-visible:ring-destructive/20")}
            />
          </div>
        </div>

        <Separator className="my-2 bg-border/60" />

        <div className="flex items-center justify-end gap-2">
          <Button
            data-testid="cert-form-cancel"
            variant="outline"
            className="rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button data-testid="cert-form-submit" className="rounded-2xl" disabled={create.isPending} onClick={submit}>
            {create.isPending ? "Saving..." : "Add Certification"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
