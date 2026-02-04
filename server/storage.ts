import { randomUUID } from "crypto";
import {
  type InsertPortfolioAchievement,
  type InsertPortfolioAlert,
  type InsertPortfolioCertification,
  type InsertPortfolioEducation,
  type InsertPortfolioExperienceItem,
  type InsertPortfolioLab,
  type InsertPortfolioProject,
  type PortfolioAchievement,
  type PortfolioAlert,
  type PortfolioCertification,
  type PortfolioEducation,
  type PortfolioExperienceItem,
  type PortfolioLab,
  type PortfolioProject,
} from "@shared/schema";
import { portfolioSeedData } from "./data";

const compareNumberDesc = (a: number | null | undefined, b: number | null | undefined) => {
  const safeA = typeof a === "number" ? a : -Infinity;
  const safeB = typeof b === "number" ? b : -Infinity;
  return safeB - safeA;
};

const createId = () => randomUUID();

export interface AlertsQuery {
  severity?: "critical" | "high" | "medium" | "low" | "info";
  status?: "open" | "investigating" | "contained" | "resolved" | "false_positive";
  suppressed?: boolean;
  search?: string;
}

export interface IStorage {
  getOverview(): Promise<{
    alerts: PortfolioAlert[];
    projects: PortfolioProject[];
    certifications: PortfolioCertification[];
    experience: PortfolioExperienceItem[];
    education: PortfolioEducation[];
    achievements: PortfolioAchievement[];
    labs: PortfolioLab[];
  }>;

  listAlerts(query?: AlertsQuery): Promise<PortfolioAlert[]>;
  getAlert(id: string): Promise<PortfolioAlert | undefined>;
  createAlert(input: InsertPortfolioAlert): Promise<PortfolioAlert>;
  updateAlert(
    id: string,
    updates: Partial<InsertPortfolioAlert>,
  ): Promise<PortfolioAlert | undefined>;

  listProjects(): Promise<PortfolioProject[]>;
  getProject(id: string): Promise<PortfolioProject | undefined>;
  createProject(input: InsertPortfolioProject): Promise<PortfolioProject>;
  updateProject(
    id: string,
    updates: Partial<InsertPortfolioProject>,
  ): Promise<PortfolioProject | undefined>;

  listCertifications(): Promise<PortfolioCertification[]>;
  createCertification(
    input: InsertPortfolioCertification,
  ): Promise<PortfolioCertification>;

  listExperience(): Promise<PortfolioExperienceItem[]>;
  createExperience(
    input: InsertPortfolioExperienceItem,
  ): Promise<PortfolioExperienceItem>;

  listEducation(): Promise<PortfolioEducation[]>;
  createEducation(
    input: InsertPortfolioEducation,
  ): Promise<PortfolioEducation>;

  listAchievements(): Promise<PortfolioAchievement[]>;
  createAchievement(
    input: InsertPortfolioAchievement,
  ): Promise<PortfolioAchievement>;

  listLabs(): Promise<PortfolioLab[]>;
  createLab(input: InsertPortfolioLab): Promise<PortfolioLab>;
}

export class DatabaseStorage implements IStorage {
  private alerts: PortfolioAlert[] = [];
  private projects: PortfolioProject[] = [];
  private certifications: PortfolioCertification[] = [];
  private experience: PortfolioExperienceItem[] = [];
  private education: PortfolioEducation[] = [];
  private achievements: PortfolioAchievement[] = [];
  private labs: PortfolioLab[] = [];

  constructor() {
    this.alerts = portfolioSeedData.alerts.map((item) => ({
      id: createId(),
      status: item.status ?? "open",
      count: item.count ?? 1,
      isSuppressed: item.isSuppressed ?? false,
      ...item,
    }));
    this.projects = portfolioSeedData.projects.map((item) => ({
      id: createId(),
      ...item,
    }));
    this.certifications = portfolioSeedData.certifications.map((item) => ({
      id: createId(),
      ...item,
    }));
    this.experience = portfolioSeedData.experience.map((item) => ({
      id: createId(),
      isCurrent: item.isCurrent ?? false,
      ...item,
    }));
    this.education = portfolioSeedData.education.map((item) => ({
      id: createId(),
      ...item,
    }));
    this.achievements = portfolioSeedData.achievements.map((item) => ({
      id: createId(),
      ...item,
    }));
    this.labs = portfolioSeedData.labs.map((item) => ({
      id: createId(),
      ...item,
    }));
  }

  async getOverview(): Promise<{
    alerts: PortfolioAlert[];
    projects: PortfolioProject[];
    certifications: PortfolioCertification[];
    experience: PortfolioExperienceItem[];
    education: PortfolioEducation[];
    achievements: PortfolioAchievement[];
    labs: PortfolioLab[];
  }> {
    const [alerts, projects, certifications, experience, education, achievements, labs] = await Promise.all([
      this.listAlerts(),
      this.listProjects(),
      this.listCertifications(),
      this.listExperience(),
      this.listEducation(),
      this.listAchievements(),
      this.listLabs(),
    ]);

    return {
      alerts,
      projects,
      certifications,
      experience,
      education,
      achievements,
      labs,
    };
  }

