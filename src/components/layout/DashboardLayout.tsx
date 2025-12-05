import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../icons/Icons';

// Définition explicite de l'interface des props
interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
    { id: 'hotels', label: 'Liste des hôtels', path: '/hotels', icon: Icons.Computer },
  ];

  // Helper to check if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-[#363740] text-white flex-shrink-0">
        <div className="flex items-center h-20 px-6 bg-[#363740]">
           <div className="flex items-center gap-3">
             <div className="bg-white p-1 rounded-full">
                 <Icons.Logo className="w-4 h-4 text-[#363740]"/>
             </div>
             <span className="text-lg font-bold tracking-tight text-white opacity-90">RED PRODUCT</span>
           </div>
        </div>
        
        <div className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider">Principal</div>

        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-0">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center w-full px-6 py-4 text-sm font-medium border-l-4 transition-colors ${
                    active
                      ? 'bg-[#3e4049] border-white text-white'
                      : 'border-transparent text-gray-400 hover:bg-[#3e4049] hover:text-white'
                  }`}
                >
                  <span className={`mr-4 ${active ? 'text-white' : 'text-gray-400'}`}><item.icon /></span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t border-gray-700">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-gray-600">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">{user?.name}</span>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wide border border-gray-600 rounded px-1.5 py-0.5">
                      {user?.role || 'Guest'}
                   </span>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm h-20">
          <div className="flex items-center gap-4">
             <div className="md:hidden">
               {/* Mobile Menu Button - simplified */}
               <Icons.Dashboard /> 
             </div>
             <h2 className="text-2xl font-bold text-gray-800 capitalize">
               {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
             </h2>
          </div>

          <div className="flex items-center gap-6">
             {/* Search Bar */}
             <div className="relative hidden md:block">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Icons.Search />
               </div>
               <input 
                 type="text" 
                 placeholder="Recherche" 
                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-gray-300"
               />
             </div>

             {/* Notifications */}
             <div className="relative">
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white">3</span>
                <Icons.Bell />
             </div>

             {/* Profile & Logout */}
             <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
               <div className="relative">
                 <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                    alt="User" 
                    className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                 />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
               </div>
               <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Déconnexion">
                  <Icons.LogOut />
               </button>
             </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
