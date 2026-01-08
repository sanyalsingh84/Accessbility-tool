import api from "../lib/axios";
import type { Scan, Violation } from "../types/scan.types";

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

/**
 * Fetches a single scan by its ID, including its violations.
 * @param id The ID of the scan to fetch.
 */
const getScanById = async (
  id: string
): Promise<{ scan: Scan; violations: Violation[] }> => {
  const { data } = await api.get(`/scans/${id}`);
  return data;
};

/**
 * Fetches the status of a single scan by its ID.
 * @param id The ID of the scan to fetch the status for.
 */
const getScanStatus = async (id:string): Promise<Scan> => {
  const { data } = await api.get(`/scans/${id}/status`);
  return data;
};

/**
 * Deletes a scan by its ID.
 * @param id The ID of the scan to delete.
 */
const deleteScan = async (id: string): Promise<void> => {
  await api.delete(`/scans/${id}`);
};

/**
 * Retries a failed scan
 * @param id The ID of the scan to retry
 */
const retryScan = async (id: string): Promise<Scan> => {
  const { data } = await api.post(`/scans/${id}/retry`);
  return data;
};

export const ScanService = {
  getScans,
  createScan,
  getScanById,
  getScanStatus,
  deleteScan,
  retryScan,
};
