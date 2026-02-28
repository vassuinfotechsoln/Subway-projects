import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Wrench,
  Users,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  User,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
        isActive
          ? "bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/20 dark:shadow-white/10 scale-[1.02]"
          : "text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
      )
    }
  >
    <Icon
      size={20}
      className={cn("transition-transform group-hover:scale-110 duration-300")}
    />
    <span className="font-semibold tracking-tight">{children}</span>
  </NavLink>
);

const DashboardLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/assets", icon: Box, label: "Assets" },
    { to: "/maintenance", icon: Wrench, label: "Maintenance" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/activity", icon: Activity, label: "Activity Monitor" },
  ];

  const employeeLinks = [
    { to: "/", icon: LayoutDashboard, label: "My Assets" },
    { to: "/maintenance", icon: Wrench, label: "My Requests" },
    { to: "/activity", icon: Activity, label: "My Activity" },
  ];

  const sidebarLinks = isAdmin ? adminLinks : employeeLinks;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[60] transition-opacity duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 z-[70] transform transition-all duration-500 lg:translate-x-0 shadow-2xl lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3.5 px-2 mb-10 group cursor-default">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-[1.25rem] flex items-center justify-center text-white dark:text-black shadow-premium-glow shadow-black/20 dark:shadow-white/10 group-hover:rotate-12 transition-transform duration-500">
              <Box size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                AssetsPro
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 opacity-80 pl-0.5">
                Enterprise
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            <p className="px-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-4 opacity-70">
              Main Navigation
            </p>
            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.label}
              </SidebarLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="glass-card p-4 mb-4 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-black dark:text-white mb-1 italic">
                PRO PLAN
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Unlock advanced analytics and bulk actions.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-400 dark:hover:bg-rose-950/30 rounded-2xl transition-all group font-bold"
            >
              <LogOut
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative background element */}

        {/* Navbar */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/20 dark:bg-slate-950/20 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-800/30 shrink-0 z-40">
          <button
            className="lg:hidden p-2.5 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex flex-col">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
              Good afternoon, {user?.name.split(" ")[0]}!
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Ready to audit some assets today?
            </p>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-slate-500 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all duration-500 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-90"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Activity Monitor Link */}
            <button
              onClick={() => navigate("/activity")}
              className="relative p-2.5 text-slate-500 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="absolute top-2 right-2 w-2 h-2 bg-black dark:bg-white rounded-full border-2 border-white dark:border-slate-900" />
              <Activity size={20} />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm border border-slate-200/50 dark:border-slate-800/50 group"
              >
                <div className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-black/20 dark:shadow-white/10 group-hover:scale-105 transition-transform">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start px-0.5">
                  <span className="font-bold text-xs tracking-tight leading-none mb-0.5">
                    {user?.name}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {isAdmin ? "Administrator" : "Employee"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-slate-400 transition-all duration-300 ml-1",
                    isProfileOpen && "rotate-180 text-black dark:text-white",
                  )}
                />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">
                        Current Account
                      </p>
                      <p className="font-bold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group">
                        <User
                          size={18}
                          className="text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors"
                        />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all group"
                      >
                        <LogOut
                          size={18}
                          className="group-hover:-translate-x-1 duration-300"
                        />
                        Logout Session
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 custom-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
