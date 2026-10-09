import { useState, useEffect } from "react";
import { getSubjects, createSubject } from "../api/subjectApi";
import { getAttendance } from "../api/attendanceApi";
import { getTimetable, getOverrides, setOverride } from "../api/timetableApi";
import WeekNavigator from "../components/WeekNavigator";
import AttendanceButton from "../components/AttendanceButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export default function WeeklyTracker() {
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [overrides, setOverrides] = useState([]);
  const [recordsMap, setRecordsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State for Overrides
  const [overrideModal, setOverrideModal] = useState({ isOpen: false, dayIndex: null, dateStr: "", currentSlots: [] });
  
  const navigate = useNavigate();

  const getWeekDates = (baseDate) => {
    const d = new Date(baseDate);
    const day = d.getDay();
    const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diffToMon));

    return Array.from({ length: 5 }).map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const offset = date.getTimezoneOffset() * 60000; 
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().split('T')[0];
    });
  };

  const weekDates = getWeekDates(currentDate);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subs = await getSubjects();
      setSubjects(subs);
      
      const tTable = await getTimetable();
      if (!tTable.monday || (tTable.monday.length === 0 && tTable.tuesday.length === 0 && tTable.wednesday.length === 0 && tTable.thursday.length === 0 && tTable.friday.length === 0)) {
        // Redirect to setup timetable if not set up
        navigate("/setup-timetable");
        return;
      }
      setTimetable(tTable);

      const monday = weekDates[0];
      const friday = weekDates[4];
      
      const over = await getOverrides(monday, friday);
      setOverrides(over);

      // Fetch attendance for all subjects for the week
      const recordPromises = subs.map(sub => getAttendance(sub._id, monday, friday));
      const results = await Promise.all(recordPromises);
      
      const map = {};
      results.map(r => r.attendanceRecord).flat().forEach(record => {
        const dateKey = record.date.split('T')[0];
        // Store by subjectId_type_date to differentiate Lecture and Lab for the same subject on the same day
        map[`${record.subjectId}_${record.type}_${dateKey}`] = record;
      });
      
      setRecordsMap(map);
    } catch (err) {
      setError("Failed to load tracker data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const openOverrideModal = (dayIndex) => {
    const dayName = DAYS[dayIndex];
    const dateStr = weekDates[dayIndex];
    const override = overrides.find(o => o.date === dateStr);
    const slots = override ? override.slots : timetable[dayName];
    
    setOverrideModal({
      isOpen: true,
      dayIndex,
      dateStr,
      currentSlots: slots.map(slot => ({
        ...slot,
        subjectName: subjects.find(s => s._id === slot.subjectId)?.name || ""
      }))
    });
  };

  const saveOverride = async () => {
    try {
      const finalSlots = [...overrideModal.currentSlots];
      for (let i = 0; i < finalSlots.length; i++) {
        const slot = finalSlots[i];
        if (!slot.subjectId && slot.subjectName?.trim()) {
           const created = await createSubject({ name: slot.subjectName.trim(), targetPercentage: 75, weeklyLectures: 0, weeklyLabs: 0 });
           slot.subjectId = created.subject._id;
        }
      }

      await setOverride({
        date: overrideModal.dateStr,
        slots: finalSlots.filter(s => s.subjectId)
      });
      setOverrideModal({ isOpen: false, dayIndex: null, dateStr: "", currentSlots: [] });
      fetchData(); // Reload data to show new slots

    } catch (err) {
      alert("Failed to save override");
    }
  };

  const updateOverrideSlotName = (index, newName, type) => {
    const newSlots = [...overrideModal.currentSlots];
    const existing = subjects.find(s => s.name.toLowerCase() === newName.toLowerCase());
    newSlots[index] = { 
      ...newSlots[index], 
      subjectName: newName, 
      subjectId: existing ? existing._id : "", 
      type 
    };
    setOverrideModal({ ...overrideModal, currentSlots: newSlots });
  };

  if (loading && !timetable) {
    return <div className="p-8 text-center text-[var(--black)]">Loading Tracker...</div>;
  }

  if (!timetable) return null;

  // Determine max slots across all days for table columns
  let maxSlots = 0;
  DAYS.forEach((day, index) => {
    const dateStr = weekDates[index];
    const override = overrides.find(o => o.date === dateStr);
    const slots = override ? override.slots : timetable[day];
    if (slots.length > maxSlots) maxSlots = slots.length;
  });

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[var(--black)]">Weekly Tracker</h2>
        <WeekNavigator 
          currentDate={currentDate} 
          onPrev={handlePrevWeek} 
          onNext={handleNextWeek} 
        />
      </div>

      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">{error}</div>}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] mb-12"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                <th className="p-4 text-[var(--black)] font-semibold w-[20%]">Day</th>
                {Array.from({ length: maxSlots }).map((_, i) => (
                  <th key={i} className="p-4 text-[var(--black)] font-semibold text-center">
                    Lecture {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
              <motion.tbody 
                className={loading ? "opacity-50 pointer-events-none" : ""}
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {DAYS.map((dayName, dayIndex) => {
                  const dateStr = weekDates[dayIndex];
                  const override = overrides.find(o => o.date === dateStr);
                  const slots = override ? override.slots : timetable[dayName];
                  
                  return (
                    <motion.tr 
                      key={dayName} 
                      className="border-b border-[var(--border)] group/row transition-colors hover:bg-[var(--white)]"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                      }}
                    >
                      <td className="p-4 align-middle border-r border-[var(--border)] relative group">
                        <div className="font-bold text-[var(--black)] capitalize">{dayName}</div>
                        <div className="text-xs text-[var(--gray)] mt-1">{dateStr}</div>
                        <button 
                          onClick={() => openOverrideModal(dayIndex)}
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-[var(--black)] text-[var(--white)] text-[10px] px-2 py-1 rounded transition-opacity hover:bg-[var(--border)]"
                        >
                          Edit Day
                        </button>
                      </td>
                      
                      {Array.from({ length: maxSlots }).map((_, slotIndex) => {
                        const slot = slots[slotIndex];
                        if (!slot) {
                          return <td key={slotIndex} className="p-2 border-r border-[var(--border)]"></td>;
                        }

                        const actualSubjectId = (typeof slot.subjectId === "object" && slot.subjectId !== null) 
                            ? slot.subjectId._id 
                            : slot.subjectId;
                        const subject = (typeof slot.subjectId === "object" && slot.subjectId !== null)
                            ? slot.subjectId
                            : subjects.find(s => s._id === actualSubjectId);
                            
                        const recordKey = `${actualSubjectId}_${slot.type}_${dateStr}`;
                        const existingRecord = recordsMap[recordKey];

                        return (
                          <motion.td 
                            key={slotIndex} 
                            className="p-2 align-middle border-r border-[var(--border)] min-w-[120px]"
                            whileHover={{ scale: 1.05, backgroundColor: "var(--bg)", transition: { duration: 0.2 } }}
                          >
                            <div className="text-center mb-2">
                              <div className="text-xs font-bold text-[var(--black)] truncate tracking-tight" title={subject?.name}>
                                {subject ? subject.name : "Unknown"}
                              </div>
                              <div className="text-[10px] text-[var(--gray)] uppercase tracking-wider font-semibold mt-1">{slot.type}</div>
                            </div>
                            <AttendanceButton 
                              subjectId={actualSubjectId}
                              type={slot.type}
                              date={dateStr}
                              existingRecord={existingRecord}
                              onUpdate={fetchData} 
                            />
                          </motion.td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
      </motion.div>

      {/* Edit Day Modal */}
      {overrideModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] p-6 rounded-lg w-full max-w-lg border border-[var(--border)] shadow-xl">
            <h3 className="text-xl font-bold text-[var(--black)] mb-2">Edit Schedule for {overrideModal.dateStr}</h3>
            <p className="text-sm text-[var(--gray)] mb-6">Change subjects for today if there's a proxy or rearranged schedule.</p>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {overrideModal.currentSlots.map((slot, idx) => (
                <div key={idx} className="bg-[var(--bg)] p-3 rounded border border-[var(--border)] flex gap-2 items-center">
                  <div className="text-xs text-[var(--gray)] w-12">Slot {idx + 1}</div>
                  <input 
                    list="tracker-subject-list"
                    value={slot.subjectName || ""} 
                    onChange={(e) => updateOverrideSlotName(idx, e.target.value, slot.type)}
                    placeholder="Subject Name"
                    className="flex-1 bg-[var(--card)] text-[var(--black)] text-sm p-2 rounded border border-[var(--border)] focus:outline-none"
                  />
                  <datalist id="tracker-subject-list">
                    {subjects.map(s => (
                      <option key={s._id} value={s.name} />
                    ))}
                  </datalist>
                  <select
                    value={slot.type}
                    onChange={(e) => updateOverrideSlotName(idx, slot.subjectName || "", e.target.value)}
                    className="w-24 bg-[var(--card)] text-[var(--black)] text-xs p-2 rounded border border-[var(--border)] focus:outline-none"
                  >
                    <option value="LECTURE">Lecture</option>
                    <option value="LAB">Lab</option>
                  </select>
                </div>
              ))}
              
              {overrideModal.currentSlots.length === 0 && (
                <div className="text-[var(--gray)] text-center py-4">No slots configured for this day. Add slots in Setup Timetable first.</div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
              <button onClick={() => setOverrideModal({ isOpen: false, dayIndex: null, dateStr: "", currentSlots: [] })} className="px-4 py-2 text-[var(--black)] hover:text-[var(--black)]">Cancel</button>
              <button onClick={saveOverride} className="bg-[var(--black)] text-[var(--white)] px-6 py-2 rounded hover:bg-[var(--border)] font-medium transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}