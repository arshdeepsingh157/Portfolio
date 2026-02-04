import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const severityEnum = pgEnum("severity", [
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);

export const alertStatusEnum = pgEnum("alert_status", [
  "open",
  "investigating",
  "contained",
  "resolved",
  "false_positive",
]);

export const portfolioAlerts = pgTable("portfolio_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  severity: severityEnum("severity").notNull(),
  status: alertStatusEnum("status").notNull().default("open"),
  source: text("source").notNull(),
  environment: text("environment").notNull(),
  technique: text("technique").notNull(),
  indicator: text("indicator").notNull(),
  mitreTactic: text("mitre_tactic").notNull(),
  mitreTechnique: text("mitre_technique").notNull(),
  firstSeen: integer("first_seen").notNull(),
  lastSeen: integer("last_seen").notNull(),
  count: integer("count").notNull().default(1),
  isSuppressed: boolean("is_suppressed").notNull().default(false),
});

export const insertPortfolioAlertSchema = createInsertSchema(portfolioAlerts).omit({
  id: true,
});

export type PortfolioAlert = typeof portfolioAlerts.$inferSelect;
export type InsertPortfolioAlert = z.infer<typeof insertPortfolioAlertSchema>;

export type ListAlertsResponse = PortfolioAlert[];

export type UpdateAlertRequest = Partial<
  Omit<InsertPortfolioAlert, "firstSeen" | "lastSeen"> & {
    firstSeen: number;
    lastSeen: number;
  }
>;

export type AlertResponse = PortfolioAlert;

export const labTypeEnum = pgEnum("lab_type", [
  "sql_injection",
  "password_strength",
  "siem_lab",
  "firewall_lab",
  "networking",
  "log_analysis",
]);

export const portfolioLabs = pgTable("portfolio_labs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: labTypeEnum("type").notNull(),
  description: text("description").notNull(),
  tools: text("tools").notNull(),
  outcome: text("outcome").notNull(),
  difficulty: text("difficulty").notNull(),
  badge: text("badge").notNull(),
  link: text("link").notNull(),
});

export const insertPortfolioLabSchema = createInsertSchema(portfolioLabs).omit({
  id: true,
});

export type PortfolioLab = typeof portfolioLabs.$inferSelect;
export type InsertPortfolioLab = z.infer<typeof insertPortfolioLabSchema>;

export const projectCategoryEnum = pgEnum("project_category", [
  "web_security",
  "defensive_security",
  "automation",
  "network_security",
  "training",
]);

export const portfolioProjects = pgTable("portfolio_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: projectCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  whatIDid: text("what_i_did").notNull(),
  tools: text("tools").notNull(),
  keyFindings: text("key_findings").notNull(),
  repoUrl: text("repo_url").notNull(),
  demoUrl: text("demo_url").notNull(),
});

export const insertPortfolioProjectSchema = createInsertSchema(
  portfolioProjects,
).omit({ id: true });

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;

export const certificationIssuerEnum = pgEnum("cert_issuer", [
  "cdi",
  "sensation_software_solutions",
  "udemy",
  "other",
]);

export const portfolioCertifications = pgTable("portfolio_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  issuer: certificationIssuerEnum("issuer").notNull(),
  credentialUrl: text("credential_url").notNull(),
  year: integer("year").notNull(),
});

export const insertPortfolioCertificationSchema = createInsertSchema(
  portfolioCertifications,
).omit({ id: true });

export type PortfolioCertification =
  typeof portfolioCertifications.$inferSelect;
export type InsertPortfolioCertification = z.infer<
  typeof insertPortfolioCertificationSchema
>;

export const experienceTypeEnum = pgEnum("experience_type", [
  "job",
  "internship",
  "training",
  "volunteer",
]);

export const portfolioExperience = pgTable("portfolio_experience", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  org: text("org").notNull(),
  type: experienceTypeEnum("type").notNull(),
  location: text("location").notNull(),
  startMonth: integer("start_month").notNull(),
  startYear: integer("start_year").notNull(),
  endMonth: integer("end_month"),
  endYear: integer("end_year"),
  isCurrent: boolean("is_current").notNull().default(false),
  highlights: text("highlights").notNull(),
});

export const insertPortfolioExperienceSchema = createInsertSchema(
  portfolioExperience,
).omit({ id: true });

export type PortfolioExperienceItem = typeof portfolioExperience.$inferSelect;
export type InsertPortfolioExperienceItem = z.infer<
  typeof insertPortfolioExperienceSchema
>;

export const educationLevelEnum = pgEnum("education_level", [
  "bachelors",
  "senior_secondary",
  "secondary",
  "diploma",
  "other",
]);

export const portfolioEducation = pgTable("portfolio_education", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  institution: text("institution").notNull(),
  location: text("location").notNull(),
  level: educationLevelEnum("level").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  status: text("status").notNull(),
  details: text("details").notNull(),
});

export const insertPortfolioEducationSchema = createInsertSchema(
  portfolioEducation,
).omit({ id: true });

export type PortfolioEducation = typeof portfolioEducation.$inferSelect;
export type InsertPortfolioEducation = z.infer<
  typeof insertPortfolioEducationSchema
>;

export const achievementTypeEnum = pgEnum("achievement_type", [
  "security",
  "award",
  "sports",
  "other",
]);

export const portfolioAchievements = pgTable("portfolio_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: achievementTypeEnum("type").notNull(),
  details: text("details").notNull(),
  year: integer("year").notNull(),
});

export const insertPortfolioAchievementSchema = createInsertSchema(
  portfolioAchievements,
).omit({ id: true });

export type PortfolioAchievement = typeof portfolioAchievements.$inferSelect;
export type InsertPortfolioAchievement = z.infer<
  typeof insertPortfolioAchievementSchema
>;

export type PortfolioOverviewResponse = {
  alerts: PortfolioAlert[];
  projects: PortfolioProject[];
  certifications: PortfolioCertification[];
  experience: PortfolioExperienceItem[];
  education: PortfolioEducation[];
  achievements: PortfolioAchievement[];
  labs: PortfolioLab[];
};
