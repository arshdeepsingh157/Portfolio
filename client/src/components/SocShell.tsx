import { PropsWithChildren, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Bug,
  Command,
  FileBadge,
  FlaskConical,
  GraduationCap,
  Grid2X2,
  LaptopMinimal,
  LayoutDashboard,
  Mail,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  testId: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { href: "/projects", label: "Projects", icon: Boxes, testId: "nav-projects" },
  { href: "/experience", label: "Experience", icon: BriefcaseBusiness, testId: "nav-experience" },
  { href: "/education", label: "Education", icon: GraduationCap, testId: "nav-education" },
  { href: "/certifications", label: "Certifications", icon: BadgeCheck, testId: "nav-certifications" },
  { href: "/labs", label: "Labs", icon: FlaskConical, testId: "nav-labs" },
  { href: "/achievements", label: "Achievements", icon: Sparkles, testId: "nav-achievements" },
  { href: "/contact", label: "Contact", icon: Mail, testId: "nav-contact" },
];

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const setDark = (next: boolean) => {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
  };

  return { isDark, setDark };
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative grid h-10 w-10 place-items-center rounded-2xl border bg-card/40 backdrop-blur",
          "shadow-lg shadow-black/20",
          "before:absolute before:inset-0 before:rounded-2xl before:opacity-70 before:content-['']",
          "before:bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.32),transparent_55%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.22),transparent_60%)]",
        )}
      >
        <Bug className="relative h-5 w-5 text-primary" />
      </div>
      <div className="leading-tight">
        <div className="text-[12px] text-muted-foreground">SOC Console</div>
        <div className="text-base font-bold tracking-tight">Arshdeep Singh</div>
      </div>
    </div>
  );
}

function TopChips() {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <Badge
        data-testid="chip-availability"
        className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
        variant="outline"
      >
        <Activity className="mr-1.5 h-3.5 w-3.5" />
        Open to SOC roles
      </Badge>
      <Badge
        data-testid="chip-location"
        className="border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/15"
        variant="outline"
      >
        <LaptopMinimal className="mr-1.5 h-3.5 w-3.5" />
        Remote / India
      </Badge>
      <Badge
        data-testid="chip-response-time"
        className="border-accent/30 bg-accent/10 text-accent hover:bg-accent/15"
        variant="outline"
      >
        <Command className="mr-1.5 h-3.5 w-3.5" />
        Response time: &lt; 24h
      </Badge>
    </div>
  );
}

