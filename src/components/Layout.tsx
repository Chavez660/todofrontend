// src/components/Layout.tsx
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <nav className="mb-4">
        <Link to="/" className="mr-4 text-blue-500 hover:underline">
          Home
        </Link>
        <Link to="/login" className="mr-4 text-blue-500 hover:underline">
          Login
        </Link>
        <Link to="/signup" className="text-blue-500 hover:underline">
          Signup
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
