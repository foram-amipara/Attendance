import { Link } from "react-router-dom";

export default function SubjectCard({ subject, onDelete }) {
  const totalConducted = subject.priorConducted || 0;
  const totalAttended = subject.priorAttended || 0;
  
  const currentPercentage = totalConducted > 0 
    ? ((totalAttended / totalConducted) * 100).toFixed(1) 
    : 100; 
    
  const isSafe = currentPercentage >= subject.criteria;

  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-indigo-500 transition-colors group relative flex flex-col h-full shadow-md">
      <button 
        onClick={(e) => {
          e.preventDefault();
          onDelete(subject._id);
        }}
        className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete Subject"
      >
        ✕
      </button>

      <h3 className="text-xl font-bold text-white mb-4 pr-6 truncate">
        {subject.name}
      </h3>
      
      <div className="space-y-2 mb-6 flex-grow">
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
          <span className="text-slate-400">Classes:</span>
          <span className="text-slate-300">{totalAttended} / {totalConducted}</span>
        </div>
        {(subject.weeklyLectures > 0 || subject.weeklyLabs > 0) && (
          <div className="pt-2 mt-2 border-t border-slate-700 text-xs text-slate-500 flex justify-between">
            <span>Lectures: {subject.weeklyLectures}/wk</span>
            <span>Labs: {subject.weeklyLabs}/wk</span>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-700">
        <Link 
          to={`/tracker/${subject._id}`}
          className="block w-full text-center bg-indigo-600/20 text-indigo-400 py-2 rounded hover:bg-indigo-600 hover:text-white transition-colors text-sm font-medium"
        >
          Open Tracker →
        </Link>
      </div>
    </div>
  );
}