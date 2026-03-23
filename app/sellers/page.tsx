/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  X,
  FileText,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ================= TYPES ================= */

interface DocItem {
  number?: string;
  image?: string;
  status?: string;
}

interface Documents {
  aadhaar?: DocItem;
  pan?: DocItem;
  drivingLicense?: DocItem;
}

interface User {
  _id: string;

  name: string;
  email: string;

  phone?: string;
  address?: string;

  dateOfBirth?: string;
  gender?: string;

  pincode?: string;
  city?: string;
  district?: string;
  state?: string;

  kycStatus: string;
  kycRejectReason?: string;

  documents?: Documents;
}

/* ================= COMPONENT ================= */

export default function AdminKycPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [view, setView] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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

    const res = await axios.get(`${API}/api/admin/kyc`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };


  /* ================= UPDATE ================= */

  const updateStatus = async (
    id: string,
    status: "verified" | "rejected",
    reason?: string
  ) => {

    await axios.put(
      `${API}/api/admin/kyc/${id}/status`,
      { status, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRejectId(null);
    setRejectReason("");

    loadData();
  };


  /* ================= DELETE ================= */

  const deleteUser = async (id: string) => {

    if (!confirm("Delete this user permanently?")) return;

    await axios.delete(`${API}/api/admin/kyc/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadData();
  };


  if (!token) {
    return (
      <p className="text-center mt-20 text-red-400">
        Admin login required
      </p>
    );
  }


  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-2xl font-bold mb-4 text-cyan-400">
        KYC Verification Panel
      </h1>


      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto">

        <table className="w-full border border-white/10 text-sm">

          <thead className="bg-slate-800">

            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">View</th>
              <th className="p-3 border">Verify</th>
              <th className="p-3 border">Reject</th>
              <th className="p-3 border">Delete</th>
            </tr>

          </thead>


          <tbody>

            {users.map((u) => (

              <tr
                key={u._id}
                className="text-center border-b border-white/10 hover:bg-white/5"
              >

                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.phone || "-"}</td>


                <td className="p-2">

                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.kycStatus === "verified"
                        ? "bg-green-500/20 text-green-400"
                        : u.kycStatus === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {u.kycStatus}
                  </span>

                </td>


                <td className="p-2">

                  <button
                    onClick={() => setView(u)}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <Eye size={18} />
                  </button>

                </td>


                <td className="p-2">

                  <button
                    disabled={u.kycStatus !== "pending"}
                    onClick={() =>
                      updateStatus(u._id, "verified")
                    }
                    className="text-green-400 disabled:opacity-30"
                  >
                    <CheckCircle size={18} />
                  </button>

                </td>


                <td className="p-2">

                  <button
                    disabled={u.kycStatus !== "pending"}
                    onClick={() => setRejectId(u._id)}
                    className="text-red-400 disabled:opacity-30"
                  >
                    <XCircle size={18} />
                  </button>

                </td>


                <td className="p-2">

                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* ================= REJECT MODAL ================= */}

      {rejectId && (

        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">

          <div className="bg-slate-900 w-full max-w-md rounded-xl p-5">

            <h3 className="font-semibold mb-3 text-red-400">
              Reject KYC
            </h3>

            <textarea
              placeholder="Enter reject reason..."
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(e.target.value)
              }
              className="w-full bg-slate-800 border border-white/10 rounded p-2 text-sm"
              rows={4}
            />


            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setRejectId(null)}
                className="px-3 py-1 text-gray-400"
              >
                Cancel
              </button>

              <button
                disabled={!rejectReason.trim()}
                onClick={() =>
                  updateStatus(
                    rejectId,
                    "rejected",
                    rejectReason
                  )
                }
                className="px-4 py-1 bg-red-500 rounded text-sm disabled:opacity-40"
              >
                Reject
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================= SIDE MODAL ================= */}

      {view && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setView(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-cyan-400">Client Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">{view.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  view.kycStatus === "verified"
                    ? "bg-green-500/20 text-green-400"
                    : view.kycStatus === "rejected"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {view.kycStatus.toUpperCase()}
                </span>
                <button
                  onClick={() => setView(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">

              {/* PERSONAL INFO */}
              <div>
                <p className="text-[10px] uppercase text-slate-500 tracking-wider mb-2">Personal Info</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Name",   value: view.name },
                    { label: "Phone",  value: view.phone },
                    { label: "Gender", value: view.gender },
                    { label: "DOB",    value: view.dateOfBirth ? new Date(view.dateOfBirth).toLocaleDateString() : undefined },
                  ].map((row) => row.value ? (
                    <div key={row.label} className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                      <p className="text-[10px] uppercase text-slate-500 mb-0.5">{row.label}</p>
                      <p className="text-sm text-slate-200">{row.value}</p>
                    </div>
                  ) : null)}
                </div>
              </div>

              {/* ADDRESS */}
              {(view.address || view.city || view.district || view.state || view.pincode) && (
                <div>
                  <p className="text-[10px] uppercase text-slate-500 tracking-wider mb-2">Address</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Address",  value: view.address  },
                      { label: "City",     value: view.city     },
                      { label: "District", value: view.district },
                      { label: "State",    value: view.state    },
                      { label: "Pincode",  value: view.pincode  },
                    ].map((row) => row.value ? (
                      <div key={row.label} className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                        <p className="text-[10px] uppercase text-slate-500 mb-0.5">{row.label}</p>
                        <p className="text-sm text-slate-200">{row.value}</p>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}

              {/* DOCUMENT NUMBERS */}
              {(view.documents?.aadhaar?.number || view.documents?.pan?.number || view.documents?.drivingLicense?.number) && (
                <div>
                  <p className="text-[10px] uppercase text-slate-500 tracking-wider mb-2">Document Numbers</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "Aadhaar",         value: view.documents?.aadhaar?.number },
                      { label: "PAN",              value: view.documents?.pan?.number },
                      { label: "Driving License",  value: view.documents?.drivingLicense?.number },
                    ].map((row) => row.value ? (
                      <div key={row.label} className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 flex justify-between items-center">
                        <p className="text-[10px] uppercase text-slate-500">{row.label}</p>
                        <p className="text-sm text-slate-200 font-mono">{row.value}</p>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}

              {/* DOCUMENT IMAGES */}
              {(view.documents?.aadhaar?.image || view.documents?.pan?.image || view.documents?.drivingLicense?.image) && (
                <div>
                  <p className="text-[10px] uppercase text-slate-500 tracking-wider mb-2">Document Images</p>
                  <div className="space-y-2">
                    <DocItem title="Aadhaar"         img={view.documents?.aadhaar?.image}         setPreview={setImagePreview} />
                    <DocItem title="PAN"              img={view.documents?.pan?.image}              setPreview={setImagePreview} />
                    <DocItem title="Driving License"  img={view.documents?.drivingLicense?.image}  setPreview={setImagePreview} />
                  </div>
                </div>
              )}

              {/* REJECT REASON */}
              {view.kycStatus === "rejected" && view.kycRejectReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase text-red-400 mb-1">Reject Reason</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{view.kycRejectReason}</p>
                </div>
              )}

            </div>

            {/* ── FOOTER ACTIONS ── */}
            {view.kycStatus === "pending" && (
              <div className="flex gap-3 px-5 py-4 border-t border-white/10 flex-shrink-0">
                <button
                  onClick={() => { updateStatus(view._id, "verified"); setView(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition text-sm"
                >
                  <CheckCircle size={16} /> Verify
                </button>
                <button
                  onClick={() => { setRejectId(view._id); setView(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-400 text-black font-semibold rounded-xl transition text-sm"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}

          </div>
        </div>
      )}


      {/* IMAGE ZOOM */}

      {imagePreview && (

        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setImagePreview(null)}
        >

          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
  src={imagePreview}
            className="max-h-[90%] rounded shadow-lg"
          />

        </div>

      )}

    </div>
  );
}


/* ================= COMPONENTS ================= */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Info({ label, value }: any) {

  if (!value) return null;

  return (

    <p className="text-gray-300">

      <span className="text-gray-400">{label}:</span>{" "}
      {value}

    </p>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DocItem({ title, img, setPreview }: any) {

  if (!img) return null;


  return (

    <div className="flex justify-between items-center bg-white/5 p-3 rounded mb-2">

      <span>{title}</span>


      <button
        onClick={() => setPreview(img)}
        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
      >

        <FileText size={16} />
        View

      </button>

    </div>
  );
}
