import { Navigate } from "react-router-dom";
import { useMe } from "../hooks/useAuth";
import Loader from "./Loader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  if (!user) return <Navigate to="/login" />;

  return children;
};
