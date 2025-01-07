import React, { createContext, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('https://matrixcell.onrender.com/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
