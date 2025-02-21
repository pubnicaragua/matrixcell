"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

interface AuthContextType {
  user: any | null;
  userRole: number;
  userStore: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<number>(0);
  const [userStore, setUserStore] = useState<number | null>(null);

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setUser(user);
    }

    const perfil = localStorage.getItem("perfil");
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil);
      setUserRole(parsedPerfil.rol_id || 0);
      setUserStore(parsedPerfil.store_id || null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const user = authService.getUser();
    setUser(user);

    // Después de iniciar sesión, recuperar rol y tienda desde el backend o localStorage
    const perfil = localStorage.getItem("perfil");
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil);
      setUserRole(parsedPerfil.rol_id || 0);
      setUserStore(parsedPerfil.store_id || null);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserRole(0);
    setUserStore(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, userStore, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
