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

      {/* GRID */}
      <div className="max-w-7xl mx-auto p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((c) => (
          <div
            key={c._id}
            className="bg-[#0b1129]/80 rounded-2xl border border-white/10 overflow-hidden"
          >
            {c.image && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={`${API}${c.image}`}
                className="w-full h-44 object-cover"
              />
            )}

            <div className="p-4 space-y-2">

              <h3 className="font-semibold truncate">
                {c.name}
              </h3>

              <p className="text-xs text-gray-400">
                {c.brand} • {c.model}
              </p>

              {c.user && (
                <p className="text-xs text-cyan-300">
                  👤 {c.user.name} ({c.user.email})
                </p>
              )}

              <p className="font-semibold text-cyan-300">
                ₹ {c.price}
              </p>

              <div className="flex gap-2 pt-2">

                <button
                  onClick={() => setView(c)}
                  className="flex-1 py-2 bg-cyan-500 text-black rounded text-sm"
                >
                  View
                </button>

                {tab === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(c._id, "approved")
                      }
                      className="flex-1 py-2 bg-green-500 text-black rounded text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(c._id, "rejected")
                      }
                      className="flex-1 py-2 bg-red-500 text-black rounded text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {view && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

          <div className="bg-[#070b1d] max-w-xl w-full rounded-2xl overflow-hidden border border-white/10">

            <div className="flex justify-between px-4 py-3 border-b border-white/10">

              <h2 className="font-semibold">
                {view.name}
              </h2>

              <button onClick={() => setView(null)}>
                <X size={18} />
              </button>

            </div>

            {view.image && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={`${API}${view.image}`}
                className="w-full h-60 object-cover"
              />
            )}

            <div className="p-5 space-y-3 text-sm">

              {view.user && (
                <div className="bg-white/5 p-3 rounded">

                  <p><b>Client:</b> {view.user.name}</p>
                  <p><b>Email:</b> {view.user.email}</p>

                </div>
              )}

              <p><b>Brand:</b> {view.brand}</p>
              <p><b>Model:</b> {view.model}</p>
              <p><b>Gear:</b> {view.gear}</p>
              <p><b>Fuel:</b> {view.fuel}</p>
              <p><b>Price:</b> ₹ {view.price}</p>

              {view.about && <p>{view.about}</p>}

              {view.features && (
                <div className="flex flex-wrap gap-1">

                  {view.features.map((f, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-cyan-500/20 rounded"
                    >
                      {f}
                    </span>
                  ))}

                </div>
              )}

              {view.status === "pending" && (
                <div className="flex gap-3 pt-3">

                  <button
                    onClick={() =>
                      updateStatus(
                        view._id,
                        "approved"
                      )
                    }
                    className="flex-1 bg-green-500 py-2 rounded text-black"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        view._id,
                        "rejected"
                      )
                    }
                    className="flex-1 bg-red-500 py-2 rounded text-black"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
