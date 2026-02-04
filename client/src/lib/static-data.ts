import type {
  PortfolioAchievement,
  PortfolioAlert,
  PortfolioCertification,
  PortfolioEducation,
  PortfolioExperienceItem,
  PortfolioLab,
  PortfolioProject,
} from "@shared/schema";

export const staticPortfolioData: {
  alerts: PortfolioAlert[];
  projects: PortfolioProject[];
  certifications: PortfolioCertification[];
  experience: PortfolioExperienceItem[];
  education: PortfolioEducation[];
  achievements: PortfolioAchievement[];
  labs: PortfolioLab[];
} = {
  alerts: [],
  projects: [
    {
      id: "proj-1",
      name: "SQL Injection Lab",
      category: "web_security",
      description:
        "Simulated SQL injection attacks to demonstrate database vulnerabilities and implemented preventive security measures.",
      whatIDid:
        "Built vulnerable queries, executed common SQLi payloads, and validated fixes using parameterized queries and input validation.",
      tools: "OWASP techniques, SQL, Burp Suite",
      keyFindings:
        "Showed impact of unsanitized inputs and verified protections with prepared statements.",
      repoUrl: "",
      demoUrl: "",
    },
    {
      id: "proj-2",
      name: "Password Strength Analyzer",
      category: "automation",
      description:
        "Developed a Python tool to assess and score password complexity, improving security awareness.",
      whatIDid:
        "Implemented entropy checks, common-pattern detection, and actionable feedback for users.",
      tools: "Python, regex",
      keyFindings: "Highlights weak patterns and suggests stronger password practices.",
      repoUrl: "",
      demoUrl: "",
    },
    {
      id: "proj-3",
      name: "SIEM Lab",
      category: "defensive_security",
      description: "Setup a SIEM lab to detect and monitor threats on localhost.",
      whatIDid:
        "Ingested logs, created detection rules, and validated alerting with simulated events.",
      tools: "Wazuh/Splunk, Sysmon, Windows Event Logs",
      keyFindings: "Converted raw logs into actionable alerts for investigation.",
      repoUrl: "",
      demoUrl: "",
    },
    {
      id: "proj-4",
      name: "Firewall Lab",
      category: "network_security",
      description:
        "Configured a software firewall to demonstrate rule behavior and traffic control.",
      whatIDid:
        "Created allow/deny rules, tested with traffic generation, and documented results.",
      tools: "Windows Firewall, Linux firewall tools",
      keyFindings: "Validated least-privilege policies and rule effectiveness.",
      repoUrl: "",
      demoUrl: "",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Certified Network Security Expert",
      issuer: "cdi",
      credentialUrl: "",
      year: 2024,
    },
    {
      id: "cert-2",
      name: "Web Security",
      issuer: "cdi",
      credentialUrl: "",
      year: 2024,
    },
    {
      id: "cert-3",
      name: "Defensive Security",
      issuer: "sensation_software_solutions",
      credentialUrl: "",
      year: 2025,
    },
    {
      id: "cert-4",
      name: "Practical Cisco Networking Labs in Cisco Packet Tracer",
      issuer: "udemy",
      credentialUrl: "",
      year: 2025,
    },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Cybersecurity Trainer and Analyst",
      org: "TECHCADD",
      type: "job",
      location: "Mohali, Punjab",
      startMonth: 12,
      startYear: 2025,
      endMonth: null,
      endYear: null,
      isCurrent: true,
      highlights: "Working on company cybersecurity projects and delivering cybersecurity training.",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "GNA University",
      location: "Phagwara, Punjab",
      level: "bachelors",
      degree: "B.Tech",
      field: "Computer Science & Engineering (Cybersecurity)",
      startYear: 2022,
      endYear: null,
      status: "Pursuing",
      details: "Undergraduate program focused on cybersecurity specialization.",
    },
    {
      id: "edu-2",
      institution: "Lord Mahavira Jain Public School",
      location: "Phagwara, Punjab",
      level: "senior_secondary",
      degree: "Senior Secondary Education",
      field: "",
      startYear: 2020,
      endYear: 2021,
      status: "Completed",
      details: "Senior secondary education.",
    },
    {
      id: "edu-3",
      institution: "Lord Mahavira Jain Public School",
      location: "Phagwara, Punjab",
      level: "secondary",
      degree: "Secondary Education",
      field: "",
      startYear: 2019,
      endYear: 2020,
      status: "Completed",
      details: "Secondary education.",
    },
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Reported vulnerabilities in GNA University ERP system",
      type: "security",
      details: "Discovered and responsibly reported multiple vulnerabilities in the university ERP.",
      year: 2025,
    },
    {
      id: "ach-2",
      title: "Gold Medal – 38th AIU North Zone Bhangra",
      type: "sports",
      details: "Team achievement demonstrating discipline and performance.",
      year: 2025,
    },
    {
      id: "ach-3",
      title: "Silver Medal – 38th AIU National Bhangra",
      type: "sports",
      details: "National-level recognition for consistent excellence.",
      year: 2025,
    },
  ],
  labs: [
    {
      id: "lab-1",
      name: "SOC & Log Analysis Labs",
      type: "log_analysis",
      description: "Solved SOC and log analysis labs on TryHackMe.",
      tools: "TryHackMe",
      outcome: "Improved detection, triage, and investigation skills.",
      difficulty: "Beginner",
      badge: "TryHackMe",
      link: "https://tryhackme.com/",
    },
    {
      id: "lab-2",
      name: "SIEM Lab",
      type: "siem_lab",
      description: "Configured a SIEM lab to detect and monitor threats on localhost.",
      tools: "Wazuh/Splunk, Sysmon, Windows Event Logs",
      outcome: "Built alerting and monitoring workflows for SOC-style investigations.",
      difficulty: "Intermediate",
      badge: "Lab",
      link: "",
    },
    {
      id: "lab-3",
      name: "Firewall Lab",
      type: "firewall_lab",
      description: "Configured firewall rules to demonstrate traffic filtering.",
      tools: "Windows Firewall, Linux firewall tools",
      outcome: "Validated rule effectiveness and least-privilege policies.",
      difficulty: "Intermediate",
      badge: "Lab",
      link: "",
    },
    {
      id: "lab-4",
      name: "SQL Injection Lab",
      type: "sql_injection",
      description: "Demonstrated SQL injection vulnerabilities and remediation.",
      tools: "OWASP techniques, SQL",
      outcome: "Validated secure coding patterns against injection attacks.",
      difficulty: "Intermediate",
      badge: "Lab",
      link: "",
    },
  ],
};

export const staticOverview = {
  alerts: staticPortfolioData.alerts,
  projects: staticPortfolioData.projects,
  certifications: staticPortfolioData.certifications,
  experience: staticPortfolioData.experience,
  education: staticPortfolioData.education,
  achievements: staticPortfolioData.achievements,
  labs: staticPortfolioData.labs,
};
