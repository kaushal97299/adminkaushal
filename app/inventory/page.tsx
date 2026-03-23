/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  XCircle,
  X,
  Search,
  Eye,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface CarItem {
  _id: string;
  user?: UserInfo;
  name: string;
  brand: string;
  model: string;
  gear: string;
  fuel: string;
  price: number;
  about?: string;
  image?: string;
  features?: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

type Tab = "pending" | "approved" | "rejected";

export default function AdminInventoryPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [view, setView] = useState<CarItem | null>(null);
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!token) return;
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    const res = await axios.get(
      `${API}/api/admin/inventory`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCars(res.data);
  };

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!token) return;

    if (!search) {
      loadData();
      return;
    }

    const timer = setTimeout(async () => {
      const res = await axios.get(
        `${API}/api/admin/inventory/search?q=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCars(res.data);
    }, 500);

    return () => clearTimeout(timer);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* ================= UPDATE ================= */
  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    await axios.put(
      `${API}/api/admin/inventory/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCars((p) =>
      p.map((c) =>
        c._id === id ? { ...c, status } : c
      )
    );

    setView(null);
  };

  const filtered = cars.filter(
    (c) => c.status === tab
  );

  if (!token)
    return (
      <p className="text-center mt-20 text-red-400">
        Please login as admin
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070b1d] via-[#0c1430] to-[#050716] text-white">

      {/* TOP BAR */}
      <div className="sticky top-0 z-30 backdrop-blur bg-[#050716]/90 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-4 py-3">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-xl font-bold text-cyan-400">
                Admin Dashboard
              </h1>

              <p className="text-xs text-gray-400">
                Inventory Moderation
              </p>
            </div>

            <div className="hidden sm:flex gap-2 text-xs">

              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                Pending: {cars.filter(c => c.status==="pending").length}
              </span>

              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                Approved: {cars.filter(c => c.status==="approved").length}
              </span>

              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                Rejected: {cars.filter(c => c.status==="rejected").length}
              </span>

            </div>

          </div>

          {/* SEARCH */}
          <div className="mt-3 relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by client name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2 rounded-xl
                bg-white/5 border border-white/10
                focus:border-cyan-400 outline-none
                text-sm
              "
            />

          </div>

        </div>
      </div>

      {/* TABS */}
      <div className="border-b border-white/10 bg-[#050716]/80">

        <div className="max-w-7xl mx-auto flex">

          {[
            { key: "pending", label: "Pending", icon: <Clock size={16} />, c: "yellow" },
            { key: "approved", label: "Approved", icon: <CheckCircle size={16} />, c: "green" },
            { key: "rejected", label: "Rejected", icon: <XCircle size={16} />, c: "red" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`
                flex-1 py-3 flex items-center justify-center gap-2 text-sm
                ${
                  tab === t.key
                    ? `text-${t.c}-400 border-b-2 border-${t.c}-400`
                    : "text-gray-400"
                }
              `}
            >
              {t.icon}
              {t.label}
            </button>
          ))}

        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto p-4">

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No records found.</p>
        ) : (

          /* ── wrapper: horizontal scroll on small screens ── */
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-sm">

              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Brand / Model</th>
                  <th className="px-4 py-3 text-left">Fuel / Gear</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filtered.map((c, idx) => (
                  <tr
                    key={c._id}
                    className="bg-[#0b1129]/80 hover:bg-white/5 transition"
                  >
                    {/* # */}
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>

                    {/* IMAGE */}
                    <td className="px-4 py-3">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                        <img
                          src={c.image}
                          className="w-14 h-10 object-cover rounded-lg border border-white/10"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 text-xs">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* NAME */}
                    <td className="px-4 py-3 font-medium text-white max-w-[140px] truncate">
                      {c.name}
                    </td>

                    {/* BRAND / MODEL */}
                    <td className="px-4 py-3 text-gray-300">
                      <span className="block">{c.brand}</span>
                      <span className="text-xs text-gray-500">{c.model}</span>
                    </td>

                    {/* FUEL / GEAR */}
                    <td className="px-4 py-3 text-gray-300">
                      <span className="block">{c.fuel}</span>
                      <span className="text-xs text-gray-500">{c.gear}</span>
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-3 font-semibold text-cyan-300">
                      ₹{c.price}
                    </td>

                    {/* CLIENT */}
                    <td className="px-4 py-3">
                      {c.user ? (
                        <>
                          <span className="block text-cyan-300 text-xs">{c.user.name}</span>
                          <span className="block text-gray-500 text-xs truncate max-w-[140px]">{c.user.email}</span>
                        </>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">

                        {/* VIEW */}
                        <button
                          onClick={() => setView(c)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 transition"
                        >
                          <Eye size={15} />
                        </button>

                        {tab === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(c._id, "approved")}
                              title="Approve"
                              className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/40 transition"
                            >
                              <CheckCircle size={15} />
                            </button>

                            <button
                              onClick={() => updateStatus(c._id, "rejected")}
                              title="Reject"
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {view && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setView(null)}
        >
          <div
            className="bg-[#0b1129] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">{view.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Added {new Date(view.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* STATUS BADGE */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  view.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : view.status === "rejected"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {view.status.toUpperCase()}
                </span>
                <button
                  onClick={() => setView(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div className="overflow-y-auto flex-1">

              {/* IMAGE */}
              {view.image && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  src={view.image}
                  className="w-full h-48 sm:h-64 object-cover"
                />
              )}

              <div className="p-5 space-y-5">

                {/* CLIENT INFO */}
                {view.user && (
                  <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                      {view.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-cyan-300">{view.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{view.user.email}</p>
                    </div>
                  </div>
                )}

                {/* CAR DETAILS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Brand",  value: view.brand },
                    { label: "Model",  value: view.model },
                    { label: "Fuel",   value: view.fuel  },
                    { label: "Gear",   value: view.gear  },
                    { label: "Price",  value: `₹ ${view.price}` },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="bg-white/5 rounded-xl px-4 py-3 border border-white/5"
                    >
                      <p className="text-[10px] uppercase text-gray-500 mb-1">{row.label}</p>
                      <p className={`text-sm font-semibold ${
                        row.label === "Price" ? "text-cyan-300" : "text-white"
                      }`}>{row.value}</p>
                    </div>
                  ))}
                </div>

                {/* ABOUT */}
                {view.about && (
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                    <p className="text-[10px] uppercase text-gray-500 mb-1">About</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{view.about}</p>
                  </div>
                )}

                {/* FEATURES */}
                {view.features && view.features.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase text-gray-500 mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {view.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ── FOOTER ACTIONS (only for pending) ── */}
            {view.status === "pending" && (
              <div className="flex gap-3 px-5 py-4 border-t border-white/10 flex-shrink-0">
                <button
                  onClick={() => updateStatus(view._id, "approved")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition text-sm"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => updateStatus(view._id, "rejected")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-400 text-black font-semibold rounded-xl transition text-sm"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
