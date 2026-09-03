import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar(){
    const{user,logout}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate("/login");

    };

    return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-400 tracking-wide">
        Attendance Tracker
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-slate-300 text-sm hidden sm:block">
          Hi, {user?.username || "Student"}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm bg-slate-700 hover:bg-red-600/80 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}