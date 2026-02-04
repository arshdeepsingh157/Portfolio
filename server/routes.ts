import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api, errorSchemas } from "@shared/routes";
import {
  insertPortfolioAlertSchema,
  insertPortfolioProjectSchema,
  insertPortfolioCertificationSchema,
  insertPortfolioExperienceSchema,
  insertPortfolioAchievementSchema,
  insertPortfolioLabSchema,
} from "@shared/schema";
import { storage } from "./storage";

function zodToValidation(err: z.ZodError) {
  return {
    message: err.errors[0]?.message ?? "Invalid request",
    field: err.errors[0]?.path?.join(".") || undefined,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.portfolio.overview.path, async (_req, res) => {
    const overview = await storage.getOverview();
    res.json(overview);
  });

  app.get(api.alerts.list.path, async (req, res) => {
    const parsed = api.alerts.list.input?.safeParse(req.query);
    if (parsed && !parsed.success) {
      return res.status(400).json(zodToValidation(parsed.error));
    }

    const alerts = await storage.listAlerts(parsed?.success ? parsed.data : undefined);
    res.json(alerts);
  });

  app.get(api.alerts.get.path, async (req, res) => {
    const id = req.params.id as string;
    const alert = await storage.getAlert(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.json(alert);
  });

  app.post(api.alerts.create.path, async (req, res) => {
    try {
      const input = insertPortfolioAlertSchema.parse(req.body);
      const created = await storage.createAlert(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.put(api.alerts.update.path, async (req, res) => {
    try {
      const id = req.params.id as string;
      const input = insertPortfolioAlertSchema.partial().parse(req.body);
      const updated = await storage.updateAlert(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.get(api.projects.list.path, async (_req, res) => {
    const rows = await storage.listProjects();
    res.json(rows);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const id = req.params.id as string;
    const row = await storage.getProject(id);
    if (!row) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(row);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = insertPortfolioProjectSchema.parse(req.body);
      const created = await storage.createProject(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.put(api.projects.update.path, async (req, res) => {
    try {
      const id = req.params.id as string;
      const input = insertPortfolioProjectSchema.partial().parse(req.body);
      const updated = await storage.updateProject(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.get(api.certifications.list.path, async (_req, res) => {
    const rows = await storage.listCertifications();
    res.json(rows);
  });

  app.post(api.certifications.create.path, async (req, res) => {
    try {
      const input = insertPortfolioCertificationSchema.parse(req.body);
      const created = await storage.createCertification(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.get(api.experience.list.path, async (_req, res) => {
    const rows = await storage.listExperience();
    res.json(rows);
  });

  app.post(api.experience.create.path, async (req, res) => {
    try {
      const input = insertPortfolioExperienceSchema.parse(req.body);
      const created = await storage.createExperience(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.get(api.achievements.list.path, async (_req, res) => {
    const rows = await storage.listAchievements();
    res.json(rows);
  });

  app.post(api.achievements.create.path, async (req, res) => {
    try {
      const input = insertPortfolioAchievementSchema.parse(req.body);
      const created = await storage.createAchievement(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  app.get(api.labs.list.path, async (_req, res) => {
    const rows = await storage.listLabs();
    res.json(rows);
  });

  app.post(api.labs.create.path, async (req, res) => {
    try {
      const input = insertPortfolioLabSchema.parse(req.body);
      const created = await storage.createLab(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(zodToValidation(err));
      }
      throw err;
    }
  });

  return httpServer;
}

export async function seedDatabase() {
  const overview = await storage.getOverview();

  if (overview.projects.length === 0) {
    await storage.createProject({
      name: "SQL Injection Lab",
      category: "web_security",
      description: "Simulated SQLi attacks and implemented prevention in a controlled lab.",
      whatIDid:
        "Built vulnerable endpoints, executed common SQLi payloads, and validated fixes using parameterized queries and input validation.",
      tools: "Burp Suite, OWASP techniques, Node/Express, PostgreSQL",
      keyFindings:
        "Demonstrated impact of unsanitized inputs and verified prevention with prepared statements.",
      repoUrl: "https://github.com/",
      demoUrl: "",
    });

    await storage.createProject({
      name: "Password Strength Analyzer (Python)",
      category: "automation",
      description: "CLI tool to score and analyze password strength.",
      whatIDid:
        "Implemented entropy scoring, common-pattern detection, and actionable feedback for users.",
      tools: "Python, regex, security baselines",
      keyFindings:
        "Highlights weak patterns and suggests improvements aligned to policy controls.",
      repoUrl: "https://github.com/",
      demoUrl: "",
    });

    await storage.createProject({
      name: "SIEM Lab",
      category: "defensive_security",
      description: "Setup a SIEM to monitor threats on localhost and generate detections.",
      whatIDid:
        "Ingested logs, built detection rules, and validated alerting with simulated events.",
      tools: "Wazuh/Splunk, Sysmon, Windows Event Logs, Linux",
      keyFindings:
        "Turned raw logs into meaningful signals with alert triage workflow.",
      repoUrl: "https://github.com/",
      demoUrl: "",
    });

    await storage.createProject({
      name: "Firewall Lab",
      category: "network_security",
      description: "Demonstrated firewall rules and traffic filtering.",
      whatIDid:
        "Created allow/deny rules, tested with traffic generation, and documented least-privilege policy.",
      tools: "iptables/UFW, Wireshark",
      keyFindings:
        "Mapped rules to expected traffic patterns and validated outcomes.",
      repoUrl: "https://github.com/",
      demoUrl: "",
    });
  }

  if (overview.certifications.length === 0) {
    await storage.createCertification({
      name: "Certified Network Security Expert",
      issuer: "cdi",
      credentialUrl: "",
      year: 2024,
    });
    await storage.createCertification({
      name: "Web Security",
      issuer: "cdi",
      credentialUrl: "",
      year: 2024,
    });
    await storage.createCertification({
      name: "Defensive Security",
      issuer: "sensation_software_solutions",
      credentialUrl: "",
      year: 2024,
    });
    await storage.createCertification({
      name: "Cisco Networking Labs",
      issuer: "udemy",
      credentialUrl: "",
      year: 2023,
    });
  }

  if (overview.experience.length === 0) {
    await storage.createExperience({
      role: "Cybersecurity Trainer & Analyst",
      org: "TECHCADD, Mohali",
      type: "job",
      location: "Mohali, Punjab",
      startMonth: 6,
      startYear: 2024,
      endMonth: null,
      endYear: null,
      isCurrent: true,
      highlights:
        "Training students in cybersecurity fundamentals, SOC concepts, Linux, and tooling. Building hands-on labs and guiding threat detection exercises.",
    });
  }

  if (overview.achievements.length === 0) {
    await storage.createAchievement({
      title: "Reported vulnerabilities in University ERP system",
      type: "security",
      details:
        "Identified and responsibly reported issues, improving overall security posture.",
      year: 2024,
    });
    await storage.createAchievement({
      title: "Gold Medal – AIU North Zone Bhangra",
      type: "sports",
      details: "Team achievement showcasing discipline and performance under pressure.",
      year: 2025,
    });
    await storage.createAchievement({
      title: "Silver Medal – AIU National Bhangra",
      type: "sports",
      details: "National-level recognition for consistent excellence.",
      year: 2025,
    });
  }

  if (overview.labs.length === 0) {
    await storage.createLab({
      name: "SOC & Log Analysis Labs",
      type: "log_analysis",
      description: "Hands-on log analysis and alert triage exercises.",
      tools: "TryHackMe, Sysmon, Windows Event Viewer, Linux",
      outcome: "Improved signal-to-noise triage and investigation write-ups.",
      difficulty: "Intermediate",
      badge: "TryHackMe",
      link: "https://tryhackme.com/",
    });

    await storage.createLab({
      name: "Metasploitable-2 Defensive Walkthrough",
      type: "networking",
      description: "Lab network testing and defensive hardening tasks.",
      tools: "Metasploitable-2, Kali, Wireshark",
      outcome: "Validated controls and documented mitigations for common services.",
      difficulty: "Intermediate",
      badge: "Lab",
      link: "",
    });
  }

  if (overview.alerts.length === 0) {
    const now = Math.floor(Date.now() / 1000);
    await storage.createAlert({
      title: "Suspicious authentication failures detected",
      summary: "Burst of failed logins from a single source with user enumeration pattern.",
      severity: "high",
      status: "investigating",
      source: "SIEM Lab",
      environment: "localhost",
      technique: "Brute Force",
      indicator: "Multiple failed auth attempts",
      mitreTactic: "Credential Access",
      mitreTechnique: "T1110 Brute Force",
      firstSeen: now - 3600,
      lastSeen: now - 300,
      count: 42,
      isSuppressed: false,
    });

    await storage.createAlert({
      title: "Potential SQLi probe in web logs",
      summary: "Detected classic SQLi payload patterns in query strings.",
      severity: "medium",
      status: "open",
      source: "Web Security Lab",
      environment: "training",
      technique: "SQL Injection",
      indicator: "' OR 1=1 --",
      mitreTactic: "Initial Access",
      mitreTechnique: "T1190 Exploit Public-Facing Application",
      firstSeen: now - 7200,
      lastSeen: now - 1800,
      count: 9,
      isSuppressed: false,
    });

    await storage.createAlert({
      title: "Firewall policy change observed",
      summary: "Inbound rule modified; review change window and expected traffic.",
      severity: "low",
      status: "contained",
      source: "Firewall Lab",
      environment: "lab",
      technique: "Policy Change",
      indicator: "iptables rule update",
      mitreTactic: "Defense Evasion",
      mitreTechnique: "T1562 Impair Defenses",
      firstSeen: now - 86400,
      lastSeen: now - 86000,
      count: 1,
      isSuppressed: true,
    });
  }
}
