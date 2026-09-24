import { useState, useEffect } from "react";
import { getAllSubjects, createSubject, deleteSubject } from "../api/subjectApi";
import SubjectCard from "../components/dashboard/SubjectCard";

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form State
  const [newSubjectName, setNewSubjectName] = useState("");
  const [criteria, setCriteria] = useState(75);

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (err) {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    
    try {
      const newSub = await createSubject({ name: newSubjectName, criteria });
      setSubjects([...subjects, newSub]);
      setNewSubjectName(""); // Reset form
      setCriteria(75);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(sub => sub._id !== id));
    } catch (err) {
      setError("Failed to delete subject.");
    }
  };

  if (loading) return <div className="text-slate-400">Loading your subjects...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">My Subjects</h2>
      
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">{error}</div>}

      {/* Add New Subject Form */}
      <form onSubmit={handleAddSubject} className="bg-slate-800 p-4 rounded-lg flex flex-wrap gap-4 items-end mb-8 border border-slate-700">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-slate-400 mb-1">Subject Name</label>
          <input 
            type="text" 
            placeholder="e.g., Data Structures"
            className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            required
          />
        </div>
        <div className="w-32">
          <label className="block text-sm text-slate-400 mb-1">Criteria (%)</label>
          <input 
            type="number" 
            min="1" 
            max="100"
            className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={criteria}
            onChange={(e) => setCriteria(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded h-[40px] transition-colors">
          Add Subject
        </button>
      </form>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="text-center text-slate-500 py-10 bg-slate-800/50 rounded-lg border border-slate-700 border-dashed">
          No subjects found. Add your first class above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map(subject => (
            <SubjectCard key={subject._id} subject={subject} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}