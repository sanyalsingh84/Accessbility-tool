import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Link to={"/dashboard"}>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition disabled:opacity-50">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
    </Link>
  );
};

export default BackButton;
