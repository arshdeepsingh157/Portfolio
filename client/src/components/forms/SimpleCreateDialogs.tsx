import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateAchievement,
  useCreateCertification,
  useCreateExperience,
  useCreateLab,
} from "@/hooks/use-portfolio";
import { z } from "zod";

export function CertificationCreateDialog(props: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const create = useCreateCertification();

  const schema = useMemo(() => api.certifications.create.input.extend({ year: z.coerce.number() }), []);
  type V = z.infer<typeof schema>;

  const form = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", issuer: "other", credentialUrl: "", year: new Date().getFullYear() },
    mode: "onChange",
  });

  const onSubmit = async (v: V) => {
    try {
      await create.mutateAsync(v);
      toast({ title: "Certification added", description: "Record created." });
      props.onOpenChange(false);
      form.reset();
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-xl border-border/70 bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="cert-create-title">Add Certification</DialogTitle>
          <DialogDescription>Issuer, credential URL, and year.</DialogDescription>
        </DialogHeader>
        <Separator className="my-2 bg-border/70" />
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" data-testid="cert-create-form">
          <div>
            <label className="text-xs font-mono text-muted-foreground">Name</label>
            <Input className="mt-1" data-testid="cert-name" {...form.register("name")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground">Issuer</label>
              <Select value={form.watch("issuer")} onValueChange={(v) => form.setValue("issuer", v as any, { shouldValidate: true })}>
                <SelectTrigger className="mt-1" data-testid="cert-issuer">
                  <SelectValue placeholder="Issuer" />
                </SelectTrigger>
                <SelectContent>
                  {["cdi", "sensation_software_solutions", "udemy", "other"].map((i) => (
                    <SelectItem key={i} value={i}>
                      {i.replaceAll("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground">Year</label>
              <Input className="mt-1" type="number" data-testid="cert-year" {...form.register("year")} />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Credential URL</label>
            <Input className="mt-1" data-testid="cert-url" {...form.register("credentialUrl")} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => props.onOpenChange(false)} data-testid="cert-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || create.isPending} data-testid="cert-submit">
              {create.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ExperienceCreateDialog(props: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const create = useCreateExperience();
  const schema = useMemo(
    () =>
      api.experience.create.input.extend({
        startMonth: z.coerce.number(),
        startYear: z.coerce.number(),
        endMonth: z.coerce.number().optional().nullable(),
        endYear: z.coerce.number().optional().nullable(),
      }),
    [],
  );

  type V = z.infer<typeof schema>;
  const form = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "",
      org: "",
      type: "training",
      location: "",
      startMonth: 1,
      startYear: new Date().getFullYear(),
      endMonth: null as any,
      endYear: null as any,
      isCurrent: false,
      highlights: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (v: V) => {
    try {
      await create.mutateAsync(v);
      toast({ title: "Experience added", description: "Timeline updated." });
      props.onOpenChange(false);
      form.reset();
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-2xl border-border/70 bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="exp-create-title">Add Experience</DialogTitle>
          <DialogDescription>Role, org, dates, and highlights.</DialogDescription>
        </DialogHeader>
        <Separator className="my-2 bg-border/70" />
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="exp-create-form">
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Role</label>
            <Input className="mt-1" data-testid="exp-role" {...form.register("role")} />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Organization</label>
            <Input className="mt-1" data-testid="exp-org" {...form.register("org")} />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Type</label>
            <Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v as any, { shouldValidate: true })}>
              <SelectTrigger className="mt-1" data-testid="exp-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {["job", "internship", "training", "volunteer"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Location</label>
            <Input className="mt-1" data-testid="exp-location" {...form.register("location")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted-foreground">Start Month</label>
              <Input className="mt-1" type="number" data-testid="exp-start-month" {...form.register("startMonth")} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground">Start Year</label>
              <Input className="mt-1" type="number" data-testid="exp-start-year" {...form.register("startYear")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted-foreground">End Month</label>
              <Input className="mt-1" type="number" data-testid="exp-end-month" {...form.register("endMonth" as any)} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground">End Year</label>
              <Input className="mt-1" type="number" data-testid="exp-end-year" {...form.register("endYear" as any)} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Highlights</label>
            <Textarea className="mt-1 min-h-[110px]" data-testid="exp-highlights" {...form.register("highlights")} />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => props.onOpenChange(false)} data-testid="exp-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || create.isPending} data-testid="exp-submit">
              {create.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AchievementCreateDialog(props: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const create = useCreateAchievement();
  const schema = useMemo(() => api.achievements.create.input.extend({ year: z.coerce.number() }), []);
  type V = z.infer<typeof schema>;

  const form = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", type: "security", details: "", year: new Date().getFullYear() },
    mode: "onChange",
  });

  const onSubmit = async (v: V) => {
    try {
      await create.mutateAsync(v);
      toast({ title: "Achievement added", description: "Record created." });
      props.onOpenChange(false);
      form.reset();
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-xl border-border/70 bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="ach-create-title">Add Achievement</DialogTitle>
          <DialogDescription>Title, type, year, and details.</DialogDescription>
        </DialogHeader>
        <Separator className="my-2 bg-border/70" />
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" data-testid="ach-create-form">
          <div>
            <label className="text-xs font-mono text-muted-foreground">Title</label>
            <Input className="mt-1" data-testid="ach-title" {...form.register("title")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground">Type</label>
              <Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v as any, { shouldValidate: true })}>
                <SelectTrigger className="mt-1" data-testid="ach-type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {["security", "award", "sports", "other"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground">Year</label>
              <Input className="mt-1" type="number" data-testid="ach-year" {...form.register("year")} />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Details</label>
            <Textarea className="mt-1 min-h-[110px]" data-testid="ach-details" {...form.register("details")} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => props.onOpenChange(false)} data-testid="ach-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || create.isPending} data-testid="ach-submit">
              {create.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function LabCreateDialog(props: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const create = useCreateLab();
  const schema = useMemo(() => api.labs.create.input, []);
  type V = typeof schema._type;

  const form = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "siem_lab",
      description: "",
      tools: "",
      outcome: "",
      difficulty: "Intermediate",
      badge: "SOC Lab",
      link: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (v: V) => {
    try {
      await create.mutateAsync(v);
      toast({ title: "Lab added", description: "Record created." });
      props.onOpenChange(false);
      form.reset();
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-2xl border-border/70 bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="lab-create-title">Add Lab</DialogTitle>
          <DialogDescription>Hands-on labs that read like SOC playbooks.</DialogDescription>
        </DialogHeader>
        <Separator className="my-2 bg-border/70" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="lab-create-form">
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Name</label>
            <Input className="mt-1" data-testid="lab-name" {...form.register("name")} />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Type</label>
            <Select value={form.watch("type") as any} onValueChange={(v) => form.setValue("type", v as any, { shouldValidate: true })}>
              <SelectTrigger className="mt-1" data-testid="lab-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {["sql_injection", "password_strength", "siem_lab", "firewall_lab", "networking", "log_analysis"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replaceAll("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Difficulty</label>
            <Input className="mt-1" data-testid="lab-difficulty" {...form.register("difficulty")} />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Description</label>
            <Textarea className="mt-1 min-h-[90px]" data-testid="lab-description" {...form.register("description")} />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Tools</label>
            <Textarea className="mt-1 min-h-[90px]" data-testid="lab-tools" {...form.register("tools")} />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Outcome</label>
            <Textarea className="mt-1 min-h-[110px]" data-testid="lab-outcome" {...form.register("outcome")} />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Badge</label>
            <Input className="mt-1" data-testid="lab-badge" {...form.register("badge")} />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">Link</label>
            <Input className="mt-1" data-testid="lab-link" {...form.register("link")} />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => props.onOpenChange(false)} data-testid="lab-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || create.isPending} data-testid="lab-submit">
              {create.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
