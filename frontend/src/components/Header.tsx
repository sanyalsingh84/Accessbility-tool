import { Shield } from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  onLogout: () => void;
  isPending: boolean;
  rightSlot?: React.ReactNode;
};

const Header = ({ onLogout, isPending, rightSlot }: HeaderProps) => {
  return (
    <header className="drop-shadow-sm bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-blue-600 mr-1">AuditStream</span>
          <span className="text-gray-900">Accessibility Dashboard</span>
        </Link>
        <div className="flex gap-2">
          {rightSlot}
          <button
            onClick={onLogout}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
