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


// Wrapper for protected routes (Authenticated users)
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

// Wrapper for Admin only routes
const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Redirige vers la liste des hôtels si l'utilisateur n'est pas admin
    return <Navigate to="/hotels" replace />;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

// Wrapper for public routes (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a spinner
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
 {/* Route création accessible à tous (changement de AdminRoute -> ProtectedRoute) */}
        <Route path="/hotels/create" element={<ProtectedRoute><CreateHotelPage /></ProtectedRoute>} />
        
        {/* Protected Routes (All users) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardContent /></ProtectedRoute>} />
        <Route path="/hotels" element={<ProtectedRoute><HotelsContent /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductsContent /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/hotels/create" element={<AdminRoute><CreateHotelPage /></AdminRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
