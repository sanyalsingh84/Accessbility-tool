import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanService } from "../services/scan.service";
import type { Scan } from "../types/scan.types";

export const useScanProgress = (scanId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: scanData,
    isLoading: isScanLoading,
    isError: isScanError,
    error: scanError,
  } = useQuery({
    queryKey: ["scans", scanId],
    queryFn: () => ScanService.getScanById(scanId!),
    enabled: !!scanId,
  });

  const scanStatus = scanData?.scan?.status;

  const { data: polledStatus } = useQuery({
    queryKey: ["scans", scanId, "status"],
    queryFn: () => ScanService.getScanStatus(scanId!),
    enabled: !!scanId && (scanStatus === "running" || scanStatus === "queued"),
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (
      polledStatus?.status === "completed" ||
      polledStatus?.status === "failed"
    ) {
      queryClient.invalidateQueries({ queryKey: ["scans", scanId] });
    }
  }, [polledStatus, scanId, queryClient]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const currentStatus = polledStatus?.status || scanStatus;

    if (currentStatus === "running") {
      setProgress((prev) => (prev === 0 ? 10 : prev));
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return 90;
          }
          return prev + 5;
        });
      }, 1000);
    } else if (currentStatus === "completed" || currentStatus === "failed") {
      setProgress(100);
    } else if (currentStatus === "queued") {
      setProgress(5);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [scanStatus, polledStatus?.status]);

  const scan = { ...scanData?.scan, ...polledStatus } as Scan;
  const violations = scanData?.violations ?? [];

  return {
    scan,
    violations,
    progress,
    isLoading: isScanLoading,
    isError: isScanError,
    error: scanError,
  };
};
