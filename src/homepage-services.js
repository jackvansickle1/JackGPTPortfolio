import { Shield, Trophy } from "lucide-react";

// Public descriptions only. Never add owner portfolio data or private screenshots.
export const serviceProjects = [
  {
    id: "sports",
    name: "Rally Sports",
    subtitle: "Account-based sports picks demo",
    icon: Trophy,
    accent: "lime",
    accessLabel: "Free demo / account required",
    accessTone: "signup",
    tags: ["Sports", "Demo picks", "Accounts", "No cash or prizes"],
    summary: "A sports-picks product with account-based demo progress. Free demo only: no real-money wagering, purchases, withdrawals, or prizes.",
    description: "Rally at sports.jackgpt.org is an account-based sports-picks demo. It brings sports discovery and simulated picks into a responsive product. Demo credits have no cash value and cannot be redeemed for money or prizes.",
    howItWorks: [
      "Create an account or sign in to use the demo and keep progress attached to a player account.",
      "Browse sports and matchups, then make simulated picks with nonredeemable demo credits.",
      "The demo has no real-money wagering, deposits, purchases, withdrawals, or prizes.",
    ],
    developed: [
      "Built a sports discovery interface with matchup views and a demo pick workflow.",
      "Added account-based demo progress and responsive layouts for desktop and mobile.",
      "Kept the demo-only boundary explicit throughout the product.",
    ],
    tech: ["JavaScript", "Responsive UI", "Account-based demo"],
    links: [{ label: "Open Rally demo", href: "https://sports.jackgpt.org" }],
    screenshots: [],
  },
  {
    id: "trade",
    name: "Portfolio Research",
    subtitle: "Private, owner-only research workspace",
    icon: Shield,
    accent: "emerald",
    accessLabel: "Private / owner access",
    accessTone: "private",
    tags: ["Private", "Portfolio research", "Owner access", "ChatGPT sign-in"],
    summary: "An owner-only portfolio research workspace. This public case study describes the interface and access boundary, not portfolio data or investment results.",
    description: "Portfolio Research at trade.jackgpt.org is a private, owner-only research workspace with ChatGPT sign-in. It is not a recruiter demo or a public financial dashboard. This overview intentionally excludes account details, positions, balances, research recommendations, and private screenshots.",
    howItWorks: [
      "The owner signs in with ChatGPT; signing in does not grant public access to the workspace.",
      "The private interface organizes portfolio research, review context, and system evidence.",
      "Only this high-level description is public. Private portfolio information remains inside the owner workspace.",
    ],
    developed: [
      "Designed a compact research interface with section navigation, readable tables, and clear review states.",
      "Used tabular numbers, restrained emphasis, and explicit freshness and warning treatments.",
      "Kept public discovery separate from owner-only access and financial data.",
    ],
    tech: ["Research interface", "Responsive UI", "Owner-only access"],
    links: [{ label: "Owner sign-in only", href: "https://trade.jackgpt.org" }],
    screenshots: [],
    screenshotPolicy: "private",
  },
];

export const serviceAccessLinks = serviceProjects.map((project) => ({
  label: project.name,
  href: project.links[0].href,
  description: project.subtitle,
  accessLabel: project.accessLabel,
  accessTone: project.accessTone,
  note: project.id === "sports"
    ? "Sign in or create an account. Free demo picks only; no real money, cash value, or prizes."
    : "Owner-only workspace with ChatGPT sign-in. Not a public demo; no private portfolio data is shown here.",
}));

// The parent owns backend probes. Missing records deliberately stay unknown.
export const serviceStatuses = serviceProjects.map((project) => ({
  key: project.id,
  name: project.id === "trade" ? "Portfolio Research / sign-in gate" : project.name,
  description: "No verified service check yet.",
  accessMode: project.id === "trade" ? "Private" : "Account",
  accessNote: project.id === "trade"
    ? "Private / owner access. ChatGPT sign-in. Gate reachability only; private backend health is not assessed."
    : "Public account demo. Account-gate reachability only; application health is not assessed. No real money or prizes.",
  publicUrl: project.links[0].href,
  showEndpoint: project.id !== "trade",
  latencyMs: null,
  httpStatus: "-",
  checkedAt: null,
  status: "unknown",
}));
