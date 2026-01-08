import { useMutation } from "@tanstack/react-query";
import { ScanService } from "../services/scan.service";
import { type NavigateFunction } from "react-router-dom";
import { type Scan } from "../types/scan.types";

export const useRetryScan = (navigate: NavigateFunction) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (scanId: string) => ScanService.retryScan(scanId),
    onSuccess: (data: Scan) => {
      // On success, navigate to the new scan's page
      navigate(`/scan/${data._id}`);
    },
    // onError, onSettled can be handled here for more complex scenarios
  });

  return {
    retryScan: mutate,
    isRetrying: isPending,
  };
};
