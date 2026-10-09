import { useState } from "react";
import { Link } from "react-router-dom";
import SubjectDropdown from "./SubjectDropdown";

export default function SubjectCard({ subject, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalConducted = (subject.totalLecturesConducted || 0) + (subject.totalLabsConducted || 0);
  const totalAttended = (subject.lecturesPresent || 0) + (subject.labsPresent || 0);

  const currentPercentage = totalConducted > 0
    ? ((totalAttended / totalConducted) * 100).toFixed(1)
    : 100;

  const isSafe = currentPercentage >= subject.targetPercentage;
  const hasLectures = subject.weeklyLectures > 0;
  const hasLabs = subject.weeklyLabs > 0;

  return (
    <div className="glass-panel rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] hover:border-[var(--accent)] flex flex-col group/card relative overflow-hidden">
      {/* Decorative gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-indigo-400 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-6 flex-grow relative z-10">

        <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-2 glass-panel px-2 py-1 rounded-lg shadow-sm border border-[var(--border)]">
          <button onClick={() => onEdit(subject)} className="text-[var(--gray)] hover:text-[var(--accent)] p-1 transition-colors" title="Edit Subject">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
          </button>
          <button onClick={() => onDelete(subject._id)} className="text-[var(--gray)] hover:text-red-400 p-1 transition-colors" title="Delete Subject">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </button>
        </div>

        <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className="text-xl font-bold text-[var(--black)] mb-5 pr-16 truncate tracking-tight">
            {subject.name}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm items-center">
              <span className="text-[var(--gray)] font-medium">Target</span>
              <span className="bg-[var(--white)] px-2.5 py-1 rounded-md text-[var(--black)] font-semibold border border-[var(--border)]">{subject.targetPercentage}%</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-[var(--gray)] font-medium">Current</span>
              <span className={`font-bold px-2.5 py-1 rounded-md ${isSafe ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {currentPercentage}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-[var(--white)] rounded-full h-2 mt-2 mb-1 border border-[var(--border)] overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${isSafe ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`} 
                style={{ width: `${Math.min(currentPercentage, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs mt-1">
              <span className="text-[var(--gray)]">Total Classes</span>
              <span className="text-[var(--gray)] font-medium">{totalAttended} / {totalConducted}</span>
            </div>

            {(hasLectures || hasLabs) && (
              <div className="pt-3 mt-3 border-t border-[var(--border)] text-xs text-[var(--gray)] flex gap-3">
                {hasLectures && <span className="bg-[var(--white)] px-2 py-1 rounded border border-[var(--border)]">Lec: {subject.weeklyLectures}/wk</span>}
                {hasLabs && <span className="bg-[var(--white)] px-2 py-1 rounded border border-[var(--border)]">Lab: {subject.weeklyLabs}/wk</span>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-[var(--border)] flex gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 bg-[var(--white)] hover:bg-[var(--border)] text-[var(--black)] py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold border border-[var(--border)]"
          >
            {isExpanded ? "Hide Stats ▲" : "Insights ▼"}
          </button>
          <Link
            to={`/tracker`}
            className="flex-1 text-center bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white py-2.5 rounded-xl hover:from-[var(--accent-hover)] hover:to-indigo-700 transition-all duration-300 text-sm font-semibold shadow-md shadow-indigo-500/20"
          >
            Tracker →
          </Link>
        </div>
      </div>

      {isExpanded && <SubjectDropdown subject={subject} />}
    </div>
  );
}