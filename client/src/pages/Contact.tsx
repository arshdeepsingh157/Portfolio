import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Copy, Mail, Linkedin, Github, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = useMemo(() => {
    return name.trim().length >= 2 && email.includes("@") && msg.trim().length >= 8;
  }, [name, email, msg]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard permission denied.", variant: "destructive" as any });
    }
  };

  const onSend = () => {
    // No backend contact endpoint defined; still wire a polished UX.
    // This is a "mailto:" bridge.
    const subject = encodeURIComponent(`SOC Portfolio Contact — ${name}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${msg}\n`);
    window.location.href = `mailto:arshdeep.singh@example.com?subject=${subject}&body=${body}`;
    setSent(true);
    toast({ title: "Draft opened", description: "Email client opened with your message." });
  };

  return (
    <AppShell>
      <Seo
        title="Contact — Arshdeep Singh"
        description="Contact Arshdeep Singh for SOC / Blue Team roles: email and social links."
      />

      <div className="space-y-5 lg:space-y-7">
        <SectionHeader title="Contact" eyebrow="reach out" data-testid="contact-header" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7">
          <div className="lg:col-span-5">
            <Card className="glass neon-ring rounded-2xl p-5">
              <div className="text-xs font-mono text-muted-foreground">channels</div>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => copy("arshdeep.singh@example.com", "Email")}
                  data-testid="contact-copy-email"
                  className="rounded-2xl border border-border/70 bg-background/25 p-4 text-left hover-elevate transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl border border-border/70 bg-muted/30 p-2">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold">Email</div>
                        <div className="mt-1 text-xs font-mono text-muted-foreground truncate">
                          arshdeep.singh@example.com
                        </div>
                      </div>
                    </div>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => window.open("https://www.linkedin.com/", "_blank", "noopener,noreferrer")}
                    data-testid="contact-linkedin"
                    className="gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => window.open("https://github.com/", "_blank", "noopener,noreferrer")}
                    data-testid="contact-github"
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </div>

                <Separator className="my-1 bg-border/70" />

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <div className="text-xs font-mono text-muted-foreground">availability</div>
                  <div className="mt-2 text-sm text-foreground">
                    Open to SOC Analyst / Blue Team roles. Comfortable with SIEM triage, log analysis, and incident workflows.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="glass neon-ring-accent rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-muted-foreground">message</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight">Send a note</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Opens your email client with a prefilled message (no server endpoint required).
                  </div>
                </div>
                {sent ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary" data-testid="contact-sent">
                    <CheckCircle2 className="h-4 w-4" /> opened
                  </div>
                ) : null}
              </div>

              <Separator className="my-5 bg-border/70" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" data-testid="contact-name" />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" data-testid="contact-email" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-mono text-muted-foreground">Message</label>
                  <Textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="mt-1 min-h-[160px]"
                    data-testid="contact-message"
                    placeholder="What role are you hiring for? What problems are you solving? What do you want me to focus on?"
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setName("");
                      setEmail("");
                      setMsg("");
                      setSent(false);
                    }}
                    data-testid="contact-clear"
                  >
                    Clear
                  </Button>
                  <Button onClick={onSend} disabled={!canSend} data-testid="contact-send" className="gap-2">
                    <Send className="h-4 w-4" />
                    Open Email Draft
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
