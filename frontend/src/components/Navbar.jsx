import { Link } from "react-router-dom";
import { LogOut, Plus, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ setIsModalOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="w-full mx-auto pr-4 sm:px-4 h-16 flex justify-between items-center">
        {/* Logo Section  */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="ProcureEngine"
            className="h-32 w-auto object-contain opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Admin Dashboard Button */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-bold text-zinc-600 rounded-lg hover:bg-zinc-100 hover:text-black transition-all border border-transparent hover:border-zinc-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="h-6 w-px bg-zinc-200 mx-1 hidden md:block"></div>

          {/* Add Quote Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-lg shadow-md hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Quote</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
