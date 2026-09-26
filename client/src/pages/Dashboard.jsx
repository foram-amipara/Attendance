import { useState, useEffect } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../api/subjsectApi";
import SubjectCard from "../components/SubjectCard"; 

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const defaultForm = {
    name: "", criteria: 75, weeklyLectures: 0, weeklyLabs: 0, priorConducted: 0, priorAttended: 0
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "name" ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    try {
      if (editingId) {
        const updatedSub = await updateSubject(editingId, formData);
        setSubjects(subjects.map(sub => sub._id === editingId ? updatedSub : sub));
      } else {
        const newSub = await createSubject(formData);
        setSubjects([...subjects, newSub]);
      }
      
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} subject`);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      criteria: subject.criteria,
      weeklyLectures: subject.weeklyLectures || 0,
      weeklyLabs: subject.weeklyLabs || 0,
      priorConducted: subject.priorConducted || 0,
      priorAttended: subject.priorAttended || 0
    });
    setEditingId(subject._id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject? All associated attendance records will be lost.")) return;
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(sub => sub._id !== id));
      if (editingId === id) closeForm();
    } catch (err) {
      setError("Failed to delete subject.");
    }
  };

  const closeForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setIsFormOpen(false);
    setError("");
  };

  if (loading) return <div className="text-slate-400">Loading your subjects...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Subjects</h2>
        <button 
          onClick={isFormOpen ? closeForm : () => setIsFormOpen(true)}
          className={`${isFormOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded text-sm font-medium transition-colors`}
        >
          {isFormOpen ? "Cancel" : "+ Add Subject"}
        </button>
      </div>
      
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">{error}</div>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg mb-8 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Subject' : 'New Subject'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Subject Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Data Structures" className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Target Criteria (%)</label>
              <input type="number" name="criteria" min="1" max="100" value={formData.criteria} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Weekly Lectures</label>
              <input type="number" name="weeklyLectures" min="0" value={formData.weeklyLectures} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Weekly Labs</label>
              <input type="number" name="weeklyLabs" min="0" value={formData.weeklyLabs} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Prior Classes Conducted</label>
              <input type="number" name="priorConducted" min="0" value={formData.priorConducted} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Prior Classes Attended</label>
              <input type="number" name="priorAttended" min="0" max={formData.priorConducted} value={formData.priorAttended} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded font-medium transition-colors">
            {editingId ? 'Save Changes' : 'Create Subject'}
          </button>
        </form>
      )}

      {subjects.length === 0 ? (
        <div className="text-center text-slate-500 py-16 bg-slate-800/50 rounded-lg border border-slate-700 border-dashed">
          No subjects found. Click "Add Subject" to set up your first class!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map(subject => (
            <SubjectCard key={subject._id} subject={subject} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}