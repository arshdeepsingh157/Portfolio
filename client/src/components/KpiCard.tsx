import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function KpiCard(props: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "accent" | "warn";
  "data-testid"?: string;
}) {
  const Icon = props.icon;

  const accent =
    props.accent === "accent"
      ? "neon-ring-accent"
      : props.accent === "warn"
        ? "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_34px_rgba(255,120,120,0.12)]"
        : "neon-ring";

  return (
    <Card className={`glass ${accent} hover-elevate rounded-2xl transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground" data-testid={props["data-testid"]}>
            {props.title}
          </CardTitle>
          <div className="rounded-xl border border-border/70 bg-background/30 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-3xl font-bold tracking-tight">{props.value}</div>
            {props.hint ? (
              <div className="mt-1 text-xs text-muted-foreground font-mono">{props.hint}</div>
            ) : null}
          </div>
          <div className="hidden sm:block text-xs font-mono text-muted-foreground">
            updated: now
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
