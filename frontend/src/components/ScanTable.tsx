import { useNavigate } from "react-router-dom";
import { useGetScans, useDeleteScan } from "../hooks/useScans";
import StatusBadge from "./StatusBadge";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./AlertDialog";
import Loader from "./Loader";

const ScanTable = () => {
  const { data: scans, isLoading, isError, error } = useGetScans();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { mutate: deleteScan, isPending: isDeleting } = useDeleteScan();

  const hanldeRedirectDetailPage = (id: string) => {
    navigate(`/scan/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteScan(id, {
      onSuccess: () => {
        setDeleteId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading scans: {error.message}
      </div>
    );
  }

  if (!scans || scans.length === 0) {
    return (
      <div className="text-center text-gray-500 bg-white rounded-xl shadow border p-12">
        <h3 className="text-lg font-medium text-gray-800">No scans yet</h3>
        <p className="mt-1">
          Enter a URL above and start your first scan to see the results here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Scans Table Section */}
      <div className="bg-white rounded-xl shadow-md mb-8 border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Your Scans</h2>
          <p className="text-sm text-slate-500 mt-1">
            View and manage your accessibility scan results
          </p>
        </div>
        <table className="w-full">
          <thead className="">
            <tr className="bg-slate-50 hover:bg-slate-50">
              <th className="font-semibold px-6 py-3 text-slate-700 text-left">
                Website
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-700">
                Date
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-700">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-700">
                Score
              </th>
              <th className="text-right px-6 py-3 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {scans.map((scan) => (
              <tr key={scan._id} className="border-t border-gray-300">
                <td className="px-6 py-4 text-sm text-gray-800 truncate max-w-xs">
                  {scan.url}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  <StatusBadge status={scan.status} />
                </td>

                <td className="px-6 py-4 text-sm font-medium">
                  {scan.score !== null ? (
                    <span
                      className={
                        scan.score > 90
                          ? "text-green-600"
                          : scan.score > 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {scan.score}
                    </span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>

                <td className="px-6 py-4 flex item-center justify-end gap-2">
                  <button
                    onClick={() => hanldeRedirectDetailPage(scan._id)}
                    className="flex items-center cursor-pointer px-4 py-1.5 text-gray-500 border rounded-lg text-sm hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  {/* <button
                    // onClick={() => handleExportPDF(scan)}
                    className="flex items-center cursor-pointer px-4 py-1.5 text-gray-500 border rounded-lg text-sm hover:bg-green-50 hover:text-green-600"
                    // disabled={scan.status !== "Completed"}
                  >
                    <FileDown className="h-4 w-4 mr-1" />
                    Export
                  </button> */}
                  <button
                    onClick={() => setDeleteId(scan._id)}
                    disabled={isDeleting}
                    className="flex items-center cursor-pointer px-4 py-1.5 text-gray-500 border rounded-lg text-sm hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              scan from your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScanTable;
