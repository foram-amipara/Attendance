import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/protectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import WeeklyTracker from "./pages/WeeklyTracker";
import SetupTimetable from "./pages/SetupTimetable";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--black)] font-sans">
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<WeeklyTracker />} />
          <Route path="/setup-timetable" element={<SetupTimetable />} />
        </Route>

       
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}