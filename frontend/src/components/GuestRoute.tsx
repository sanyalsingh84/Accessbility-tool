import { Navigate } from "react-router-dom";
import { useMe } from "../hooks/useAuth";

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;

  return children;
};
