import { createContext,useContext,useState,useEffect } from "react";

import { loginApi,signupApi } from "../api/authApi";

const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);
    const[token,setToken]=useState(localStorage.getItem("token")||null);
    const[loading,setLoading]=useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, [token]
    );
    
    const login = async (credentials) => {
    const data = await loginApi(credentials);
    const authToken = data.token;
    const userData = data.user;

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    return data;
  };

  const signup = async (userData) => {
    const data = await signupApi(userData);
    return data;
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};