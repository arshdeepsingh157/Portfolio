import { cn } from "@/lib/utils";

export function SectionHeader(props: {
  title: string;
  eyebrow?: string;
  right?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", props.className)}>
      <div className="min-w-0">
        {props.eyebrow ? (
          <div className="text-xs font-mono text-muted-foreground" data-testid={`${props["data-testid"] ?? "section"}-eyebrow`}>
            {props.eyebrow}
          </div>
        ) : null}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" data-testid={props["data-testid"]}>
          {props.title}
        </h2>
      </div>
      {props.right ? <div className="shrink-0">{props.right}</div> : null}
    </div>
  );
}
