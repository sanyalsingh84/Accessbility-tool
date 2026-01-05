import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";

export default function AppRoutes() {
  //   const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <BrowserRouter>
      {/* {isLoading && <Loader />} */}
      <Routes>
        <Route
          path="/login"
          element={
            // <GuestRoute>
            <Login />
            // </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            // <GuestRoute>
            <Register />
            // </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
