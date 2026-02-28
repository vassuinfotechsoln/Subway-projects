import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Box,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden">
      {/* Left Decoration */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-950 p-16 relative overflow-hidden group">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-slate-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-500/5 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>

        <div className="mt-4 flex items-center gap-4 group/logo cursor-none">
          <div className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-premium group-hover/logo:rotate-12 transition-all duration-500">
            <Box size={32} strokeWidth={2.5} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase leading-none">
              AssetPro
            </h1>
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/60 pl-1">
              Enterprise
            </span>
          </div>
        </div>

        <div className="mt-auto max-w-xl mb-12 animate-fade-in-up">
          <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8 italic">
            The future of <br />
            <span className="text-white underline decoration-white/30 decoration-8 underline-offset-[12px]">
              Asset Auditing.
            </span>
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
            Streamline your inventory lifecycle with AI-driven diagnostics and
            real-time health metrics.
          </p>
          <div className="mt-14 flex flex-wrap gap-4">
            <div className="flex items-center gap-2.5 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md text-xs font-bold text-slate-300">
              <ShieldCheck size={18} className="text-white" strokeWidth={2.5} />
              Tier-4 Secure Cloud
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md text-xs font-bold text-slate-300">
              <ShieldCheck
                size={18}
                className="text-primary-500"
                strokeWidth={2.5}
              />
              ISO/IEC 27001
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md animate-fade-in-up bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent p-10 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 lg:border-none">
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
            Welcome back.
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium">
            Access your secure portal to manage enterprise assets.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-rose-500/5 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3.5 text-xs font-bold border border-rose-500/10 animate-shake">
              <AlertCircle size={20} className="shrink-0" strokeWidth={2.5} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Authorized Email
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Password Key
                </label>
                <a
                  href="#"
                  className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
                >
                  FORGOT KEY?
                </a>
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black rounded-2xl py-5 font-black text-base hover:opacity-90 hover:-translate-y-1 transition-all shadow-2xl shadow-black/20 dark:shadow-white/10 active:scale-95 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-3 overflow-hidden"
            >
              {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
              {!loading && <ArrowRight size={20} strokeWidth={2.5} />}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black dark:text-white font-bold hover:opacity-70 underline decoration-slate-300 underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
