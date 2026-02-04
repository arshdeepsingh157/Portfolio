import { useEffect, useMemo, useState } from "react";
import type { PortfolioProject } from "@shared/schema";
import { api, type ProjectInput } from "@shared/routes";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { cn } from "@/lib/utils";

const formSchema = api.projects.create.input;

type FormValues = ProjectInput;

function initialForCreate(): FormValues {
  return {
    name: "SIEM Alert Triage Dashboard",
    category: "defensive_security",
    description: "A SOC-style dashboard to triage alerts, track status, and surface MITRE context.",
    whatIDid: "Designed investigation workflow UI, implemented filters, and built CRUD API wiring.",
    tools: "React, TanStack Query, Tailwind, Zod, Express, PostgreSQL",
    keyFindings: "Reduced triage time by standardizing fields; made recruiter-readable narrative from SOC signals.",
    repoUrl: "https://github.com/",
    demoUrl: "https://example.com/",
  };
}

export default function ProjectUpsertDialog({
  open,
  onOpenChange,
  mode,
  project,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  mode: "create" | "edit";
  project?: PortfolioProject | null;
}) {
  const { toast } = useToast();
  const create = useCreateProject();
  const update = useUpdateProject();

  const [values, setValues] = useState<FormValues>(initialForCreate());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const header = useMemo(() => (mode === "create" ? "Create Project" : "Edit Project"), [mode]);

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setValues(initialForCreate());
      setErrors({});
      return;
    }
    if (mode === "edit" && project) {
      setValues({
        name: project.name,
        category: project.category,
        description: project.description,
        whatIDid: project.whatIDid,
        tools: project.tools,
        keyFindings: project.keyFindings,
        repoUrl: project.repoUrl,
        demoUrl: project.demoUrl,
      });
      setErrors({});
    }
  }, [open, mode, project]);

  const submit = () => {
    setErrors({});
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[i.path.join(".") || "form"] = i.message));
      setErrors(next);
      toast({ title: "Validation error", description: "Check required fields.", variant: "destructive" });
      return;
    }

    if (mode === "create") {
      create.mutate(parsed.data, {
        onSuccess: () => {
          toast({ title: "Project created", description: "New project added to portfolio." });
          onOpenChange(false);
        },
        onError: (e) => toast({ title: "Create failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" }),
      });
      return;
    }

    if (mode === "edit" && project) {
      // Update endpoint expects partial — send full values anyway (valid partial)
      update.mutate(
        { id: project.id, updates: parsed.data as Partial<ProjectInput> },
        {
          onSuccess: () => {
            toast({ title: "Project updated", description: "Changes synced." });
            onOpenChange(false);
          },
          onError: (e) => toast({ title: "Update failed", description: String(e instanceof Error ? e.message : e), variant: "destructive" }),
        },
      );
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="project-upsert-title">{header}</DialogTitle>
          <DialogDescription>Write it like a SOC case study: what you did, tools, and findings.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              data-testid="project-form-name"
              id="name"
              value={values.name}
              onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.name ? <div className="mt-1 text-xs text-destructive">{errors.name}</div> : null}
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={values.category}
              onValueChange={(v) => setValues((p) => ({ ...p, category: v as FormValues["category"] }))}
            >
              <SelectTrigger data-testid="project-form-category" className="mt-1 rounded-xl bg-background/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web_security">web_security</SelectItem>
                <SelectItem value="defensive_security">defensive_security</SelectItem>
                <SelectItem value="automation">automation</SelectItem>
                <SelectItem value="network_security">network_security</SelectItem>
                <SelectItem value="training">training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tools">Tools</Label>
            <Input
              data-testid="project-form-tools"
              id="tools"
              value={values.tools}
              onChange={(e) => setValues((p) => ({ ...p, tools: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              data-testid="project-form-description"
              id="description"
              value={values.description}
              onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
              className={cn("min-h-[84px] mt-1", errors.description && "border-destructive focus-visible:ring-destructive/20")}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="whatIDid">What I did</Label>
            <Textarea
              data-testid="project-form-what-i-did"
              id="whatIDid"
              value={values.whatIDid}
              onChange={(e) => setValues((p) => ({ ...p, whatIDid: e.target.value }))}
              className="min-h-[96px] mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="keyFindings">Key findings</Label>
            <Textarea
              data-testid="project-form-key-findings"
              id="keyFindings"
              value={values.keyFindings}
              onChange={(e) => setValues((p) => ({ ...p, keyFindings: e.target.value }))}
              className="min-h-[96px] mt-1"
            />
          </div>

          <div>
            <Label htmlFor="repoUrl">Repo URL</Label>
            <Input
              data-testid="project-form-repo"
              id="repoUrl"
              value={values.repoUrl}
              onChange={(e) => setValues((p) => ({ ...p, repoUrl: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              data-testid="project-form-demo"
              id="demoUrl"
              value={values.demoUrl}
              onChange={(e) => setValues((p) => ({ ...p, demoUrl: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>

        <Separator className="my-2 bg-border/60" />

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
          <Button
            data-testid="project-form-cancel"
            variant="outline"
            className="rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            data-testid="project-form-submit"
            className="rounded-2xl"
            disabled={isPending}
            onClick={submit}
          >
            {isPending ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
