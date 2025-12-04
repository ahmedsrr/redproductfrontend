
import React, { useState, useEffect, createContext, useContext } from 'react';
import { api, User } from '../services/api';


const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
            try {
                // Authentification JWT: On vérifie que le token est toujours valide côté serveur
                const userData = await api.getMe();
                setUser(userData);
            } catch (error) {
                console.error("Token JWT invalide ou expiré:", error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                setUser(null);
            }
        }
        setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (e) {
      throw e;
    }
  };

  const register = async (name: string, email: string, password: string) => {
      try {
        const data = await api.register(name, email, password);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
      } catch (e) {
        throw e;
      }
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
