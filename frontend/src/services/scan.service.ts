import api from "../lib/axios";
import type { Scan } from "../types/scan.types";

/**
 * Fetches all scans for the current user.
 */
const getScans = async (): Promise<Scan[]> => {
  const { data } = await api.get("/scans");
  return data;
};

/**
 * Creates a new scan for the given URL.
 * @param url The URL to scan.
 */
const createScan = async (url: string): Promise<{ scanId: string }> => {
  const { data } = await api.post("/scans", { url });
  return data;
};

export const ScanService = {
  getScans,
  createScan,
};