export default function SocShell({ children }: PropsWithChildren) {
  const [location] = useLocation();
  const { isDark, setDark } = useTheme();

  const activeHref = useMemo(() => {
    if (location.startsWith("/projects")) return "/projects";
    if (location.startsWith("/experience")) return "/experience";
    if (location.startsWith("/education")) return "/education";
    if (location.startsWith("/certifications")) return "/certifications";
    if (location.startsWith("/labs")) return "/labs";
    if (location.startsWith("/achievements")) return "/achievements";
    if (location.startsWith("/alerts")) return "/alerts";
    if (location.startsWith("/contact")) return "/contact";
    return "/";
  }, [location]);

  return (
    <div className="min-h-screen soc-surface soc-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 md:gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="glass-panel soc-noise rounded-3xl p-5 border-card-border">
              <div className="flex items-center justify-between">
                <BrandMark />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Dark</span>
                  <Switch
                    data-testid="theme-toggle-desktop"
                    checked={isDark}
                    onCheckedChange={setDark}
                  />
                </div>
              </div>

              <div className="mt-5 neon-divider" />

              <nav className="mt-4 grid gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeHref === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-testid={item.testId}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm transition-all duration-300",
                        "hover-elevate focus-neon",
                        active
                          ? "border-primary/35 bg-primary/10 shadow-md shadow-primary/10"
                          : "border-card-border bg-card/35 hover:bg-card/50",
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-xl border transition-all duration-300",
                          active
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-card-border bg-muted/10 text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <div className={cn("font-semibold tracking-tight", active ? "text-foreground" : "text-foreground/90")}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.label === "Dashboard"
                            ? "Live overview"
                            : item.label === "Alerts"
                              ? "Investigations"
                              : item.label === "Projects"
                                ? "Defensive builds"
                                : item.label === "Education"
                                  ? "Academic history"
                                : item.label === "Labs"
                                  ? "Hands-on drills"
                                  : item.label === "Contact"
                                    ? "Recruiter channel"
                                    : "Signal history"}
                        </div>
                      </div>
                      {active ? (
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_22px_hsl(var(--primary)/0.55)]" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30 group-hover:bg-secondary/60 transition-colors" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <Separator className="my-5 bg-border/60" />

              <div className="grid gap-3">
                <div className="rounded-2xl border border-card-border bg-card/35 p-4 soc-noise">
                  <div className="flex items-center gap-2">
                    <Grid2X2 className="h-4 w-4 text-secondary" />
                    <div className="text-sm font-semibold">Console Status</div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Running in <span className="text-foreground">SOC mode</span>. Data
                    is pulled from live API routes. Any missing endpoints will show
                    as error signals.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-secondary/30 bg-secondary/10 text-secondary">
                      SIEM
                    </Badge>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      Blue Team
                    </Badge>
                    <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
                      MITRE
                    </Badge>
                    <Badge variant="outline" className="border-border/70 bg-muted/15 text-muted-foreground">
                      Portfolio
                    </Badge>
                  </div>
                </div>

                <div className="rounded-2xl border border-card-border bg-card/35 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileBadge className="h-4 w-4 text-accent" />
                      <div className="text-sm font-semibold">Resume</div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            data-testid="resume-download"
                            size="sm"
                            disabled
                            onClick={() => {
                              // disabled, but still wired
                              window.open("#", "_blank", "noopener,noreferrer");
                            }}
                            className="rounded-xl"
                            variant="secondary"
                          >
                            Download
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px]">
                        Resume file not provided yet. Add a PDF to enable this
                        button.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Tip: attach a one-page SOC-ready resume PDF.
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0">
            {/* Header */}
            <header className="glass-panel soc-noise rounded-3xl border-card-border px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Mobile nav */}
                  <div className="lg:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          data-testid="sidebar-toggle"
                          variant="secondary"
                          className="rounded-2xl"
                          onClick={() => {}}
                        >
                          <ShieldAlert className="mr-2 h-4 w-4 text-primary" />
                          Menu
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[320px] bg-background/85 backdrop-blur-xl">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            <Bug className="h-5 w-5 text-primary" />
                            SOC Navigation
                          </SheetTitle>
                        </SheetHeader>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">Dark theme</div>
                          <Switch
                            data-testid="theme-toggle-mobile"
                            checked={isDark}
                            onCheckedChange={setDark}
                          />
                        </div>

                        <div className="my-4 neon-divider" />

                        <nav className="grid gap-2">
                          {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = activeHref === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                data-testid={`${item.testId}-mobile`}
                                className={cn(
                                  "flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm transition-all duration-300 hover-elevate focus-neon",
                                  active ? "border-primary/35 bg-primary/10" : "border-card-border bg-card/35",
                                )}
                              >
                                <div
                                  className={cn(
                                    "grid h-9 w-9 place-items-center rounded-xl border",
                                    active
                                      ? "border-primary/30 bg-primary/10 text-primary"
                                      : "border-card-border bg-muted/10 text-muted-foreground",
                                  )}
                                >
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                                <div className="font-semibold">{item.label}</div>
                              </Link>
                            );
                          })}
                        </nav>
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <BrandMark />
                  </div>
                </div>

                <TopChips />

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        data-testid="quick-contact"
                        variant="secondary"
                        className="rounded-2xl"
                        onClick={() => {
                          window.location.href = "/contact";
                        }}
                      >
                        <Mail className="mr-2 h-4 w-4 text-secondary" />
                        <span className="hidden sm:inline">Contact</span>
                        <span className="sm:hidden">Ping</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reach out for SOC/Blue Team roles.</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        data-testid="open-playbook"
                        variant="outline"
                        className="rounded-2xl border-card-border bg-card/30 hover:bg-card/50"
                        onClick={() => {
                          window.open("https://attack.mitre.org/", "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Bug className="mr-2 h-4 w-4 text-accent" />
                        <span className="hidden sm:inline">MITRE</span>
                        <span className="sm:hidden">TTP</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open MITRE ATT&amp;CK knowledge base.</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </header>

            <motion.main
              className="mt-4 md:mt-6"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
            >
              {children}
            </motion.main>

            <footer className="mt-8 pb-10">
              <div className="neon-divider mb-6 opacity-80" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Built as a SOC-style portfolio console.{" "}
                  <span className="text-foreground/90">Arshdeep Singh</span> — B.Tech CSE (Cybersecurity).
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="kbd">React</span>
                  <span className="kbd">TanStack Query</span>
                  <span className="kbd">Wouter</span>
                  <span className="kbd">Tailwind</span>
                  <span className="kbd">shadcn/ui</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
