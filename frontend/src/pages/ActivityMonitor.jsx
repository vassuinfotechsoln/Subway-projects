import React, { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  Filter,
  Clock,
  User,
  Shield,
  ShieldCheck,
  Wrench,
  LogIn,
  Package,
  Trash2,
  UserPlus,
  Edit2,
  ChevronDown,
  Search,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ACTION_ICONS = {
  "User Login": LogIn,
  "User Registered": UserPlus,
  "Created Asset": Package,
  "Updated Asset": Edit2,
  "Deleted Asset": Trash2,
  "Assigned Asset": UserPlus,
  "Unassigned Asset": User,
  "Created Maintenance Request": Wrench,
  "Maintenance Status: Resolved": ShieldCheck,
  "Maintenance Status: Pending": Clock,
};

const ACTION_COLORS = {
  "User Login":
    "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "User Registered":
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "Created Asset":
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "Updated Asset":
    "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  "Deleted Asset":
    "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  "Assigned Asset":
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  "Unassigned Asset":
    "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  "Created Maintenance Request":
    "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  "Maintenance Status: Resolved":
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "Maintenance Status: Pending":
    "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

const ActivityPage = () => {
  const { isAdmin } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    entityType: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchActivities = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const params = new URLSearchParams();
        if (filters.userId) params.append("userId", filters.userId);
        if (filters.entityType) params.append("entityType", filters.entityType);
        params.append("limit", "100");

        const { data } = await api.get(`/activities?${params.toString()}`);
        setActivities(data.activities);
      } else {
        const { data } = await api.get("/activities/my");
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    if (isAdmin) {
      api.get("/users").then(({ data }) => setUsers(data));
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const filteredActivities = activities.filter((activity) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      activity.action?.toLowerCase().includes(term) ||
      activity.details?.toLowerCase().includes(term) ||
      activity.user?.name?.toLowerCase().includes(term)
    );
  });

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getActionIcon = (action) => {
    const Icon =
      Object.entries(ACTION_ICONS).find(([key]) =>
        action.startsWith(key),
      )?.[1] || ActivityIcon;
    return Icon;
  };

  const getActionColor = (action) => {
    return (
      Object.entries(ACTION_COLORS).find(([key]) =>
        action.startsWith(key),
      )?.[1] ||
      "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400"
    );
  };

  return (
    <div className="fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 italic">
            Activity{" "}
            <span className="text-black dark:text-white underline decoration-slate-300 dark:decoration-slate-700 underline-offset-[12px] decoration-8">
              Monitor
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            {isAdmin
              ? "Real-time surveillance of all system operations across every employee profile."
              : "Your personal activity log — every action recorded and timestamped."}
          </p>
        </div>
        <button
          onClick={fetchActivities}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-black/10 dark:shadow-white/5 shrink-0"
        >
          <RefreshCw size={16} strokeWidth={3} />
          Refresh
        </button>
      </div>

      {/* Filters (Admin Only) */}
      {isAdmin && (
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search actions, details, or names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>

            {/* User Filter */}
            <div className="relative">
              <select
                value={filters.userId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, userId: e.target.value }))
                }
                className="appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 pr-10 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all cursor-pointer"
              >
                <option value="">All Employees</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Entity Type Filter */}
            <div className="relative">
              <select
                value={filters.entityType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    entityType: e.target.value,
                  }))
                }
                className="appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 pr-10 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Asset">Assets</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Auth">Authentication</option>
                <option value="User">Users</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-20 text-center animate-pulse">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Loading activity logs...
            </p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
              <ActivityIcon size={32} strokeWidth={1} />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              No Activity Recorded
            </h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs mx-auto">
              System operations will appear here as they occur.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredActivities.map((activity, index) => {
              const Icon = getActionIcon(activity.action);
              const colorClass = getActionColor(activity.action);

              return (
                <div
                  key={activity._id || index}
                  className="flex items-center gap-5 px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm text-slate-900 dark:text-white truncate">
                        {activity.action}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md shrink-0">
                        {activity.entityType}
                      </span>
                    </div>
                    {activity.details && (
                      <span className="text-[10px] font-mono font-bold text-slate-400 truncate block max-w-[300px]">
                        {activity.details}
                      </span>
                    )}
                  </div>

                  {/* User Name — Prominent Column */}
                  {isAdmin && activity.user && (
                    <div className="flex items-center gap-3 shrink-0 px-4">
                      <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center text-xs font-black shadow-sm">
                        {activity.user.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {activity.user.name}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {activity.user.role}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {getRelativeTime(activity.createdAt)}
                    </span>
                    <span className="text-[9px] font-mono text-slate-300 dark:text-slate-600 mt-0.5">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
