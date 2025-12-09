
import React, { useState, useEffect, createContext, useContext } from 'react';
import { api, User } from '../services/api';

// --- Router Implementation (Copy for Root compatibility) ---
const RouterContext = createContext<{ route: string; navigate: (to: string) => void } | null>(null);

export const HashRouter = ({ children }: { children: React.ReactNode }) => {
  const [route, setRoute] = useState(window.location.hash.substring(1) || '/');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.substring(1) || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const BrowserRouter = HashRouter;

export const useLocation = () => {
  const ctx = useContext(RouterContext);
  const route = ctx ? ctx.route : '/';
  const [pathname, search] = route.split('?');
  return { pathname, search: search ? `?${search}` : '', hash: '' };
};

export const useNavigate = () => {
  const ctx = useContext(RouterContext);
  return ctx ? ctx.navigate : (to: string) => { window.location.hash = to; };
};

export const Link: React.FC<{ to: string; children?: React.ReactNode; className?: string }> = ({ to, children, className }) => {
  return <a href={`#${to}`} className={className}>{children}</a>;
};

export const Routes = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  let element = null;
  React.Children.forEach(children, (child) => {
    if (element) return;
    if (React.isValidElement(child)) {
        const { path } = child.props as any;
        if (path === '*' || path === pathname) {
            element = child;
        }
    }
  });
  return element;
};

export const Route = ({ element }: { path: string; element: React.ReactNode; children?: React.ReactNode }) => element;

export const Navigate = ({ to }: { to: string; replace?: boolean }) => {
  const navigate = useNavigate();
  useEffect(() => {
      navigate(to);
  }, [to, navigate]);
  return null;
};

export const useSearchParams = () => {
   const { search, pathname } = useLocation();
   const params = new URLSearchParams(search);
   const navigate = useNavigate();

   const setSearchParams = (newParams: Record<string, string>) => {
       const p = new URLSearchParams(newParams);
       navigate(`${pathname}?${p.toString()}`);
   };
   return [params, setSearchParams] as const;
};
// --- End Router ---

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
