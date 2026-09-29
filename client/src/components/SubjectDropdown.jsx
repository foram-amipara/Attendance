import { useState, useEffect } from "react";
import { getSubjectById } from "../api/subjsectApi";

export default function SubjectDropdown({ subject }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getSubjectById(subject._id);
        setDetails(data);
      } catch (err) {
        setError("Failed to load attendance insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [subject._id]);

  if (loading) return (
    <div className="p-6 bg-slate-900/50 rounded-b-lg border-t border-slate-700 flex justify-center">
      <div className="animate-pulse flex space-x-2 items-center">
        <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
        <div className="h-2 w-2 bg-indigo-500 rounded-full animation-delay-200"></div>
        <div className="h-2 w-2 bg-indigo-500 rounded-full animation-delay-400"></div>
      </div>
    </div>
  );

  if (error) return <div className="p-4 bg-slate-900/50 rounded-b-lg border-t border-slate-700 text-sm text-red-400 text-center">{error}</div>;

  const bunks = details?.bunksAvailable || 0;
  const needed = details?.classesNeeded || 0;
  const hasLectures = subject.weeklyLectures > 0;
  const hasLabs = subject.weeklyLabs > 0;

  return (
    <div className="p-5 bg-slate-900/50 rounded-b-lg border-t border-slate-700 space-y-4">
      {/* Smart Status Message */}
      <div className={`p-3 rounded border ${bunks > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : needed > 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'}`}>
        <p className="text-sm font-medium text-center">
          {bunks > 0 
            ? `Safe to bunk ${bunks} more ${bunks === 1 ? 'class' : 'classes'}`
            : needed > 0 
            ? `Attend the next ${needed} ${needed === 1 ? 'class' : 'classes'} to reach ${subject.criteria}%`
            : "You are exactly on track!"}
        </p>
      </div>

      {/* Dynamic Breakdown Grid (changes to 1 column if no labs/lectures) */}
      <div className={`grid ${hasLectures && hasLabs ? 'grid-cols-2' : 'grid-cols-1'} gap-4 text-sm`}>
        {hasLectures && (
          <div className="bg-slate-800 p-3 rounded border border-slate-700/50">
            <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Lectures</p>
            <p className="text-slate-200 font-medium">
              {details?.lectureAttended || 0} / {details?.lectureConducted || 0}
            </p>
          </div>
        )}
        {hasLabs && (
          <div className="bg-slate-800 p-3 rounded border border-slate-700/50">
            <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Labs</p>
            <p className="text-slate-200 font-medium">
              {details?.labAttended || 0} / {details?.labConducted || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}