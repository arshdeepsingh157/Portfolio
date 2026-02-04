import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github } from "lucide-react";

type ProjectLike = {
  id: string;
  name: string;
  category: string;
  description: string;
  whatIDid: string;
  tools: string;
  keyFindings: string;
  repoUrl: string;
  demoUrl: string;
};

export function ProjectModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: ProjectLike | null;
}) {
  const p = props.project;

  const openUrl = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-3xl border-border/70 bg-background/85 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="text-2xl" data-testid="project-modal-title">
                {p?.name ?? "Project"}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground" data-testid="project-modal-description">
                {p?.description ?? "No description available."}
              </DialogDescription>
            </div>
            {p ? (
              <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground">
                category: <span className="text-foreground">{p.category}</span>
              </div>
            ) : null}
          </div>
        </DialogHeader>

        <Separator className="my-2 bg-border/70" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-4">
            <div className="text-xs font-mono text-muted-foreground">what i did</div>
            <div className="mt-2 text-sm text-foreground whitespace-pre-wrap" data-testid="project-modal-what-i-did">
              {p?.whatIDid ?? "-"}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-xs font-mono text-muted-foreground">tools</div>
            <div className="mt-2 text-sm text-foreground whitespace-pre-wrap" data-testid="project-modal-tools">
              {p?.tools ?? "-"}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 md:col-span-2">
            <div className="text-xs font-mono text-muted-foreground">key findings</div>
            <div className="mt-2 text-sm text-foreground whitespace-pre-wrap" data-testid="project-modal-key-findings">
              {p?.keyFindings ?? "-"}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2 sm:gap-2">
          <Button
            variant="secondary"
            onClick={() => props.onOpenChange(false)}
            data-testid="project-modal-close"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
