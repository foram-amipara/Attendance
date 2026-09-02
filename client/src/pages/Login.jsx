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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 bg-slate-800 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-indigo-600 p-2 rounded hover:bg-indigo-700 transition">
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-400">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );

};

