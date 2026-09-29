export default function WeekNavigator({ currentDate, onPrev, onNext }) {
  const getMonFri = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(d.setDate(diffToMon));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const options = { month: 'short', day: 'numeric' };
    return `${monday.toLocaleDateString(undefined, options)} - ${friday.toLocaleDateString(undefined, options)}, ${friday.getFullYear()}`;
  };

  return (
    <div className="flex items-center gap-4 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
      <button 
        onClick={onPrev} 
        className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
        title="Previous Week"
      >
        ◀
      </button>
      <span className="text-white font-medium min-w-[160px] text-center text-sm">
        {getMonFri(currentDate)}
      </span>
      <button 
        onClick={onNext} 
        className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
        title="Next Week"
      >
        ▶
      </button>
    </div>
  );
}