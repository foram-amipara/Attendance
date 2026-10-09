import { useState, useEffect } from "react";
import { getSubjectById } from "../api/subjectApi";

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
    <div className="p-6 bg-[var(--bg)] rounded-b-lg border-t border-[var(--border)] flex justify-center">
      <div className="animate-pulse flex space-x-2 items-center">
        <div className="h-2 w-2 bg-[var(--accent)] rounded-full"></div>
        <div className="h-2 w-2 bg-[var(--accent)] rounded-full animation-delay-200"></div>
        <div className="h-2 w-2 bg-[var(--accent)] rounded-full animation-delay-400"></div>
      </div>
    </div>
  );

  if (error) return <div className="p-4 bg-[var(--bg)] rounded-b-lg border-t border-[var(--border)] text-sm text-red-400 text-center">{error}</div>;

  const bunks = details?.stats?.overall?.canBunk || 0;
  const needed = details?.stats?.overall?.needToAttend || 0;
  const hasLectures = subject.weeklyLectures > 0;
  const hasLabs = subject.weeklyLabs > 0;

  return (
    <div className="p-5 bg-[var(--bg)] rounded-b-lg border-t border-[var(--border)] space-y-4">
      {/* Smart Status Message */}
      <div className={`p-3 rounded border ${bunks > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : needed > 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[var(--accent-blue)]/20 border-[var(--accent-blue)] text-[var(--black)] font-bold'}`}>
        <p className="text-sm font-medium text-center">
          {bunks > 0
            ? `Safe to bunk ${bunks} more ${bunks === 1 ? 'class' : 'classes'}`
            : needed > 0
              ? `Attend the next ${needed} ${needed === 1 ? 'class' : 'classes'} to reach ${subject.targetPercentage}%`
              : "You are exactly on track!"}
        </p>
      </div>


      <div className={`grid ${hasLectures && hasLabs ? 'grid-cols-2' : 'grid-cols-1'} gap-4 text-sm`}>
        {hasLectures && (
          <div className="bg-[var(--card)] p-3 rounded border border-[var(--border)]">
            <p className="text-[var(--gray)] mb-1 text-xs uppercase tracking-wider font-semibold">Lectures</p>
            <p className="text-[var(--black)] font-medium">
              {details?.subject?.lecturesPresent || 0} / {details?.subject?.totalLecturesConducted || 0}
            </p>
          </div>
        )}
        {hasLabs && (
          <div className="bg-[var(--card)] p-3 rounded border border-[var(--border)]">
            <p className="text-[var(--gray)] mb-1 text-xs uppercase tracking-wider font-semibold">Labs</p>
            <p className="text-[var(--black)] font-medium">
              {details?.subject?.labsPresent || 0} / {details?.subject?.totalLabsConducted || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}