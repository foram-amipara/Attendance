import { Link } from "react-router-dom";

export default function SubjectCard({ subject, onDelete }) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-indigo-500 transition-colors group relative flex flex-col">
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

      <h3 className="text-lg font-semibold text-white mb-2 pr-6 truncate">
        {subject.name}
      </h3>
      
      <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-700">
        <span className="text-sm text-slate-400">Criteria: {subject.criteria}%</span>
        <Link 
          to={`/tracker/${subject._id}`}
          className="text-indigo-400 text-sm hover:text-indigo-300 hover:underline font-medium"
        >
          Open Tracker →
        </Link>
      </div>
    </div>
  );
}