  async listAlerts(query?: AlertsQuery): Promise<PortfolioAlert[]> {
    let rows = [...this.alerts];

    if (query?.severity) {
      rows = rows.filter((row) => row.severity === query.severity);
    }

    if (query?.status) {
      rows = rows.filter((row) => row.status === query.status);
    }

    if (typeof query?.suppressed === "boolean") {
      rows = rows.filter((row) => row.isSuppressed === query.suppressed);
    }

    if (query?.search) {
      const needle = query.search.toLowerCase();
      rows = rows.filter((row) =>
        [row.title, row.summary, row.indicator].some((value) =>
          value.toLowerCase().includes(needle),
        ),
      );
    }

    return rows.sort((a, b) => compareNumberDesc(a.lastSeen, b.lastSeen));
  }

  async getAlert(id: string): Promise<PortfolioAlert | undefined> {
    return this.alerts.find((row) => row.id === id);
  }

  async createAlert(input: InsertPortfolioAlert): Promise<PortfolioAlert> {
    const created: PortfolioAlert = {
      id: createId(),
      status: input.status ?? "open",
      count: input.count ?? 1,
      isSuppressed: input.isSuppressed ?? false,
      ...input,
    };
    this.alerts.push(created);
    return created;
  }

  async updateAlert(
    id: string,
    updates: Partial<InsertPortfolioAlert>,
  ): Promise<PortfolioAlert | undefined> {
    const index = this.alerts.findIndex((row) => row.id === id);
    if (index === -1) return undefined;

    const current = this.alerts[index];
    const updated: PortfolioAlert = {
      ...current,
      ...updates,
    };
    this.alerts[index] = updated;
    return updated;
  }

  async listProjects(): Promise<PortfolioProject[]> {
    return [...this.projects];
  }

  async getProject(id: string): Promise<PortfolioProject | undefined> {
    return this.projects.find((row) => row.id === id);
  }

  async createProject(input: InsertPortfolioProject): Promise<PortfolioProject> {
    const created: PortfolioProject = {
      id: createId(),
      ...input,
    };
    this.projects.push(created);
    return created;
  }

  async updateProject(
    id: string,
    updates: Partial<InsertPortfolioProject>,
  ): Promise<PortfolioProject | undefined> {
    const index = this.projects.findIndex((row) => row.id === id);
    if (index === -1) return undefined;

    const current = this.projects[index];
    const updated: PortfolioProject = {
      ...current,
      ...updates,
    };
    this.projects[index] = updated;
    return updated;
  }

  async listCertifications(): Promise<PortfolioCertification[]> {
    return [...this.certifications].sort((a, b) => compareNumberDesc(a.year, b.year));
  }

  async createCertification(
    input: InsertPortfolioCertification,
  ): Promise<PortfolioCertification> {
    const created: PortfolioCertification = {
      id: createId(),
      ...input,
    };
    this.certifications.push(created);
    return created;
  }

  async listExperience(): Promise<PortfolioExperienceItem[]> {
    return [...this.experience].sort((a, b) => {
      const byYear = compareNumberDesc(a.startYear, b.startYear);
      if (byYear !== 0) return byYear;
      return compareNumberDesc(a.startMonth, b.startMonth);
    });
  }

  async createExperience(
    input: InsertPortfolioExperienceItem,
  ): Promise<PortfolioExperienceItem> {
    const created: PortfolioExperienceItem = {
      id: createId(),
      isCurrent: input.isCurrent ?? false,
      ...input,
    };
    this.experience.push(created);
    return created;
  }

  async listEducation(): Promise<PortfolioEducation[]> {
    return [...this.education].sort((a, b) => compareNumberDesc(a.endYear ?? a.startYear, b.endYear ?? b.startYear));
  }

  async createEducation(
    input: InsertPortfolioEducation,
  ): Promise<PortfolioEducation> {
    const created: PortfolioEducation = {
      id: createId(),
      ...input,
    };
    this.education.push(created);
    return created;
  }

  async listAchievements(): Promise<PortfolioAchievement[]> {
    return [...this.achievements].sort((a, b) => compareNumberDesc(a.year, b.year));
  }

  async createAchievement(
    input: InsertPortfolioAchievement,
  ): Promise<PortfolioAchievement> {
    const created: PortfolioAchievement = {
      id: createId(),
      ...input,
    };
    this.achievements.push(created);
    return created;
  }

  async listLabs(): Promise<PortfolioLab[]> {
    return [...this.labs];
  }

  async createLab(input: InsertPortfolioLab): Promise<PortfolioLab> {
    const created: PortfolioLab = {
      id: createId(),
      ...input,
    };
    this.labs.push(created);
    return created;
  }
}

export const storage = new DatabaseStorage();
