import { useState } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "Arshdeep@2003") {
      window.localStorage.setItem("portfolio_admin", "1");
      setError("");
      navigate("/");
      return;
    }
    setError("Invalid credentials");
  };

  return (
    <AppShell>
      <Seo title="Admin Login — Arshdeep Singh" description="Admin access for portfolio editing." />
      <div className="max-w-lg">
        <Card className="glass neon-ring rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Admin Login</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your admin credentials to enable edit and create controls.
          </p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error ? <div className="text-sm text-red-400">{error}</div> : null}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
