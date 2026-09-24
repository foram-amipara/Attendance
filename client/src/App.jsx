import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/protectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Dashboard = () => <div className="p-8 text-center text-2xl">Welcome to your Dashboard!</div>;

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}