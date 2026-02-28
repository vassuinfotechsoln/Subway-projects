import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  ShieldCheck,
  Calendar,
  Layers,
  Wrench,
  CircleCheck,
  CircleX,
  Clock,
  Box,
  ArrowRight,
} from "lucide-react";
import api, { STATIC_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";

const StatusBadge = ({ status }) => {
  const styles = {
    Available:
      "bg-slate-900/10 text-slate-900 dark:bg-white/10 dark:text-white border-slate-900/20 dark:border-white/20",
    Assigned:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    Maintenance:
      "bg-slate-100/50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500 border-slate-200 dark:border-slate-700",
  };

  const icons = {
    Available: CircleCheck,
    Assigned: UserPlus,
    Maintenance: Wrench,
  };

  const Icon = icons[status] || Clock;

  return (
    <span
      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${styles[status] || ""}`}
    >
      <Icon size={12} strokeWidth={3} />
      {status}
    </span>
  );
};

const Assets = () => {
  const { isAdmin } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [users, setUsers] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "Hardware",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    status: "Available",
    assignedTo: "",
    image: null,
    invoice: null,
  });

  const fetchAssets = async () => {
    try {
      const endpoint = isAdmin ? "/assets" : "/assets/my";
      const { data } = await api.get(endpoint);
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    if (isAdmin) {
      api.get("/users").then(({ data }) => setUsers(data));
    }
  }, [isAdmin]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("assetName", formData.assetName);
    data.append("assetType", formData.assetType);
    data.append("serialNumber", formData.serialNumber);
    data.append("purchaseDate", formData.purchaseDate);
    data.append("warrantyExpiry", formData.warrantyExpiry);
    data.append("status", formData.status);
    data.append("assignedTo", formData.assignedTo);
    if (formData.image) data.append("image", formData.image);
    if (formData.invoice) data.append("invoice", formData.invoice);

    try {
      if (editingAsset) {
        await api.put(`/assets/${editingAsset._id}`, data);
      } else {
        await api.post("/assets", data);
      }
      fetchAssets();
      setIsModalOpen(false);
      setEditingAsset(null);
      setFormData({
        assetName: "",
        assetType: "Hardware",
        serialNumber: "",
        purchaseDate: "",
        warrantyExpiry: "",
        status: "Available",
        assignedTo: "",
        image: null,
        invoice: null,
      });
    } catch (error) {
      alert(
        "Error saving asset: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleQuickAssign = async (assetId, userId) => {
    if (!userId) return;
    try {
      await api.put(`/assets/${assetId}/assign`, { userId });
      fetchAssets();
    } catch (error) {
      alert(
        "Error assigning asset: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await api.delete(`/assets/${id}`);
        fetchAssets();
      } catch (error) {
        alert("Error deleting asset");
      }
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "All" || asset.assetType === filterType),
  );

  return (
    <div className="fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 italic">
            Inventory{" "}
            <span className="text-black dark:text-white underline">Vault</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage and audit your high-value enterprise assets.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingAsset(null);
              setFormData({
                assetName: "",
                assetType: "Hardware",
                serialNumber: "",
                purchaseDate: "",
                warrantyExpiry: "",
                status: "Available",
                image: null,
                invoice: null,
              });
              setIsModalOpen(true);
            }}
            className="premium-button-primary shadow-black/20 dark:shadow-white/10"
          >
            <Plus size={20} strokeWidth={2.5} />
            Register New Asset
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
          />
          <input
            type="text"
            placeholder="Search assets by name or unique serial identifier..."
            className="premium-input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] px-4 py-2 shadow-sm w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select
            className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest pr-2 cursor-pointer text-slate-600 dark:text-slate-400"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Asset Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Serial Number
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assignee
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Deployment
                  </th>
                )}
                {isAdmin && (
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center animate-pulse"
                  >
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      Cataloging assets...
                    </p>
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="glass-card max-w-sm mx-auto p-10 py-16">
                      <Layers
                        size={48}
                        className="mx-auto text-slate-300 mb-6 opacity-50"
                      />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                        {isAdmin
                          ? "No assets found matching your criteria."
                          : "You have no assets assigned to your profile yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 group/row border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover/row:bg-black group-hover/row:text-white dark:group-hover/row:bg-white dark:group-hover/row:text-black transition-all duration-500 shadow-sm overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shrink-0">
                          {asset.image ? (
                            <img
                              src={
                                asset.image.startsWith("http")
                                  ? asset.image
                                  : `${STATIC_URL}${asset.image}`
                              }
                              alt={asset.assetName}
                              className="w-full h-full object-cover"
                            />
                          ) : asset.assetType === "Hardware" ? (
                            <ShieldCheck size={20} strokeWidth={2} />
                          ) : (
                            <Layers size={20} strokeWidth={2} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white leading-tight mb-1 tracking-tight">
                            {asset.assetName}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Purchased{" "}
                            {new Date(asset.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                        {asset.assetType}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800/50">
                        {asset.serialNumber}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={asset.status} />
                    </td>
                    <td className="px-6 py-5">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center text-xs font-black border border-black/10 shadow-sm">
                            {asset.assignedTo.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {asset.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400/60 flex items-center gap-1.5 italic">
                          <CircleX size={12} className="opacity-50" /> NO
                          ASSIGNEE
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-5">
                        {asset.assignedTo ? (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                              {asset.assignedTo.name}
                            </span>
                          </div>
                        ) : (
                          <div className="relative group/assign w-full max-w-[140px]">
                            <select
                              onChange={(e) =>
                                handleQuickAssign(asset._id, e.target.value)
                              }
                              className="w-full bg-black dark:bg-slate-800 text-white text-[9px] font-black uppercase tracking-[0.2em] pl-3 pr-8 py-2 rounded-xl border border-black/10 dark:border-white/5 outline-none hover:bg-slate-900 dark:hover:bg-slate-700 transition-all cursor-pointer appearance-none shadow-premium-sm"
                            >
                              <option value="">Quick Assign</option>
                              {users
                                .filter((u) => u.role === "Employee")
                                .map((u) => (
                                  <option
                                    key={u._id}
                                    value={u._id}
                                    className="bg-white text-black text-xs font-bold"
                                  >
                                    {u.name}
                                  </option>
                                ))}
                            </select>
                            <UserPlus
                              size={12}
                              strokeWidth={3}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-hover/assign:text-white transition-colors"
                            />
                          </div>
                        )}
                      </td>
                    )}
                    {isAdmin && (
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover/row:opacity-100 transition-all duration-300 translate-x-4 group-hover/row:translate-x-0">
                          <button
                            onClick={() => {
                              setEditingAsset(asset);
                              setFormData({
                                assetName: asset.assetName,
                                assetType: asset.assetType,
                                serialNumber: asset.serialNumber,
                                purchaseDate: asset.purchaseDate.split("T")[0],
                                warrantyExpiry:
                                  asset.warrantyExpiry.split("T")[0],
                                status: asset.status,
                                assignedTo: asset.assignedTo?._id || "",
                                image: null,
                                invoice: null,
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-2.5 text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(asset._id)}
                            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-300"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide-over */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-transparent animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-premium overflow-hidden border border-slate-200 dark:border-slate-800 animate-[float_0.4s_ease-out]">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                  {editingAsset ? "Calibrate Asset" : "Initialize Resource"}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {editingAsset
                    ? "Modify existing hardware parameters"
                    : "Add new hardware to the vault"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all duration-300"
              >
                <CircleX size={28} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Asset Designation
                  </label>
                  <input
                    required
                    type="text"
                    className="premium-input bg-slate-50 dark:bg-slate-950"
                    placeholder="e.g. Quantum Server Rack X"
                    value={formData.assetName}
                    onChange={(e) =>
                      setFormData({ ...formData, assetName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    System Category
                  </label>
                  <select
                    className="premium-input bg-slate-50 dark:bg-slate-950 cursor-pointer appearance-none"
                    value={formData.assetType}
                    onChange={(e) =>
                      setFormData({ ...formData, assetType: e.target.value })
                    }
                  >
                    <option value="Hardware">Hardware Node</option>
                    <option value="Software">Software Instance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Serial Identifier
                  </label>
                  <input
                    required
                    type="text"
                    className="premium-input bg-slate-50 dark:bg-slate-950 font-mono tracking-wider"
                    placeholder="AP-449X-99"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Entry Date
                  </label>
                  <input
                    required
                    type="date"
                    className="premium-input bg-slate-50 dark:bg-slate-950"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Service Expiry
                  </label>
                  <input
                    required
                    type="date"
                    className="premium-input bg-slate-50 dark:bg-slate-950"
                    value={formData.warrantyExpiry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warrantyExpiry: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Operational Status
                  </label>
                  <select
                    className="premium-input bg-slate-50 dark:bg-slate-950 cursor-pointer appearance-none"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Available">Online / Available</option>
                    <option value="Assigned">Deployed / Active</option>
                    <option value="Maintenance">Under Diagnostics</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Chain of Custody (Assignee)
                  </label>
                  <select
                    className="premium-input bg-slate-50 dark:bg-slate-950 cursor-pointer appearance-none"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                  >
                    <option value="">Unassigned / In Vault</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Visual Evidence
                  </label>
                  <div className="relative group/file">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                    />
                    <div
                      className={`premium-input flex items-center justify-center border-dashed py-6 group-hover/file:border-primary-500/50 transition-all overflow-hidden ${formData.image || (editingAsset && editingAsset.image) ? "bg-black border-none" : "bg-slate-50 dark:bg-slate-950"}`}
                    >
                      <div className="text-center w-full">
                        {formData.image ||
                        (editingAsset && editingAsset.image) ? (
                          <div className="relative group/preview h-24 w-24 mx-auto flex items-center justify-center">
                            <img
                              src={
                                formData.image
                                  ? URL.createObjectURL(formData.image)
                                  : editingAsset.image.startsWith("http")
                                    ? editingAsset.image
                                    : `${STATIC_URL}${editingAsset.image}`
                              }
                              alt="preview"
                              className="w-full h-full object-cover bg-black/40 rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white">
                              <CircleCheck
                                size={24}
                                strokeWidth={2.5}
                                className="mb-2"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest block truncate max-w-full px-4 text-center">
                                {formData.image
                                  ? formData.image.name
                                  : "Current Image"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Box
                              size={20}
                              className="mx-auto text-slate-400 mb-2 group-hover/file:text-black dark:group-hover/file:text-white transition-colors"
                            />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Upload Profile
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Legal Document
                  </label>
                  <div className="relative group/file">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) =>
                        setFormData({ ...formData, invoice: e.target.files[0] })
                      }
                    />
                    <div
                      className={`premium-input flex items-center justify-center border-dashed py-6 group-hover/file:border-primary-500/50 transition-all overflow-hidden ${formData.invoice || (editingAsset && editingAsset.invoice) ? "bg-black border-none" : "bg-slate-50 dark:bg-slate-950"}`}
                    >
                      <div className="text-center w-full">
                        {formData.invoice ||
                        (editingAsset && editingAsset.invoice) ? (
                          <div className="relative group/preview h-24 w-full flex items-center justify-center">
                            {formData.invoice?.type?.startsWith("image/") ||
                            (!formData.invoice &&
                              editingAsset.invoice.match(
                                /\.(jpg|jpeg|png|gif|webp)$|image/i,
                              )) ? (
                              <img
                                src={
                                  formData.invoice
                                    ? URL.createObjectURL(formData.invoice)
                                    : editingAsset.invoice.startsWith("http")
                                      ? editingAsset.invoice
                                      : `${STATIC_URL}${editingAsset.invoice}`
                                }
                                alt="preview"
                                className="h-full object-contain bg-black/20 rounded-xl"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                <Plus size={32} />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white">
                              <CircleCheck
                                size={24}
                                strokeWidth={2.5}
                                className="mb-2"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest block truncate max-w-full px-4 text-center">
                                {formData.invoice
                                  ? formData.invoice.name
                                  : "Current Document"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Edit2
                              size={20}
                              className="mx-auto text-slate-400 mb-2 group-hover/file:text-black dark:group-hover/file:text-white transition-colors"
                            />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Upload Invoice
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Terminate Process
                </button>
                <button
                  type="submit"
                  className="flex-[2] premium-button-primary shadow-black/20 dark:shadow-white/10"
                >
                  {editingAsset ? "Finalize Configuration" : "Deploy to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
