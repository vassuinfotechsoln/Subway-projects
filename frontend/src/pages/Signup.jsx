import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Box,
  CircleCheck,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/register", formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden">
      {/* Left Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-slate-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-slate-500/5 rounded-full blur-[100px] animate-pulse-slow delay-1000 pointer-events-none"></div>

        <div className="w-full max-w-md animate-fade-in-up bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent p-10 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 lg:border-none relative z-10">
          <div className="mb-12 block lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black">
                <Box size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black tracking-widest text-slate-900 dark:text-white uppercase">
                ASSETPRO
              </span>
            </div>
          </div>

          <h3 className="text-4xl font-black mb-3 tracking-tighter">
            Join the Fleet.
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium">
            Register your credentials to access the enterprise ecosystem.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-rose-500/5 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3.5 text-xs font-bold border border-rose-500/10 animate-shake">
              <CircleCheck size={20} className="shrink-0" strokeWidth={2.5} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Full Legal Name
              </label>
              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-300"
                />
                <input
                  required
                  type="text"
                  placeholder="e.g. Alexander Pierce"
                  className="premium-input pl-11"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Work Email
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-300"
                />
                <input
                  required
                  type="email"
                  placeholder="name@organization.com"
                  className="premium-input pl-11"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Clearance Level
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "Employee" })}
                  className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2.5 ${
                    formData.role === "Employee"
                      ? "bg-black dark:bg-white text-white dark:text-black border-black/10 dark:border-white/10 shadow-lg shadow-black/20 dark:shadow-white/10"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-black/50 dark:hover:border-white/50"
                  }`}
                >
                  <User size={16} strokeWidth={2.5} /> Employee
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "Admin" })}
                  className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2.5 ${
                    formData.role === "Admin"
                      ? "bg-black dark:bg-white text-white dark:text-black border-black/10 dark:border-white/10 shadow-lg shadow-black/20 dark:shadow-white/10"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-black/50 dark:hover:border-white/50"
                  }`}
                >
                  <ShieldCheck size={16} strokeWidth={2.5} /> Administrator
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Secure Key
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-300"
                />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="premium-input pl-11"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black rounded-2xl py-5 font-black text-base hover:opacity-90 hover:-translate-y-1 transition-all shadow-2xl shadow-black/20 dark:shadow-white/10 active:scale-95 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-3 overflow-hidden mt-4"
            >
              {loading ? "INITIALIZING..." : "CREATE IDENTITY"}
              {!loading && <ArrowRight size={20} strokeWidth={2.5} />}
            </button>
          </form>

          <p className="mt-12 text-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
            Identity already exists?{" "}
            <Link
              to="/login"
              className="text-black dark:text-white hover:opacity-70 transition-colors underline decoration-slate-300 underline-offset-8"
            >
              Authorize here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Decorative Section (Flipped from Login) */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-950 p-16 relative overflow-hidden group">
        {/* Mesh gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-slate-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-500/5 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>

        <div className="mt-4 flex items-center justify-end gap-5 group/logo cursor-none">
          <div className="text-right">
            <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase leading-none">
              AssetPro
            </h1>
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/60 pr-1">
              Enterprise
            </span>
          </div>
          <div className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-premium group-hover/logo:-rotate-12 transition-all duration-500">
            <Box size={32} strokeWidth={2.5} className="text-white" />
          </div>
        </div>

        <div className="mt-auto max-w-xl mb-12 text-right animate-fade-in-up">
          <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8 italic">
            Empower your <br />
            <span className="text-white underline decoration-white/30 decoration-8 underline-offset-[12px]">
              Workspace.
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-6 text-left mt-16">
            <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 glass-card-hover transition-all duration-500 group-hover:bg-white/10">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10">
                <CircleCheck size={26} strokeWidth={2.5} />
              </div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3">
                Lifecycle Control
              </h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Complete visibility from hardware acquisition to secure
                decommissioning.
              </p>
            </div>
            <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 glass-card-hover transition-all duration-500 group-hover:bg-white/10">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10">
                <ShieldCheck size={26} strokeWidth={2.5} />
              </div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3">
                Enterprise IAM
              </h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Granular identity and access management for multi-tiered global
                organizations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
