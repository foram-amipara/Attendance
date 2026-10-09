import {Navigate,Outlet} from "react-router-dom";
import{useAuth} from "../../context/AuthContext";
import Navbar from "./Navbar";

export default function ProtectedRoute(){
    const {isAuthenticated,loading}=useAuth();

    if(loading){
        return(
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gray)]">
                Loading...
            </div>         
        );
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    return(
        <div className="min-h-screen bg-[var(--bg)] flex flex-col">
            <Navbar/>
            <main className="flex-1 p-6">
                <Outlet/>
            </main>
        </div>
    )

}