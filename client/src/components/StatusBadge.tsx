import { Badge } from "@/components/ui/badge";

const statusToClasses: Record<string, string> = {
  open: "border-[hsl(0_85%_56%/0.35)] bg-[hsl(0_85%_56%/0.12)] text-[hsl(0_85%_75%)]",
  investigating: "border-[hsl(268_92%_65%/0.35)] bg-[hsl(268_92%_65%/0.12)] text-[hsl(268_92%_78%)]",
  contained: "border-[hsl(175_90%_55%/0.35)] bg-[hsl(175_90%_55%/0.10)] text-primary",
  resolved: "border-[hsl(120_60%_55%/0.35)] bg-[hsl(120_60%_55%/0.10)] text-[hsl(120_60%_75%)]",
  false_positive: "border-border/70 bg-muted/40 text-muted-foreground",
};

export function StatusBadge(props: { status?: string | null }) {
  const st = (props.status ?? "open").toLowerCase();
  const cls = statusToClasses[st] ?? statusToClasses.open;

  return (
    <Badge
      data-testid={`status-${st}`}
      className={`rounded-full px-2.5 py-1 text-[11px] font-mono tracking-tight border ${cls}`}
      variant="outline"
    >
      {st.replaceAll("_", " ").toUpperCase()}
    </Badge>
  );
}
