import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  CircleCheck,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Wrench,
  X,
  Calendar,
  Info,
  Hash,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <div className="glass-card glass-card-hover p-7 flex flex-col gap-5 group">
    <div className="flex items-center justify-between">
      <div
        className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-sm`}
      >
        <Icon
          size={28}
          className={color.replace("bg-", "text-")}
          strokeWidth={2.5}
        />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${trend === "up" ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-500 bg-rose-50 dark:bg-rose-500/10"}`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={14} strokeWidth={3} />
          ) : (
            <ArrowDownRight size={14} strokeWidth={3} />
          )}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5">
        {title}
      </p>
      <h3 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
        {value}
      </h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myAssets, setMyAssets] = useState([]);
  const [diagnosticModal, setDiagnosticModal] = useState({
    open: false,
    asset: null,
  });
  const [diagnosticDesc, setDiagnosticDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assetDetail, setAssetDetail] = useState(null);

  const handleRaiseDiagnostic = (asset) => {
    setDiagnosticModal({ open: true, asset });
    setDiagnosticDesc("");
  };

  const handleSubmitDiagnostic = async (e) => {
    e.preventDefault();
    if (!diagnosticDesc.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/maintenance", {
        assetId: diagnosticModal.asset._id,
        issueDescription: diagnosticDesc,
      });
      setDiagnosticModal({ open: false, asset: null });
      setDiagnosticDesc("");
      alert("Diagnostic request submitted successfully!");
    } catch (error) {
      alert(
        "Error submitting request: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = isAdmin ? "/assets/stats" : "/assets/my-stats";
        const { data } = await api.get(endpoint);

        // If employee, also fetch maintenance count and my assets
        if (!isAdmin) {
          const [{ data: maintenanceData }, { data: assetsData }] =
            await Promise.all([
              api.get("/maintenance/my"),
              api.get("/assets/my"),
            ]);
          data.pendingRequests = maintenanceData.filter(
            (r) => r.status === "Pending",
          ).length;
          setMyAssets(assetsData);
        }

        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAdmin]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );

  const COLORS = ["#000000", "#1e293b", "#334155", "#475569", "#64748b"];

  return (
    <>
      <div className="fade-in space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-3 italic">
              Portfolio{" "}
              <span className="text-black dark:text-white underline decoration-slate-300 dark:decoration-slate-700 underline-offset-[12px] decoration-8">
                Overview
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
              Real-time diagnostics and inventory health metrics for your global
              asset library.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="premium-button-secondary">Settings</button>
            <button className="premium-button-primary">
              <TrendingUp size={20} />
              Generate Report
            </button>
          </div>
        </div>

        {isAdmin ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard
                title="Total Assets"
                value={stats?.total || 0}
                icon={Package}
                color="bg-primary-500"
                trend="up"
                trendValue="12%"
              />
              <StatCard
                title="Assigned"
                value={stats?.assigned || 0}
                icon={CircleCheck}
                color="bg-emerald-500"
                trend="up"
                trendValue="5%"
              />
              <StatCard
                title="Available"
                value={stats?.available || 0}
                icon={TrendingUp}
                color="bg-sky-500"
                trend="down"
                trendValue="2%"
              />
              <StatCard
                title="In Maintenance"
                value={stats?.maintenance || 0}
                icon={AlertCircle}
                color="bg-rose-500"
                trend="up"
                trendValue="8%"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart 1 */}
              <div className="glass-card p-8 lg:col-span-2">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black mb-1">
                      Asset Allocation
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Hardware vs Software diagnostics
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    UNITS
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats?.statsByType || []}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="0"
                        vertical={false}
                        stroke="#475569"
                        opacity={0.1}
                      />
                      <XAxis
                        dataKey="_id"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        contentStyle={{
                          borderRadius: "24px",
                          border: "none",
                          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                          backgroundColor: "var(--tooltip-bg, #0f172a)",
                          padding: "16px",
                        }}
                        itemStyle={{
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: "14px",
                        }}
                        labelStyle={{
                          color: "#64748b",
                          fontWeight: 800,
                          fontSize: "10px",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="currentColor"
                        className="text-black dark:text-white"
                        radius={[12, 12, 4, 4]}
                        barSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2 */}
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black mb-1">Status Hub</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Operational availability
                    </p>
                  </div>
                </div>
                <div className="h-[280px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Assigned", value: stats?.assigned },
                          { name: "Available", value: stats?.available },
                          { name: "Maintenance", value: stats?.maintenance },
                        ]}
                        innerRadius={85}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {[1, 2, 3].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: "var(--tooltip-bg, #0f172a)",
                          padding: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-6 text-sm font-bold">
                  <div className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#000000] dark:bg-white"></div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Assigned
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      {stats?.assigned}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b] dark:bg-slate-300"></div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Available
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      {stats?.available}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#334155] dark:bg-slate-500"></div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Maintenance
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      {stats?.maintenance}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {/* Employee Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Assigned Assets"
                value={myAssets.length}
                icon={ShieldCheck}
                color="bg-primary-500"
                trend="up"
                trendValue="Active"
              />
              <StatCard
                title="Passed for Review"
                value={stats?.pendingRequests || 0}
                icon={Wrench}
                color="bg-amber-500"
                trend={stats?.pendingRequests > 0 ? "up" : "down"}
                trendValue={
                  stats?.pendingRequests > 0 ? "Pending" : "All Clear"
                }
              />
            </div>

            {/* Assigned Assets Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                  Assigned{" "}
                  <span className="underline decoration-slate-300 dark:decoration-slate-700">
                    Resources
                  </span>
                </h3>
                <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {myAssets.length} Active
                </span>
              </div>

              {myAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myAssets.map((asset) => (
                    <div
                      key={asset._id}
                      onClick={() => setAssetDetail(asset)}
                      className="glass-card p-6 flex flex-col gap-6 group hover:border-black dark:hover:border-white transition-all duration-500 cursor-pointer"
                    >
                      <div className="flex gap-5">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800/50 group-hover:scale-105 transition-transform duration-500">
                          {asset.image ? (
                            <img
                              src={
                                asset.image.startsWith("http")
                                  ? asset.image
                                  : `${api.defaults.baseURL.replace("/api", "")}${asset.image}`
                              }
                              alt={asset.assetName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShieldCheck size={24} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white leading-tight truncate mb-1">
                            {asset.assetName}
                          </h4>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              SN: {asset.serialNumber}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-emerald-500" />
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                Operational
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center text-[10px] font-black">
                              {asset.assignedBy?.name?.charAt(0) || "A"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                                Deployed By
                              </span>
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-none">
                                {asset.assignedBy?.name || "Administrator"}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/50">
                            {asset.assetType}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRaiseDiagnostic(asset);
                          }}
                          className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 dark:shadow-white/5"
                        >
                          <Wrench size={14} strokeWidth={3} />
                          Raise Diagnostic
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-20 text-center flex flex-col items-center border-dashed">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
                    <ShieldCheck size={32} strokeWidth={1} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 underline decoration-slate-200 dark:decoration-slate-800 underline-offset-8">
                    Vault Empty
                  </h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs">
                    No high-value assets have been deployed to your profile yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Diagnostic Modal */}
      {diagnosticModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Raise Diagnostic
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Report an issue with your assigned hardware
                </p>
              </div>
              <button
                onClick={() => setDiagnosticModal({ open: false, asset: null })}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmitDiagnostic} className="p-8 space-y-6">
              {/* Pre-filled Asset */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Asset
                </label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    {diagnosticModal.asset?.image ? (
                      <img
                        src={
                          diagnosticModal.asset.image.startsWith("http")
                            ? diagnosticModal.asset.image
                            : `${api.defaults.baseURL.replace("/api", "")}${diagnosticModal.asset.image}`
                        }
                        alt={diagnosticModal.asset.assetName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShieldCheck size={18} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                      {diagnosticModal.asset?.assetName}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-slate-400">
                      SN: {diagnosticModal.asset?.serialNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Issue Description
                </label>
                <textarea
                  value={diagnosticDesc}
                  onChange={(e) => setDiagnosticDesc(e.target.value)}
                  placeholder="Describe the issue you're experiencing..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDiagnosticModal({ open: false, asset: null })
                  }
                  className="flex-1 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:border-slate-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !diagnosticDesc.trim()}
                  className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 dark:shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Wrench size={14} strokeWidth={3} />
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Asset Detail Modal */}
      {assetDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Close button outside card */}
          <button
            onClick={() => setAssetDetail(null)}
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-10"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Header with image */}
            <div className="relative">
              {assetDetail.image ? (
                <div className="w-full h-52 bg-black">
                  <img
                    src={
                      assetDetail.image.startsWith("http")
                        ? assetDetail.image
                        : `${api.defaults.baseURL.replace("/api", "")}${assetDetail.image}`
                    }
                    alt={assetDetail.assetName}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ShieldCheck
                    size={48}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
              )}
            </div>

            {/* Asset Info */}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
                  {assetDetail.assetName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">
                    {assetDetail.assetType}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                      assetDetail.status === "Assigned"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : assetDetail.status === "Maintenance"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        assetDetail.status === "Assigned"
                          ? "bg-emerald-500"
                          : assetDetail.status === "Maintenance"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                      }`}
                    />
                    {assetDetail.status}
                  </span>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800/50 overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <Hash size={16} className="text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      Serial Number
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {assetDetail.serialNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      Purchase Date
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {new Date(assetDetail.purchaseDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4">
                  <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      Warranty Expiry
                    </p>
                    <p
                      className={`text-sm font-bold ${new Date(assetDetail.warrantyExpiry) < new Date() ? "text-rose-500" : "text-slate-900 dark:text-white"}`}
                    >
                      {new Date(assetDetail.warrantyExpiry).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                      {new Date(assetDetail.warrantyExpiry) < new Date() && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 ml-2">
                          Expired
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4">
                  <Users size={16} className="text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      Deployed By
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {assetDetail.assignedBy?.name || "Administrator"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4">
                  <Info size={16} className="text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      Added to System
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {new Date(assetDetail.createdAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents & Uploads */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Documents & Uploads
                </p>
                {assetDetail.invoice ? (
                  <a
                    href={
                      assetDetail.invoice.startsWith("http")
                        ? assetDetail.invoice
                        : `${api.defaults.baseURL.replace("/api", "")}${assetDetail.invoice}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-black dark:hover:border-white transition-all group/doc"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden group-hover/doc:scale-105 transition-transform">
                      {assetDetail.invoice.match(
                        /\.(jpg|jpeg|png|gif|webp)$/i,
                      ) ? (
                        <img
                          src={
                            assetDetail.invoice.startsWith("http")
                              ? assetDetail.invoice
                              : `${api.defaults.baseURL.replace("/api", "")}${assetDetail.invoice}`
                          }
                          alt="Invoice"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText size={20} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        Invoice / Legal Document
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Tap to view in new tab
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-400 group-hover/doc:text-black dark:group-hover/doc:text-white transition-colors shrink-0"
                    />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/50">
                    <FileText
                      size={18}
                      className="text-slate-300 dark:text-slate-600"
                    />
                    <p className="text-xs font-bold text-slate-400">
                      No documents attached
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setAssetDetail(null)}
                  className="flex-1 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:border-slate-400 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setAssetDetail(null);
                    handleRaiseDiagnostic(assetDetail);
                  }}
                  className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 dark:shadow-white/5 flex items-center justify-center gap-2"
                >
                  <Wrench size={14} strokeWidth={3} />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
