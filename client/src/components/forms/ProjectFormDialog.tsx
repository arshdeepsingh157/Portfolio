import { useEffect, useMemo } from "react";
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
import { useCreateProject, useUpdateProject } from "@/hooks/use-portfolio";

type ProjectLike = {
  id: string;
  name: string;
  category: any;
  description: string;
  whatIDid: string;
  tools: string;
  keyFindings: string;
  repoUrl: string;
  demoUrl: string;
};

const formSchema = api.projects.create.input;

type FormValues = typeof formSchema._type;

export function ProjectFormDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: ProjectLike | null;
}) {
  const { toast } = useToast();
  const create = useCreateProject();
  const update = useUpdateProject();

  const defaults = useMemo<FormValues>(() => {
    if (props.mode === "edit" && props.initial) {
      return {
        name: props.initial.name,
        category: props.initial.category,
        description: props.initial.description,
        whatIDid: props.initial.whatIDid,
        tools: props.initial.tools,
        keyFindings: props.initial.keyFindings,
        repoUrl: props.initial.repoUrl,
        demoUrl: props.initial.demoUrl,
      };
    }
    return {
      name: "",
      category: "defensive_security",
      description: "",
      whatIDid: "",
      tools: "",
      keyFindings: "",
      repoUrl: "",
      demoUrl: "",
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
        toast({ title: "Project created", description: "Added to projects inventory." });
      } else {
        if (!props.initial?.id) throw new Error("Missing project id");
        await update.mutateAsync({ id: props.initial.id, updates: values });
        toast({ title: "Project updated", description: "Changes saved." });
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
          <DialogTitle data-testid="project-form-title">
            {props.mode === "create" ? "Create Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription>
            Recruiter-friendly project record with tools, what you did, and key findings.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2 bg-border/70" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="project-form">
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Name</label>
            <Input data-testid="project-name" {...form.register("name")} className="mt-1" />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Category</label>
            <Select
              value={form.watch("category") as any}
              onValueChange={(v) => form.setValue("category", v as any, { shouldValidate: true })}
            >
              <SelectTrigger data-testid="project-category" className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {["web_security", "defensive_security", "automation", "network_security", "training"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c.replaceAll("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground">Repo URL</label>
            <Input data-testid="project-repo" {...form.register("repoUrl")} className="mt-1" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Demo URL</label>
            <Input data-testid="project-demo" {...form.register("demoUrl")} className="mt-1" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Description</label>
            <Textarea data-testid="project-description" {...form.register("description")} className="mt-1 min-h-[90px]" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">What I did</label>
            <Textarea data-testid="project-what-i-did" {...form.register("whatIDid")} className="mt-1 min-h-[110px]" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Tools</label>
            <Textarea data-testid="project-tools" {...form.register("tools")} className="mt-1 min-h-[90px]" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono text-muted-foreground">Key findings</label>
            <Textarea data-testid="project-key-findings" {...form.register("keyFindings")} className="mt-1 min-h-[110px]" />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => props.onOpenChange(false)} data-testid="project-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || pending} data-testid="project-submit">
              {pending ? "Saving..." : props.mode === "create" ? "Create Project" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
