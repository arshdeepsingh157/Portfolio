import { ExternalLink, Github, Layers3, ListChecks, Wrench } from "lucide-react";
import type { PortfolioProject } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function categoryLabel(cat: PortfolioProject["category"]) {
  return (
    {
      web_security: "Web Security",
      defensive_security: "Defensive Security",
      automation: "Automation",
      network_security: "Network Security",
      training: "Training",
    } as const
  )[cat];
}

export default function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
}: {
  project: PortfolioProject | null;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle data-testid="project-dialog-title" className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-primary" />
            {project?.name ?? "Project"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Deep dive: responsibilities, tools, and key findings.
          </DialogDescription>
        </DialogHeader>

        {!project ? (
          <div className="rounded-2xl border border-card-border bg-card/35 p-5 text-sm text-muted-foreground">
            Select a project to open details.
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                data-testid="project-category"
                variant="outline"
                className="rounded-xl border-secondary/30 bg-secondary/10 text-secondary"
              >
                {categoryLabel(project.category)}
              </Badge>
              <Badge variant="outline" className="rounded-xl border-accent/30 bg-accent/10 text-accent">
                portfolio_project
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-card-border bg-card/35 p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <ListChecks className="h-3.5 w-3.5 text-secondary" />
                  What I did
                </div>
                <div data-testid="project-what-i-did" className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {project.whatIDid}
                </div>
              </div>

              <div className="rounded-2xl border border-card-border bg-card/35 p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-accent" />
                  Tools
                </div>
                <div data-testid="project-tools" className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {project.tools}
                </div>
              </div>

              <div className="rounded-2xl border border-card-border bg-card/35 p-4 md:col-span-2">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                  Key findings
                </div>
                <div data-testid="project-key-findings" className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {project.keyFindings}
                </div>
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Description:{" "}
                <span data-testid="project-description" className="text-foreground/90">
                  {project.description}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  data-testid="project-open-repo"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => window.open(project.repoUrl, "_blank", "noopener,noreferrer")}
                >
                  <Github className="mr-2 h-4 w-4 text-muted-foreground" />
                  Repo
                </Button>
                <Button
                  data-testid="project-open-demo"
                  className="rounded-2xl"
                  onClick={() => window.open(project.demoUrl, "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
