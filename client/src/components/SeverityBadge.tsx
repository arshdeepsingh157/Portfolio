import { Badge } from "@/components/ui/badge";

const severityToClasses: Record<string, string> = {
  critical: "border-destructive/40 bg-destructive/15 text-destructive",
  high: "border-[hsl(35_92%_55%/0.40)] bg-[hsl(35_92%_55%/0.14)] text-[hsl(35_92%_70%)]",
  medium: "border-[hsl(205_90%_60%/0.40)] bg-[hsl(205_90%_60%/0.14)] text-[hsl(205_90%_75%)]",
  low: "border-primary/40 bg-primary/12 text-primary",
  info: "border-border/70 bg-muted/40 text-muted-foreground",
};

export function SeverityBadge(props: { severity?: string | null }) {
  const sev = (props.severity ?? "info").toLowerCase();
  const cls = severityToClasses[sev] ?? severityToClasses.info;

  return (
    <Badge
      data-testid={`severity-${sev}`}
      className={`rounded-full px-2.5 py-1 text-[11px] font-mono tracking-tight border ${cls}`}
      variant="outline"
    >
      {sev.toUpperCase()}
    </Badge>
  );
}
