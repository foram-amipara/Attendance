import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar(){
    const{user,logout}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate("/login");

    };

    return (
    <nav className="glass-panel border-b border-[var(--border)] px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
        <h1 className="text-4xl font-['DM_Serif_Display'] italic text-[var(--accent)] tracking-wide drop-shadow-md">
          ClassPulse
        </h1>
      </Link>
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-[var(--gray)] hover:text-[var(--accent)] text-sm font-semibold transition-colors uppercase tracking-wider">Dashboard</Link>
        <Link to="/tracker" className="text-[var(--gray)] hover:text-[var(--accent)] text-sm font-semibold transition-colors uppercase tracking-wider">Tracker</Link>
        <Link to="/setup-timetable" className="text-[var(--gray)] hover:text-[var(--accent)] text-sm font-semibold transition-colors uppercase tracking-wider">Timetable</Link>
        <div className="flex items-center gap-4 border-l border-[var(--border)] pl-6 ml-2">
          <span className="text-[var(--white)] text-sm hidden sm:block font-medium">
            Hi, <span className="text-[var(--accent)]">{user?.username || "Student"}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-[var(--white)] hover:bg-[var(--accent)] text-[var(--black)] hover:text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm border border-[var(--border)]"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}