import { eq, and, ilike, sql } from "drizzle-orm";
import {
  portfolioAchievements,
  portfolioAlerts,
  portfolioCertifications,
  portfolioExperience,
  portfolioLabs,
  portfolioProjects,
  type InsertPortfolioAchievement,
  type InsertPortfolioAlert,
  type InsertPortfolioCertification,
  type InsertPortfolioExperienceItem,
  type InsertPortfolioLab,
  type InsertPortfolioProject,
  type PortfolioAchievement,
  type PortfolioAlert,
  type PortfolioCertification,
  type PortfolioExperienceItem,
  type PortfolioLab,
  type PortfolioProject,
} from "@shared/schema";
import { db } from "./db";

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

  listAchievements(): Promise<PortfolioAchievement[]>;
  createAchievement(
    input: InsertPortfolioAchievement,
  ): Promise<PortfolioAchievement>;

  listLabs(): Promise<PortfolioLab[]>;
  createLab(input: InsertPortfolioLab): Promise<PortfolioLab>;
}

export class DatabaseStorage implements IStorage {
  async getOverview(): Promise<{
    alerts: PortfolioAlert[];
    projects: PortfolioProject[];
    certifications: PortfolioCertification[];
    experience: PortfolioExperienceItem[];
    achievements: PortfolioAchievement[];
    labs: PortfolioLab[];
  }> {
    const [alerts, projects, certifications, experience, achievements, labs] =
      await Promise.all([
        this.listAlerts(),
        this.listProjects(),
        this.listCertifications(),
        this.listExperience(),
        this.listAchievements(),
        this.listLabs(),
      ]);

    return { alerts, projects, certifications, experience, achievements, labs };
  }

  async listAlerts(query?: AlertsQuery): Promise<PortfolioAlert[]> {
    const whereClauses = [];
    if (query?.severity) whereClauses.push(eq(portfolioAlerts.severity, query.severity));
    if (query?.status) whereClauses.push(eq(portfolioAlerts.status, query.status));
    if (typeof query?.suppressed === "boolean")
      whereClauses.push(eq(portfolioAlerts.isSuppressed, query.suppressed));

    if (query?.search) {
      const pattern = `%${query.search}%`;
      whereClauses.push(
        sql`(${portfolioAlerts.title} ILIKE ${pattern} OR ${portfolioAlerts.summary} ILIKE ${pattern} OR ${portfolioAlerts.indicator} ILIKE ${pattern})`,
      );
    }

    if (whereClauses.length === 0) {
      return await db
        .select()
        .from(portfolioAlerts)
        .orderBy(sql`${portfolioAlerts.lastSeen} DESC`);
    }

    return await db
      .select()
      .from(portfolioAlerts)
      .where(and(...whereClauses))
      .orderBy(sql`${portfolioAlerts.lastSeen} DESC`);
  }

  async getAlert(id: string): Promise<PortfolioAlert | undefined> {
    const [row] = await db
      .select()
      .from(portfolioAlerts)
      .where(eq(portfolioAlerts.id, id));
    return row;
  }

  async createAlert(input: InsertPortfolioAlert): Promise<PortfolioAlert> {
    const [row] = await db.insert(portfolioAlerts).values(input).returning();
    return row;
  }

  async updateAlert(
    id: string,
    updates: Partial<InsertPortfolioAlert>,
  ): Promise<PortfolioAlert | undefined> {
    const [row] = await db
      .update(portfolioAlerts)
      .set(updates)
      .where(eq(portfolioAlerts.id, id))
      .returning();
    return row;
  }

  async listProjects(): Promise<PortfolioProject[]> {
    return await db.select().from(portfolioProjects);
  }

  async getProject(id: string): Promise<PortfolioProject | undefined> {
    const [row] = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.id, id));
    return row;
  }

  async createProject(input: InsertPortfolioProject): Promise<PortfolioProject> {
    const [row] = await db.insert(portfolioProjects).values(input).returning();
    return row;
  }

  async updateProject(
    id: string,
    updates: Partial<InsertPortfolioProject>,
  ): Promise<PortfolioProject | undefined> {
    const [row] = await db
      .update(portfolioProjects)
      .set(updates)
      .where(eq(portfolioProjects.id, id))
      .returning();
    return row;
  }

  async listCertifications(): Promise<PortfolioCertification[]> {
    return await db.select().from(portfolioCertifications).orderBy(sql`${portfolioCertifications.year} DESC`);
  }

  async createCertification(
    input: InsertPortfolioCertification,
  ): Promise<PortfolioCertification> {
    const [row] = await db
      .insert(portfolioCertifications)
      .values(input)
      .returning();
    return row;
  }

  async listExperience(): Promise<PortfolioExperienceItem[]> {
    return await db
      .select()
      .from(portfolioExperience)
      .orderBy(sql`${portfolioExperience.startYear} DESC, ${portfolioExperience.startMonth} DESC`);
  }

  async createExperience(
    input: InsertPortfolioExperienceItem,
  ): Promise<PortfolioExperienceItem> {
    const [row] = await db.insert(portfolioExperience).values(input).returning();
    return row;
  }

  async listAchievements(): Promise<PortfolioAchievement[]> {
    return await db
      .select()
      .from(portfolioAchievements)
      .orderBy(sql`${portfolioAchievements.year} DESC`);
  }

  async createAchievement(
    input: InsertPortfolioAchievement,
  ): Promise<PortfolioAchievement> {
    const [row] = await db
      .insert(portfolioAchievements)
      .values(input)
      .returning();
    return row;
  }

  async listLabs(): Promise<PortfolioLab[]> {
    return await db.select().from(portfolioLabs);
  }

  async createLab(input: InsertPortfolioLab): Promise<PortfolioLab> {
    const [row] = await db.insert(portfolioLabs).values(input).returning();
    return row;
  }
}

export const storage = new DatabaseStorage();
