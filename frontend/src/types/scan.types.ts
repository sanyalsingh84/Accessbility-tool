// Matches the Scan model from the backend
export type ScanStatus = "queued" | "running" | "completed" | "failed";

export interface Scan {
  _id: string;
  url: string;
  status: ScanStatus;
  score: number | null;
  createdAt: string; // Date comes as a string from JSON
  completedAt: string | null;
}
