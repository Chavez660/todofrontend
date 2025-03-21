import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", { email, password });
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p>Welcome back! Please login to continue.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="signup-link">
            Sign up
          </span>
        </p>
      </div>

      <style>{`
        /* 🔵 General Container Styling */
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #007bff, #6610f2);
        }

        .login-box {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          animation: fadeIn 0.5s ease-in-out;
        }

        /* 🔵 Title */
        .login-box h2 {
          margin-bottom: 10px;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .login-box p {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        /* 🔵 Form Styling */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .login-form input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0px 0px 8px rgba(0, 123, 255, 0.3);
        }

        /* 🔵 Button Styling */
        .login-btn {
          background-color: #007bff;
          color: white;
          font-size: 16px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .login-btn:hover {
          background-color: #0056b3;
        }

        .login-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        /* 🔵 Signup Redirect */
        .signup-text {
          font-size: 14px;
          margin-top: 15px;
          color: #666;
        }

        .signup-link {
          color: #007bff;
          font-weight: bold;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .signup-link:hover {
          color: #0056b3;
        }

        /* 🔵 Error Message */
        .error-message {
          color: red;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        /* 🔵 Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
