import { useState } from "react";
import { Link } from "react-router-dom";
import SubjectDropdown from "./SubjectDropdown";

export default function SubjectCard({ subject, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalConducted = subject.priorConducted || 0;
  const totalAttended = subject.priorAttended || 0;
  
  const currentPercentage = totalConducted > 0 
    ? ((totalAttended / totalConducted) * 100).toFixed(1) 
    : 100; 
    
  const isSafe = currentPercentage >= subject.criteria;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors shadow-md flex flex-col">
      <div className="p-5 flex-grow relative group">
        
        
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 bg-slate-800 pl-2 rounded">
          <button 
            onClick={() => onEdit(subject)}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
            title="Edit Subject"
          >
            ✎
          </button>
          <button 
            onClick={() => onDelete(subject._id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Delete Subject"
          >
            ✕
          </button>
        </div>

        <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className="text-xl font-bold text-white mb-4 pr-16 truncate">
            {subject.name}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Target:</span>
              <span className="text-slate-200 font-medium">{subject.criteria}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Current:</span>
              <span className={`font-bold ${isSafe ? 'text-green-400' : 'text-red-400'}`}>
                {currentPercentage}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Classes:</span>
              <span className="text-slate-300">{totalAttended} / {totalConducted}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-700 flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-2 rounded transition-colors text-sm font-medium"
          >
            {isExpanded ? "Hide Stats ▲" : "Insights ▼"}
          </button>
          <Link 
            to={`/tracker/${subject._id}`}
            className="flex-1 text-center bg-indigo-600/20 text-indigo-400 py-2 rounded hover:bg-indigo-600 hover:text-white transition-colors text-sm font-medium"
          >
            Tracker →
          </Link>
        </div>
      </div>

      {isExpanded && <SubjectDropdown subjectId={subject._id} criteria={subject.criteria} />}
    </div>
  );
}