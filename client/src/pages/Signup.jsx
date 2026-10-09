import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup({ username, email, password });
      navigate("/login"); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign up");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2F4F4F]">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-['DM_Serif_Display'] italic text-[#F5F5DC] tracking-wide drop-shadow-md">
          ClassPulse
        </h1>
      </div>
      <div className="p-8 bg-[#F5F5DC] rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--black)]">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-2 rounded bg-[var(--white)] text-[var(--black)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-[var(--white)] text-[var(--black)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-[var(--white)] text-[var(--black)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-[var(--black)] text-[var(--white)] font-bold p-2 rounded hover:bg-[var(--gray)] transition mt-2">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-[var(--gray)]">
          Already have an account? <Link to="/login" className="text-[var(--black)] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}