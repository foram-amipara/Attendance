import { useState, useEffect } from "react";
import { getSubjects } from "../api/subjsectApi";
import { getAttendance } from "../api/attendanceApi";
import WeekNavigator from "../components/WeekNavigator";
import AttendanceButton from "../components/AttendanceButton";

export default function WeeklyTracker() {
  const [subjects, setSubjects] = useState([]);
  const [recordsMap, setRecordsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

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

      const monday = weekDates[0];
      const friday = weekDates[4];

      const recordPromises = subs.map(sub => getAttendance(sub._id, monday, friday));
      const results = await Promise.all(recordPromises);
      
      const map = {};
      results.flat().forEach(record => {
        const dateKey = record.date.split('T')[0];
        map[`${record.subject}_${dateKey}`] = record;
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

  const dayHeaders = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Weekly Tracker</h2>
        <WeekNavigator 
          currentDate={currentDate} 
          onPrev={handlePrevWeek} 
          onNext={handleNextWeek} 
        />
      </div>

      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">{error}</div>}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700">
                <th className="p-4 text-slate-300 font-semibold w-1/6">Subject</th>
                {dayHeaders.map((day, index) => (
                  <th key={day} className="p-4 text-slate-300 font-semibold text-center w-1/6">
                    <div>{day}</div>
                    <div className="text-xs text-slate-500 font-normal mt-1">{weekDates[index]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={loading ? "opacity-50 pointer-events-none" : ""}>
              {subjects.map(subject => (
                <tr key={subject._id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 align-middle">
                    <div className="font-medium text-white truncate" title={subject.name}>
                      {subject.name}
                    </div>
                    {(subject.weeklyLectures > 0 || subject.weeklyLabs > 0) && (
                      <div className="text-xs text-slate-500 mt-2 inline-block">
                        Target: {subject.criteria}%
                      </div>
                    )}
                  </td>
                  
                  {weekDates.map(dateStr => {
                    const recordKey = `${subject._id}_${dateStr}`;
                    const existingRecord = recordsMap[recordKey];

                    return (
                      <td key={dateStr} className="p-2 align-middle border-l border-slate-700/30 text-center">
                        <AttendanceButton 
                          subjectId={subject._id}
                          date={dateStr}
                          existingRecord={existingRecord}
                          onUpdate={fetchData} 
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {!loading && subjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No subjects found. Please add your subjects in the Dashboard first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}