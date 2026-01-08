// Matches the Scan model from the backend
export type ScanStatus = "queued" | "running" | "completed" | "failed";

export interface Scan {
  _id: string;
  url: string;
  status: ScanStatus;
  score: number | null;
  createdAt: string; // Date comes as a string from JSON
  completedAt: string | null;
  error?: string | null;
}

export interface Rule {
  _id: string;
  ruleId: string;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
}

export type ViolationImpact = "minor" | "moderate" | "serious" | "critical";

export interface Violation {
  _id:string;
  scan: string;
  rule: Rule;
  impact: ViolationImpact;
  html: string;
}
