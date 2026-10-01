import type { ReviewRun, ReviewTrendPoint, SeveritySlice, User } from "@/types";

export const mockUsers: Array<User & { password: string }> = [
  {
    id: "u-1",
    username: "admin",
    password: "admin123",
    fullName: "Ava Nguyen",
    email: "ava@nosyagentic.dev",
    role: "admin",
    avatar: "",
  },
  {
    id: "u-2",
    username: "approver",
    password: "approver123",
    fullName: "Marco Reyes",
    email: "marco@nosyagentic.dev",
    role: "approver",
    avatar: "",
  },
  {
    id: "u-3",
    username: "viewer",
    password: "viewer123",
    fullName: "Lena Hoffman",
    email: "lena@nosyagentic.dev",
    role: "viewer",
    avatar: "",
  },
];

export const reviewTrend: ReviewTrendPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const label = `${d.getMonth() + 1}/${d.getDate()}`;
  const reviews = 12 + Math.round(Math.sin(i / 2) * 6) + (i % 3) * 3;
  return { date: label, reviews, findings: reviews * 2 + (i % 4) * 3 };
});

export const severityBreakdown: SeveritySlice[] = [
  { severity: "critical", count: 6 },
  { severity: "high", count: 14 },
  { severity: "medium", count: 31 },
  { severity: "low", count: 42 },
  { severity: "info", count: 23 },
];

export const recentRuns: ReviewRun[] = [
  {
    id: "RUN-8842",
    prTitle: "feat: streaming agent responses",
    repo: "core/agent-runtime",
    provider: "gitlab",
    status: "completed",
    findings: 4,
    time: "6 min ago",
  },
  {
    id: "RUN-8841",
    prTitle: "fix: null guard in webhook parser",
    repo: "integrations/scm-hooks",
    provider: "bitbucket",
    status: "running",
    findings: 1,
    time: "12 min ago",
  },
  {
    id: "RUN-8840",
    prTitle: "chore: bump analyzer to 2.4.0",
    repo: "core/static-analysis",
    provider: "gitlab",
    status: "failed",
    findings: 0,
    time: "41 min ago",
  },
  {
    id: "RUN-8839",
    prTitle: "feat: severity scoring heuristics",
    repo: "core/findings",
    provider: "bitbucket",
    status: "completed",
    findings: 11,
    time: "1 hr ago",
  },
  {
    id: "RUN-8838",
    prTitle: "refactor: prompt template registry",
    repo: "core/prompts",
    provider: "gitlab",
    status: "pending",
    findings: 0,
    time: "2 hr ago",
  },
];

export const dashboardStats = {
  prsReviewed: 1284,
  runsToday: 37,
  openFindings: 116,
  avgReviewSeconds: 92,
};
