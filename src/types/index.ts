export type Role = "admin" | "approver" | "viewer";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type Provider = "bitbucket" | "gitlab";
export type RunStatus = "pending" | "running" | "completed" | "failed";
export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface ReviewRun {
  id: string;
  prTitle: string;
  repo: string;
  provider: Provider;
  status: RunStatus;
  findings: number;
  time: string;
}

export interface SeveritySlice {
  severity: Severity;
  count: number;
}

export interface ReviewTrendPoint {
  date: string;
  reviews: number;
  findings: number;
}
