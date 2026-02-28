import React, { useState, useEffect } from "react";
import {
  Plus,
  Wrench,
  MessageSquare,
  User,
  Hash,
  CircleCheck,
  CircleX,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const StatusBadge = ({ status }) => {
  const isResolved = status === "Resolved";
  return (
    <span
      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${
        isResolved
          ? "bg-black dark:bg-white text-white dark:text-black border-black/10 dark:border-white/10"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
      }`}
    >
      {isResolved ? (
        <CircleCheck size={12} strokeWidth={3} />
      ) : (
        <Clock size={12} strokeWidth={3} />
      )}
      {status}
    </span>
  );
};

const Maintenance = () => {
  const { isAdmin, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetId: "",
    issueDescription: "",
  });

  const fetchRequests = async () => {
    try {
      const endpoint = isAdmin ? "/maintenance" : "/maintenance/my";
      const { data } = await api.get(endpoint);
      setRequests(data);

      if (!isAdmin) {
        const { data: assets } = await api.get("/assets/my");
        setMyAssets(assets);
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/maintenance", formData);
      fetchRequests();
      setIsModalOpen(false);
      setFormData({ assetId: "", issueDescription: "" });
    } catch (error) {
      alert("Error creating request");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/maintenance/${id}`, { status });
      fetchRequests();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 italic">
            Diagnostics{" "}
            <span className="text-black dark:text-white underline decoration-slate-300 dark:decoration-slate-700 underline-offset-[12px] decoration-8">
              Lab
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Track, triage, and resolve enterprise equipment anomalies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-20 rounded-[3rem] text-center flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mb-8 border border-slate-100 dark:border-slate-800 shadow-inner">
              <AlertTriangle size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">
              Clear Records
            </h3>
            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-[0.2em]">
              Everything seems to be working perfectly. No issues reported.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req._id}
              className="glass-card glass-card-hover p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
            >
              <div className="flex flex-col md:flex-row gap-8 flex-1">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-900 dark:text-white shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm transition-transform duration-500 group-hover:rotate-6">
                  <Wrench size={32} strokeWidth={2} />
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white capitalize">
                      {req.assetId?.assetName || "Legacy Hardware"}
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Hash
                        size={16}
                        className="text-slate-900 dark:text-white opacity-60"
                      />{" "}
                      {req.assetId?.serialNumber}
                    </span>
                    <span className="flex items-center gap-2">
                      <User
                        size={16}
                        className="text-slate-900 dark:text-white opacity-60"
                      />{" "}
                      {req.userId?.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className="text-slate-900 dark:text-white opacity-60"
                      />{" "}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-slate-50/80 dark:bg-slate-900/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-900/60 transition-colors">
                    <MessageSquare
                      size={20}
                      className="mt-1 shrink-0 text-slate-900 dark:text-white opacity-40"
                    />
                    <p className="text-slate-600 dark:text-slate-300 font-medium italic leading-relaxed">
                      "{req.issueDescription}"
                    </p>
                  </div>
                </div>
              </div>

              {isAdmin && req.status === "Pending" && (
                <button
                  onClick={() => handleStatusUpdate(req._id, "Resolved")}
                  className="premium-button-primary bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-black/20 dark:shadow-white/10 shrink-0"
                >
                  Execute Resolution
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-transparent fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">New Maintenance Request</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <CircleX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select Asset
                </label>
                <select
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-black dark:focus:border-white"
                  value={formData.assetId}
                  onChange={(e) =>
                    setFormData({ ...formData, assetId: e.target.value })
                  }
                >
                  <option value="">Choose an asset...</option>
                  {myAssets.map((asset) => (
                    <option key={asset._id} value={asset._id}>
                      {asset.assetName} ({asset.serialNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Issue Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-black dark:focus:border-white resize-none"
                  placeholder="Describe the problem in detail..."
                  value={formData.issueDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issueDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-black/20 dark:shadow-white/10 active:scale-95"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
