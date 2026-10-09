import { useState } from "react";
import { markAttendance, updateAttendance, deleteAttendance } from "../api/attendanceApi";

export default function AttendanceButton({ subjectId, type, date, existingRecord, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async (status) => {
    setLoading(true);
    setError("");
    
    try {
      if (existingRecord) {
        if (status === "REMOVE") {
          await deleteAttendance(existingRecord._id);
          onUpdate();
        } else if (existingRecord.status !== status) {
          await updateAttendance(existingRecord._id, { 
            subjectId, 
            status, 
            type: existingRecord.type || "LECTURE" 
          });
          onUpdate();
        }
      } else if (status !== "REMOVE") {
        await markAttendance({ subjectId, date, status, type: type || "LECTURE" });
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
      <div className="h-full w-full min-h-[60px] flex items-center justify-center bg-[var(--card)] rounded animate-pulse">
        <span className="text-xs text-[var(--gray)]">Saving...</span>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 w-full h-full min-h-[60px] relative z-10">
        <div className="flex justify-between gap-1 h-8">
          <button onClick={() => handleSelect('PRESENT')} className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded text-xs font-bold transition-colors">P</button>
          <button onClick={() => handleSelect('ABSENT')} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-xs font-bold transition-colors">A</button>
          <button onClick={() => handleSelect('CANCELLED')} className="flex-1 bg-slate-600/50 text-[var(--black)] hover:bg-slate-500 hover:text-white rounded text-xs font-bold transition-colors" title="Cancelled/No Class">C</button>
        </div>
        <button onClick={() => setIsEditing(false)} className="text-[10px] text-[var(--gray)] hover:text-[var(--black)]">Cancel</button>
        {error && <span className="text-[10px] text-red-400 absolute -bottom-4">{error}</span>}
      </div>
    );
  }

  if (existingRecord) {
    const isPresent = existingRecord.status === 'PRESENT';
    const isAbsent = existingRecord.status === 'ABSENT';
    
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className={`w-full min-h-[60px] rounded flex flex-col items-center justify-center p-2 transition-colors border ${
          isPresent ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : 
          isAbsent ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' : 
          'bg-[var(--bg)] border-[var(--border)] text-[var(--black)] hover:bg-[var(--bg)]'
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
      className="w-full min-h-[60px] rounded border border-[var(--border)] border-dashed flex items-center justify-center bg-[var(--bg)] hover:bg-[var(--card)] hover:border-[var(--accent)] transition-all text-[var(--gray)] hover:text-[var(--black)] font-bold group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">+</span>
    </button>
  );
}