import ScanTable from "../components/ScanTable";
import StartScanBar from "../components/StartScanBar";
import { useLogout } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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

      <Header onLogout={handleLogout} isPending={isPending} />

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
