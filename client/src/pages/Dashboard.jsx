import { useState, useEffect } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../api/subjectApi";
import SubjectCard from "../components/SubjectCard"; 
import { motion } from "framer-motion";

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const defaultForm = {
    name: "", targetPercentage: 75, weeklyLectures: 0, weeklyLabs: 0, priorLecturesConducted: 0, priorLecturesPresent: 0, priorLabsConducted: 0, priorLabsPresent: 0
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
        setSubjects([...subjects, newSub.subject]);
      }
      
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} subject`);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      targetPercentage: subject.targetPercentage,
      weeklyLectures: subject.weeklyLectures || 0,
      weeklyLabs: subject.weeklyLabs || 0,
      priorLecturesConducted: subject.priorLecturesConducted || 0,
      priorLecturesPresent: subject.priorLecturesPresent || 0,
      priorLabsConducted: subject.priorLabsConducted || 0,
      priorLabsPresent: subject.priorLabsPresent || 0
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-[var(--card)] rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-[var(--card)] rounded-lg h-[240px] border border-[var(--border)]"></div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-4"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-[var(--black)] tracking-tight">My Subjects</h2>
          <p className="text-[var(--gray)] mt-1">Manage your classes and track your attendance</p>
        </div>
        <button 
          onClick={isFormOpen ? closeForm : () => setIsFormOpen(true)}
          className={`${isFormOpen ? 'bg-[var(--card)] text-[var(--black)] border border-[var(--border)] hover:bg-[var(--white)]' : 'bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-[var(--accent-hover)] hover:to-indigo-700'} px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5`}
        >
          {isFormOpen ? "Cancel" : "+ Add Subject"}
        </button>
      </motion.div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8"
        >
          {error}
        </motion.div>
      )}

      {isFormOpen && (
        <motion.form 
          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
          animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onSubmit={handleSubmit} 
          className="glass-panel p-8 rounded-2xl mb-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-[var(--border)]"
        >
          <h3 className="text-2xl font-bold text-[var(--black)] mb-6 tracking-tight">{editingId ? 'Edit Subject' : 'New Subject'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Subject Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Data Structures" className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Target Criteria (%)</label>
              <input type="number" name="targetPercentage" min="1" max="100" value={formData.targetPercentage} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Weekly Lectures</label>
              <input type="number" name="weeklyLectures" min="0" value={formData.weeklyLectures} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Weekly Labs</label>
              <input type="number" name="weeklyLabs" min="0" value={formData.weeklyLabs} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Prior Lectures Conducted</label>
              <input type="number" name="priorLecturesConducted" min="0" value={formData.priorLecturesConducted} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Prior Lectures Attended</label>
              <input type="number" name="priorLecturesPresent" min="0" max={formData.priorLecturesConducted} value={formData.priorLecturesPresent} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Prior Labs Conducted</label>
              <input type="number" name="priorLabsConducted" min="0" value={formData.priorLabsConducted} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray)] mb-2 ml-1">Prior Labs Attended</label>
              <input type="number" name="priorLabsPresent" min="0" max={formData.priorLabsConducted} value={formData.priorLabsPresent} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-[var(--white)] text-[var(--black)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white hover:from-[var(--accent-hover)] hover:to-indigo-700 px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5">
              {editingId ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </motion.form>
      )}

      {subjects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-20 glass-panel rounded-2xl border border-[var(--border)] border-dashed"
        >
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-[var(--black)] mb-2">No subjects yet</h3>
          <p className="text-[var(--gray)]">Click "Add Subject" to set up your first class and start tracking!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {subjects.map((subject, idx) => (
            <motion.div
              key={subject._id}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: -15 },
                visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 80, damping: 12, mass: 1 } }
              }}
              style={{ perspective: 1000 }}
              whileHover={{ y: -10, scale: 1.03, rotateY: 2, rotateX: 2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            >
              <SubjectCard subject={subject} onDelete={handleDelete} onEdit={handleEdit} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}