import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");

    const {login}=useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(event)=>{
        event.preventDefault();
        setError("");
        try {
          await login({ email, password });
          navigate("/dashboard");
        } catch (err) {
          setError(err.response?.data?.message || "Failed to log in");
        }
    }
return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-6xl font-['DM_Serif_Display'] italic text-[var(--accent)] tracking-wide drop-shadow-lg">
          ClassPulse
        </h1>
        <p className="text-[var(--gray)] mt-3 text-lg font-light tracking-wider">Elevate your academic journey</p>
      </div>
      <div className="p-8 sm:p-10 glass-panel rounded-2xl w-full max-w-md transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
        <h2 className="text-3xl font-bold mb-8 text-center text-[var(--black)] tracking-tight">Welcome Back</h2>
        {error && <p className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--gray)] mb-1.5 ml-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray)] mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-[var(--accent-hover)] hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 mt-4 transform hover:-translate-y-0.5">
            Log In
          </button>
        </form>
        <p className="mt-8 text-sm text-center text-[var(--gray)]">
          Don't have an account? <Link to="/signup" className="text-[var(--accent)] font-semibold hover:text-[var(--accent-hover)] transition-colors">Sign up for free</Link>
        </p>
      </div>
    </div>
  );

};

