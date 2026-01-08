import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useLogout } from "../hooks/useAuth";
import { RotateCcw, XCircle } from "lucide-react";
import Violations from "../components/Violations";
import { useScanProgress } from "../hooks/useScanProgress";
import BackButton from "../components/BackButton";
import { useRetryScan } from "../hooks/useRetryScan";

const ScanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scan, violations, progress, isLoading, isError, error } =
    useScanProgress(id);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { retryScan, isRetrying } = useRetryScan(navigate);

  if (!id) {
    // This check now happens *after* all hooks are called.
    return <div>Invalid Scan ID</div>;
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const handleRetry = () => {
    retryScan(id);
  };

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Add a proper loading spinner/skeleton
  }

  if (isError) {
    return <div>Error: {error?.message}</div>; // Add optional chaining
  }

  const getStatusBadge = () => {
    switch (scan.status) {
      case "queued":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md uppercase tracking-wide">
            Queued
          </span>
        );
      case "running":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md uppercase tracking-wide">
            Running
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md uppercase tracking-wide">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-md uppercase tracking-wide">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}

      <Header
        onLogout={handleLogout}
        isPending={isLoggingOut}
        rightSlot={<BackButton />}
      />

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {/* Scan Summary Card */}
        <div className="drop-shadow-sm bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Website</div>
              <div className="text-gray-900 mb-3">{scan.url}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge()}
                </div>
                {scan.status === "completed" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Score:</span>
                    <span className="text-2xl text-gray-900">{scan.score}</span>
                    <span className="text-gray-500">/ 100</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div>
              <span>Started: </span>
              <span className="text-gray-900">
                {new Date(scan.createdAt).toLocaleString()}
              </span>
            </div>
            {scan.status === "completed" && (
              <div>
                <span>Completed: </span>
                <span className="text-gray-900">
                  {new Date(scan.completedAt!).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scan Progress (Running State) */}
        {(scan.status === "running" || scan.status === "queued") && (
          <div className="drop-shadow-sm bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="mb-4">
              <div className="text-gray-900 mb-2">Scanning website…</div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-2">{progress}%</div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                Loading page
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    progress > 30 ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
                Running accessibility rules
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    progress > 80 ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
                Saving report
              </li>
            </ul>
          </div>
        )}

        {/* Scan Failed State */}
        {scan.status === "failed" && (
          <div className="drop-shadow-sm bg-white rounded-lg border border-red-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-red-900">Scan Failed</h2>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-700 mb-2">Reason:</div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                "{scan.error}"
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-400"
              >
                <RotateCcw
                  className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                />
                {isRetrying ? "Retrying..." : "Retry Scan"}
              </button>
              <BackButton />
            </div>
          </div>
        )}

        {/* Violation Summary (Completed State) */}
        {scan.status === "completed" && <Violations violations={violations} />}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white text-sm text-gray-500 py-6 text-center">
        © 2026 AuditStream. All rights reserved.
      </footer>
    </div>
  );
};

export default ScanDetailPage;
