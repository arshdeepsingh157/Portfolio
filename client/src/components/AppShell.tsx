import { PropsWithChildren, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ShieldAlert,
  LayoutDashboard,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Trophy,
  BriefcaseBusiness,
  Mail,
  Siren,
  PanelLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { SocBackground } from "@/components/SocBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import PixelCard from "@/components/PixelCard.tsx";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { href: "/projects", label: "Projects", icon: FolderKanban, testId: "nav-projects" },
  { href: "/experience", label: "Experience", icon: BriefcaseBusiness, testId: "nav-experience" },
  { href: "/education", label: "Education", icon: GraduationCap, testId: "nav-education" },
  { href: "/certifications", label: "Certifications", icon: GraduationCap, testId: "nav-certifications" },
  { href: "/labs", label: "Labs", icon: FlaskConical, testId: "nav-labs" },
  { href: "/achievements", label: "Achievements", icon: Trophy, testId: "nav-achievements" },
  { href: "/contact", label: "Contact", icon: Mail, testId: "nav-contact" },
];

function Chip(props: { label: string; value: string; tone?: "primary" | "accent" | "muted"; testId: string }) {
  const tone =
    props.tone === "accent"
      ? "border-accent/25 bg-accent/10 text-[hsl(268_92%_78%)]"
      : props.tone === "primary"
        ? "border-primary/25 bg-primary/10 text-primary"
        : "border-border/70 bg-muted/30 text-muted-foreground";

  return (
    <div
      data-testid={props.testId}
      className={cn(
        "rounded-full border px-5 py-2.5 text-xs font-mono tracking-tight",
        tone,
      )}
    >
      <span className="opacity-80">{props.label}:</span>{" "}
      <span className="font-semibold">{props.value}</span>
    </div>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);

  const active = useMemo(() => nav.find((n) => (n.href === "/" ? loc === "/" : loc.startsWith(n.href))), [loc]);

  return (
    <div className="min-h-dvh mesh-bg">
      <SocBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 lg:gap-7">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)]">
            <div className="glass neon-ring rounded-2xl lg:h-full lg:flex lg:flex-col lg:overflow-hidden">
              <div className="p-4 sm:p-5 lg:flex-1 lg:overflow-y-hidden lg:hover:overflow-y-auto scrollbar-neon">
                <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-5 min-w-0">
                  <PixelCard 
                    variant="pink" 
                    gap={4}
                    speed={20}
                    colors="#10b981,#34d399,#059669"
                    className="h-[8.5rem] w-[8.5rem] shrink-0 !rounded-full border-4 border-primary shadow-xl shadow-primary/20 ring-[6px] ring-primary/10 overflow-hidden"
                    noFocus
                  >
                    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                      <Avatar className="h-32 w-32 !rounded-full bg-transparent border-none">
                        <AvatarImage src="/arsh.png" alt="Arshdeep Singh" className="object-cover !rounded-full" />
                        <AvatarFallback className="bg-transparent text-primary font-mono cursor-default text-5xl">AS</AvatarFallback>
                      </Avatar>
                    </div>
                  </PixelCard>
                  <div className="min-w-0">
                    <div className="font-display text-lg leading-none">SOC Console</div>
                    <div className="mt-1 text-xs font-mono text-muted-foreground whitespace-normal break-words">
                      arshdeep.singh — portfolio runtime
                    </div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setOpen((v) => !v)}
                  className="lg:hidden"
                  data-testid="sidebar-toggle"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-4 bg-border/70" />

              <nav className={cn("grid gap-1.5", open ? "block" : "hidden lg:block")} data-testid="sidebar-nav">
                {nav.map((item) => {
                  const Icon = item.icon;
                  const isActive = active?.href === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-testid={item.testId}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover-elevate border border-transparent",
                        isActive
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "rounded-lg border border-border/70 bg-background/25 p-1.5 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-semibold">{item.label}</span>
                      <span className="ml-auto hidden lg:inline font-mono text-[10px] opacity-70">
                        {item.href === "/" ? "/root" : item.href}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-5 hidden lg:block">
                <div className="rounded-2xl border border-border/70 bg-background/25 p-4">
                  <div className="text-xs font-mono text-muted-foreground">system</div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    <Chip testId="chip-availability" label="Availability" value="Open to SOC / Security Analyst / VAPT roles" tone="primary" />
                    <Chip testId="chip-location" label="Location" value="India" tone="muted" />
                    <Chip testId="chip-response" label="Response" value="Fast" tone="accent" />
                    <Chip testId="chip-signal" label="Signal" value="Stable" tone="muted" />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0">
            <header className="glass neon-ring rounded-2xl px-4 py-4 sm:px-5 sm:py-5 mb-5 lg:mb-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-muted-foreground">active view</div>
                  <div className="mt-1 flex items-baseline gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="page-title">
                      {active?.label ?? "Console"}
                    </h1>
                    <div className="text-xs font-mono text-muted-foreground truncate">
                      {active?.href ?? loc}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Chip testId="header-chip-availability" label="Availability" value="Open" tone="primary" />
                  <Chip testId="header-chip-role" label="Target" value="SOC / Blue Team" tone="accent" />
                  <Chip testId="header-chip-latency" label="Latency" value="low" tone="muted" />

                  <Button
                    variant="secondary"
                    onClick={() => document.documentElement.classList.toggle("dark")}
                    data-testid="theme-toggle"
                    className="ml-0 md:ml-2"
                  >
                    Toggle Theme
                  </Button>
                </div>
              </div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="scrollbar-neon"
            >
              {children}
            </motion.div>

            <footer className="mt-8 lg:mt-10 text-xs font-mono text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div data-testid="footer-sig">
                  SOC Console Portfolio — Arshdeep Singh
                </div>
                <div className="opacity-80">
                  build: client • env: prod-ready • status: green
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
