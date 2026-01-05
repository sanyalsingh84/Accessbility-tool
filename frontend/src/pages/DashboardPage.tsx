import ScanTable from "../components/ScanTable";
import StartScanBar from "../components/StartScanBar";
import { useLogout } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="drop-shadow-sm bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
              A
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              AuditStream{" "}
              <span className="font-normal">Accessibility Dashboard</span>
            </h1>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition disabled:opacity-50"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <StartScanBar />
        <ScanTable />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white text-sm text-gray-500 py-6 text-center">
        © 2026 AuditStream. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardPage;
