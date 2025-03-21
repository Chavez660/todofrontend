import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await API.post("/auth/signup", { firstName, lastName, email, password });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <p>Create an account to get started!</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="login-link">
            Login
          </span>
        </p>
      </div>

      <style>{`
        /* 🔵 General Container Styling */
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #007bff, #6610f2);
        }

        .signup-box {
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
        .signup-box h2 {
          margin-bottom: 10px;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .signup-box p {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        /* 🔵 Form Styling */
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .signup-form input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .signup-form input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0px 0px 8px rgba(0, 123, 255, 0.3);
        }

        /* 🔵 Button Styling */
        .signup-btn {
          background-color: #007bff;
          color: white;
          font-size: 16px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .signup-btn:hover {
          background-color: #0056b3;
        }

        .signup-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        /* 🔵 Login Redirect */
        .login-text {
          font-size: 14px;
          margin-top: 15px;
          color: #666;
        }

        .login-link {
          color: #007bff;
          font-weight: bold;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .login-link:hover {
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
