import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Search,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Trash2,
  ShieldAlert,
  Clock,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Warning: Deleting a user is irreversible. Continue?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting user");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fade-in space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 italic">
            Teams{" "}
            <span className="text-black dark:text-white underline">Hub</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage your global workforce access and organizational hierarchies.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black border border-black/10 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm">
          <ShieldCheck size={16} strokeWidth={2.5} />
          Operational Security Active
        </div>
      </div>

      <div className="relative group max-w-2xl">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
        />
        <input
          type="text"
          placeholder="Filter team members by name or security clearance level..."
          className="premium-input pl-12 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Syncing team collective...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full py-32 text-center glass-card">
            <UsersIcon
              size={48}
              className="mx-auto text-slate-300 mb-4 opacity-50"
            />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              No matching credentials found.
            </p>
          </div>
        ) : (
          filteredUsers.map((member) => (
            <div
              key={member._id}
              className="glass-card glass-card-hover overflow-hidden group border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500 shadow-sm overflow-hidden">
                      {member.role === "Admin" ? (
                        <ShieldAlert size={32} strokeWidth={1.5} />
                      ) : (
                        <UserIcon size={32} strokeWidth={1.5} />
                      )}
                    </div>
                    {member.role === "Admin" && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <ShieldAlert
                          size={10}
                          className="text-white dark:text-black"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border ${
                      member.role === "Admin"
                        ? "bg-black dark:bg-white text-white dark:text-black border-black/10 dark:border-white/10"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {member.role === "Admin" ? (
                      <ShieldAlert size={12} strokeWidth={2.5} />
                    ) : (
                      <UsersIcon size={12} strokeWidth={2.5} />
                    )}
                    {member.role}
                  </span>
                </div>

                <div className="space-y-1.5 mb-8">
                  <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <Mail size={14} className="opacity-50" /> {member.email}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex-1 text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                    <Clock size={14} className="opacity-70" />
                    <span>
                      Onboarded{" "}
                      {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {member.role !== "Admin" && (
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="p-2.5 text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 active:scale-90"
                      title="Deactivate Member"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
              <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800/30">
                Performance Audit
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
