import { useState } from "react";
import { markAttendance, updateAttendance, deleteAttendance } from "../api/attendanceApi";

export default function AttendanceButton({ subjectId, date, existingRecord, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async (status) => {
    setLoading(true);
    setError("");
    
    try {
      if (existingRecord) {
        if (status === "remove") {
          await deleteAttendance(existingRecord._id);
          onUpdate();
        } else if (existingRecord.status !== status) {
          await updateAttendance(existingRecord._id, { status });
          onUpdate();
        }
      } else if (status !== "remove") {
        await markAttendance({ subjectId, date, status });
        onUpdate();
      }
      setIsEditing(false);
    } catch (err) {
      setError("Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full min-h-[60px] flex items-center justify-center bg-slate-800 rounded animate-pulse">
        <span className="text-xs text-slate-400">Saving...</span>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 w-full h-full min-h-[60px] relative z-10">
        <div className="flex justify-between gap-1 h-8">
          <button onClick={() => handleSelect('present')} className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded text-xs font-bold transition-colors">P</button>
          <button onClick={() => handleSelect('absent')} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-xs font-bold transition-colors">A</button>
          <button onClick={() => handleSelect('cancelled')} className="flex-1 bg-slate-600/50 text-slate-300 hover:bg-slate-500 hover:text-white rounded text-xs font-bold transition-colors" title="Cancelled/No Class">C</button>
        </div>
        <button onClick={() => setIsEditing(false)} className="text-[10px] text-slate-500 hover:text-slate-300">Cancel</button>
        {error && <span className="text-[10px] text-red-400 absolute -bottom-4">{error}</span>}
      </div>
    );
  }

  if (existingRecord) {
    const isPresent = existingRecord.status === 'present';
    const isAbsent = existingRecord.status === 'absent';
    
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className={`w-full min-h-[60px] rounded flex flex-col items-center justify-center p-2 transition-colors border ${
          isPresent ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : 
          isAbsent ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' : 
          'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
        }`}
      >
        <span className="font-bold text-sm uppercase">{existingRecord.status}</span>
        <span className="text-[10px] opacity-70 mt-1 hover:underline">Click to edit</span>
      </button>
    );
  }

  return (
    <button 
      onClick={() => setIsEditing(true)}
      className="w-full min-h-[60px] rounded border border-slate-700/50 border-dashed flex items-center justify-center bg-slate-900/20 hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all text-slate-600 hover:text-indigo-400 group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">+</span>
    </button>
  );
}