import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardContent } from './pages/dashboard/DashboardContent';
import { ProductsContent } from './pages/dashboard/ProductsContent';
import { HotelsContent } from './pages/dashboard/HotelsContent';
import { CreateHotelPage } from './CreateHotelPage';


// Wrapper pour les routes strictement protégées (ex: Création)
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#363740] bg-gray-100">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    </div>
  );
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

// Wrapper public : Affiche le Layout Dashboard même si non connecté
const PublicDashboardRoute = ({ children }: { children?: React.ReactNode }) => {
    const { loading } = useAuth();
    if (loading) return null;

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
};

// Wrapper pour les pages Login/Register (redirige vers dashboard si déjà connecté)
const GuestRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; 
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Pages d'authentification */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

        {/* Pages accessibles publiquement (avec Layout Dashboard) */}
        <Route path="/dashboard" element={<PublicDashboardRoute><DashboardContent /></PublicDashboardRoute>} />
        <Route path="/hotels" element={<PublicDashboardRoute><HotelsContent /></PublicDashboardRoute>} />
        <Route path="/products" element={<PublicDashboardRoute><ProductsContent /></PublicDashboardRoute>} />
        
        {/* Pages strictement protégées (Nécessite connexion) */}
        <Route path="/hotels/create" element={<ProtectedRoute><CreateHotelPage /></ProtectedRoute>} />
        
        {/* Redirection par défaut vers le Dashboard au lieu du Login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
