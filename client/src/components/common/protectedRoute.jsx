import {Navigate,Outlet} from "react-router-dom";
import{useAuth} from "../../context/AuthContext";
import Navbar from "./Navbar";

export default function ProtectedRoute(){
    const {isAuthenticated,loading}=useAuth();

    if(loading){
        return(
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
                Loading...
            </div>         
        );
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    return(
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <Navbar/>
            <main className="flex-1 p-6">
                <Outlet/>
            </main>
        </div>
    )

}