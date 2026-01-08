import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScanService } from "../services/scan.service";

/**
 * Hook to fetch all scans.
 */
export const useGetScans = () => {
  return useQuery({
    queryKey: ["scans"],
    queryFn: ScanService.getScans,
  });
};

/**
 * Hook to create a new scan.
 */
export const useCreateScan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ScanService.createScan,
    onSuccess: () => {
      // When a scan is created, invalidate the 'scans' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });
};

/**
 * Hook to delete a scan.
 */
export const useDeleteScan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ScanService.deleteScan,
    onSuccess: () => {
      // When a scan is deleted, invalidate the 'scans' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });
};
