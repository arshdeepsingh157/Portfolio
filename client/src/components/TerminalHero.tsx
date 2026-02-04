import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function useTyping(text: string, speed = 16) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    setOut("");
    const t = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(t);
    }, speed);
    return () => window.clearInterval(t);
  }, [text, speed]);
  return out;
}

export function TerminalHero(props: { onViewProjects: () => void; onResume: () => void }) {
  const nameLine = useTyping("arshdeep@SOC:~$ whoami", 12);
  const identity = useTyping("Arshdeep Singh", 20);
  const title = useTyping("Cybersecurity Analyst | SOC Enthusiast | Defensive Security", 10);

  const phrases = useMemo(
    () => ["SOC Analyst", "SIEM Monitoring", "Threat Detection", "Blue Team Security"],
    [],
  );
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setPhraseIndex((p) => (p + 1) % phrases.length), 2100);
    return () => window.clearInterval(t);
  }, [phrases.length]);

  const resumeExists = typeof window !== "undefined" && (window as any).__resumeExists__ === true;

  useEffect(() => {
    // lightweight resume check; caches a boolean on window
    if (typeof window === "undefined") return;
    if ((window as any).__resumeExists__ !== undefined) return;
    fetch("/ArshdeepSinghResume.pdf", { method: "HEAD" })
      .then((r) => ((window as any).__resumeExists__ = r.ok))
      .catch(() => ((window as any).__resumeExists__ = false));
  }, []);

  return (
    <div className="glass neon-ring rounded-2xl p-5 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 shadow-sm">
            <div className="font-mono text-[11px] text-muted-foreground/90 sm:text-xs">
              {nameLine}
              <span className="inline-block h-[1em] w-[0.6em] translate-y-[2px] animate-pulse bg-foreground/70 align-middle ml-1" />
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                data-testid="hero-name"
              >
                {identity}
              </div>
              <div className="text-xs sm:text-sm font-mono text-muted-foreground">
                {title}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-mono text-muted-foreground">
              mode: realtime
            </span>
            <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-mono text-muted-foreground">
              signal: stable
            </span>
            <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-mono text-muted-foreground">
              focus:{" "}
              <motion.span
                key={phrases[phraseIndex]}
                initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-primary"
                data-testid="hero-phrase"
              >
                {phrases[phraseIndex]}
              </motion.span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch lg:justify-center">
          <button
            type="button"
            onClick={props.onViewProjects}
            data-testid="cta-view-projects"
            className="
              group inline-flex items-center justify-center gap-2
              rounded-xl px-5 py-3 font-semibold
              bg-gradient-to-r from-primary to-primary/75
              text-primary-foreground shadow-lg shadow-primary/20
              hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
              active:translate-y-0 active:shadow-md
              transition-all duration-200 ease-out
            "
          >
            <span className="font-display text-base tracking-tight">View Projects</span>
            <span className="font-mono text-xs opacity-80 group-hover:opacity-100 transition-opacity">
              /projects
            </span>
          </button>

          <button
            type="button"
            onClick={props.onResume}
            data-testid="cta-download-resume"
            disabled={!resumeExists}
            title={!resumeExists ? "Add ArshdeepSinghResume.pdf to enable" : "Download resume"}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-5 py-3 font-semibold
              bg-gradient-to-r from-accent/95 to-accent/60
              text-accent-foreground shadow-lg shadow-accent/15
              hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5
              active:translate-y-0 active:shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              transition-all duration-200 ease-out
            "
          >
            <span className="font-display text-base tracking-tight">Download Resume</span>
            <span className="font-mono text-xs opacity-80">ArshdeepSinghResume.pdf</span>
          </button>
        </div>
      </div>
    </div>
  );
}
