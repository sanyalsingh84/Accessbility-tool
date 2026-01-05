import { useGetScans } from "../hooks/useScans";
import StatusBadge from "./StatusBadge";

const ScanTable = () => {
  const { data: scans, isLoading, isError, error } = useGetScans();

  if (isLoading) {
    return (
      <div className="text-center text-gray-500">Loading your scans...</div>
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
      <h2 className="text-2xl font-semibold text-center mb-6">Your Scans</h2>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                Website
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                Score
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {scans.map((scan) => (
              <tr key={scan._id} className="border-t">
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

                <td className="px-6 py-4">
                  <button className="cursor-pointer px-4 py-1.5 text-gray-500 border rounded-lg text-sm hover:bg-gray-50">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScanTable;
