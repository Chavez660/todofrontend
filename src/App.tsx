import { Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./stores/authStore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import TodoDetails from "./pages/TodoDetails";

export default function App() {
  const { token, logout } = useAuthStore();

  return (
    <>
      <nav>
        {!token ? (
          <>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/todo/:id" element={token ? <TodoDetails /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}
