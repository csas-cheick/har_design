import { FC, ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-20 flex-none">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif font-bold text-xl">
                  H
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-lg font-serif font-bold tracking-widest leading-none text-black">HAR</span>
                    <span className="text-[10px] font-medium tracking-[0.3em] text-gray-500 leading-none mt-1">DESIGN</span>
                  </div>
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
                <p className="hidden md:block text-sm text-gray-500 font-medium">Dashboard Administrateur</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin/profile" className="text-right hidden md:block hover:opacity-80 transition-opacity">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Déconnexion"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Wrapper */}
        <div className={`
          absolute inset-y-0 left-0 z-40 h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
