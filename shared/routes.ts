import { z } from "zod";
import {
  insertPortfolioAlertSchema,
  insertPortfolioCertificationSchema,
  insertPortfolioExperienceSchema,
  insertPortfolioEducationSchema,
  insertPortfolioLabSchema,
  insertPortfolioProjectSchema,
  insertPortfolioAchievementSchema,
  portfolioAlerts,
  portfolioProjects,
  portfolioCertifications,
  portfolioExperience,
  portfolioEducation,
  portfolioAchievements,
  portfolioLabs,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const idParam = z.object({ id: z.string().min(1) });

export const api = {
  portfolio: {
    overview: {
      method: "GET" as const,
      path: "/api/portfolio/overview",
      responses: {
        200: z.object({
          alerts: z.array(z.custom<typeof portfolioAlerts.$inferSelect>()),
          projects: z.array(z.custom<typeof portfolioProjects.$inferSelect>()),
          certifications: z.array(
            z.custom<typeof portfolioCertifications.$inferSelect>(),
          ),
          experience: z.array(z.custom<typeof portfolioExperience.$inferSelect>()),
          education: z.array(z.custom<typeof portfolioEducation.$inferSelect>()),
          achievements: z.array(
            z.custom<typeof portfolioAchievements.$inferSelect>(),
          ),
          labs: z.array(z.custom<typeof portfolioLabs.$inferSelect>()),
        }),
      },
    },
  },
  alerts: {
    list: {
      method: "GET" as const,
      path: "/api/alerts",
      input: z
        .object({
          severity: z
            .enum(["critical", "high", "medium", "low", "info"])
            .optional(),
          status: z
            .enum([
              "open",
              "investigating",
              "contained",
              "resolved",
              "false_positive",
            ])
            .optional(),
          suppressed: z.coerce.boolean().optional(),
          search: z.string().optional(),
        })
        .optional(),
      responses: {
        200: z.array(z.custom<typeof portfolioAlerts.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/alerts/:id",
      responses: {
        200: z.custom<typeof portfolioAlerts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/alerts",
      input: insertPortfolioAlertSchema,
      responses: {
        201: z.custom<typeof portfolioAlerts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/alerts/:id",
      input: insertPortfolioAlertSchema.partial(),
      responses: {
        200: z.custom<typeof portfolioAlerts.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  projects: {
    list: {
      method: "GET" as const,
      path: "/api/projects",
      responses: {
        200: z.array(z.custom<typeof portfolioProjects.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/projects/:id",
      responses: {
        200: z.custom<typeof portfolioProjects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/projects",
      input: insertPortfolioProjectSchema,
      responses: {
        201: z.custom<typeof portfolioProjects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/projects/:id",
      input: insertPortfolioProjectSchema.partial(),
      responses: {
        200: z.custom<typeof portfolioProjects.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  certifications: {
    list: {
      method: "GET" as const,
      path: "/api/certifications",
      responses: {
        200: z.array(z.custom<typeof portfolioCertifications.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/certifications",
      input: insertPortfolioCertificationSchema,
      responses: {
        201: z.custom<typeof portfolioCertifications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  experience: {
    list: {
      method: "GET" as const,
      path: "/api/experience",
      responses: {
        200: z.array(z.custom<typeof portfolioExperience.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/experience",
      input: insertPortfolioExperienceSchema,
      responses: {
        201: z.custom<typeof portfolioExperience.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  education: {
    list: {
      method: "GET" as const,
      path: "/api/education",
      responses: {
        200: z.array(z.custom<typeof portfolioEducation.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/education",
      input: insertPortfolioEducationSchema,
      responses: {
        201: z.custom<typeof portfolioEducation.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  achievements: {
    list: {
      method: "GET" as const,
      path: "/api/achievements",
      responses: {
        200: z.array(z.custom<typeof portfolioAchievements.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/achievements",
      input: insertPortfolioAchievementSchema,
      responses: {
        201: z.custom<typeof portfolioAchievements.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  labs: {
    list: {
      method: "GET" as const,
      path: "/api/labs",
      responses: {
        200: z.array(z.custom<typeof portfolioLabs.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/labs",
      input: insertPortfolioLabSchema,
      responses: {
        201: z.custom<typeof portfolioLabs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AlertInput = z.infer<typeof api.alerts.create.input>;
export type AlertUpdateInput = z.infer<typeof api.alerts.update.input>;
export type AlertResponse = z.infer<typeof api.alerts.get.responses[200]>;
export type AlertsListResponse = z.infer<typeof api.alerts.list.responses[200]>;

export type ProjectInput = z.infer<typeof api.projects.create.input>;
export type ProjectResponse = z.infer<typeof api.projects.get.responses[200]>;

export type CertificationInput = z.infer<typeof api.certifications.create.input>;
export type ExperienceInput = z.infer<typeof api.experience.create.input>;
export type EducationInput = z.infer<typeof api.education.create.input>;
export type AchievementInput = z.infer<typeof api.achievements.create.input>;
export type LabInput = z.infer<typeof api.labs.create.input>;

export type PortfolioOverviewResponse = z.infer<
  typeof api.portfolio.overview.responses[200]
>;

export const paramsSchemas = {
  id: idParam,
};
