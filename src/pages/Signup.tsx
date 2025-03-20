import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { firstName, lastName, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
