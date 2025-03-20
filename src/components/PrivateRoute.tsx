import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/authStore"; // ✅ Correct import

const PrivateRoute = () => {
  const token = useAuthStore((state) => state.token);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
