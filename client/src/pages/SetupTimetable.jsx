import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, createSubject } from "../api/subjectApi";
import { getTimetable, updateTimetable } from "../api/timetableApi";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export default function SetupTimetable() {
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subs = await getSubjects();
        setSubjects(subs);
        const currentTimetable = await getTimetable();
        if (currentTimetable.monday) {
          const mapped = {};
          DAYS.forEach(day => {
            mapped[day] = currentTimetable[day].map(slot => ({
              ...slot,
              subjectName: subs.find(s => s._id === slot.subjectId)?.name || ""
            }));
          });
          setTimetable(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch timetable data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addSlot = (day) => {
    setTimetable(prev => {
      const daySlots = [...prev[day]];
      daySlots.push({ subjectId: "", subjectName: "", type: "LECTURE", order: daySlots.length });
      return { ...prev, [day]: daySlots };
    });
  };

  const updateSlotName = (day, index, newName) => {
    setTimetable(prev => {
      const daySlots = [...prev[day]];
      const existing = subjects.find(s => s.name.toLowerCase() === newName.toLowerCase());
      daySlots[index] = { 
        ...daySlots[index], 
        subjectName: newName, 
        subjectId: existing ? existing._id : "" 
      };
      return { ...prev, [day]: daySlots };
    });
  };

  const updateSlot = (day, index, field, value) => {
    setTimetable(prev => {
      const daySlots = [...prev[day]];
      daySlots[index] = { ...daySlots[index], [field]: value };
      return { ...prev, [day]: daySlots };
    });
  };

  const removeSlot = (day, index) => {
    setTimetable(prev => {
      const daySlots = prev[day].filter((_, i) => i !== index);
      // Reassign order
      daySlots.forEach((slot, i) => slot.order = i);
      return { ...prev, [day]: daySlots };
    });
  };

  const handleSave = async () => {
    try {
      const payload = { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] };
      let newSubjectsList = [...subjects];
      
      for (const day of DAYS) {
        let orderCount = 0;
        for (let i = 0; i < timetable[day].length; i++) {
          const slot = { ...timetable[day][i] };
          if (!slot.subjectId && slot.subjectName && slot.subjectName.trim()) {
            const created = await createSubject({ name: slot.subjectName.trim(), targetPercentage: 75, weeklyLectures: 0, weeklyLabs: 0 });
            slot.subjectId = created.subject._id;
            newSubjectsList.push(created.subject);
          }
          if (slot.subjectId) {
             payload[day].push({
                 subjectId: slot.subjectId,
                 type: slot.type || "LECTURE",
                 order: orderCount++
             });
          }
        }
      }
      
      await updateTimetable(payload);
      navigate("/tracker");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save timetable");
    }
  };

  if (loading) return <div className="p-8 text-center text-[var(--black)]">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--black)]">Weekly Timetable Setup</h2>
        <button onClick={handleSave} className="bg-[var(--black)] text-[var(--white)] hover:bg-[var(--border)] px-6 py-2 rounded font-medium transition-colors">
          Save Timetable
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {DAYS.map(day => (
          <div key={day} className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--black)] mb-4 capitalize border-b border-[var(--border)] pb-2">{day}</h3>
            
            <div className="space-y-3">
              {timetable[day].map((slot, idx) => (
                <div key={idx} className="bg-[var(--bg)] p-3 rounded border border-[var(--border)] relative">
                  <button onClick={() => removeSlot(day, idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-500 text-sm">✕</button>
                  <div className="text-xs text-[var(--gray)] mb-1">Slot {idx + 1}</div>
                  
                  <input 
                    list="subject-list"
                    value={slot.subjectName} 
                    onChange={(e) => updateSlotName(day, idx, e.target.value)}
                    placeholder="Subject Name"
                    className="w-full bg-[var(--card)] text-[var(--black)] text-sm p-2 rounded mb-2 border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <datalist id="subject-list">
                    {subjects.map(s => (
                      <option key={s._id} value={s.name} />
                    ))}
                  </datalist>

                  <select
                    value={slot.type}
                    onChange={(e) => updateSlot(day, idx, "type", e.target.value)}
                    className="w-full bg-[var(--card)] text-[var(--black)] text-xs p-1.5 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="LECTURE">Lecture</option>
                    <option value="LAB">Lab</option>
                  </select>
                </div>
              ))}
            </div>

            <button 
              onClick={() => addSlot(day)} 
              className="mt-4 w-full border border-dashed border-[var(--border)] text-[var(--gray)] hover:text-[var(--black)] font-bold hover:border-[var(--accent)] py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>+</span> Add Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
