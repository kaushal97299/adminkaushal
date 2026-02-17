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

        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">

          <div className="w-full sm:w-[480px] bg-slate-900 h-full overflow-y-auto">

            <div className="flex justify-between p-4 border-b border-white/10">

              <h2 className="font-semibold text-lg">
                Client Details
              </h2>

              <button onClick={() => setView(null)}>
                <X />
              </button>

            </div>


            <div className="p-5 space-y-5 text-sm">


              {/* PERSONAL */}

              <div>

                <h4 className="text-cyan-400 mb-2">
                  Personal Info
                </h4>

                <Info label="Name" value={view.name} />
                <Info label="Email" value={view.email} />
                <Info label="Phone" value={view.phone} />
                <Info label="Gender" value={view.gender} />

                <Info
                  label="DOB"
                  value={
                    view.dateOfBirth
                      ? new Date(
                          view.dateOfBirth
                        ).toLocaleDateString()
                      : ""
                  }
                />

                <Info label="Address" value={view.address} />

                <Info
                  label="Location"
                  value={`${view.city || ""}, ${view.district || ""}, ${view.state || ""}`}
                />

              </div>


              {/* DOCUMENT NUMBERS */}

              <div>

                <h4 className="text-cyan-400 mb-2">
                  Document Numbers
                </h4>

                <Info
                  label="Aadhaar"
                  value={view.documents?.aadhaar?.number}
                />

                <Info
                  label="PAN"
                  value={view.documents?.pan?.number}
                />

                <Info
                  label="Driving License"
                  value={
                    view.documents?.drivingLicense?.number
                  }
                />

              </div>


              {/* DOCUMENT IMAGES */}

              <div>

                <h4 className="text-cyan-400 mb-2">
                  Documents
                </h4>

                <DocItem
                  title="Aadhaar"
                  img={view.documents?.aadhaar?.image}
                  setPreview={setImagePreview}
                />

                <DocItem
                  title="PAN"
                  img={view.documents?.pan?.image}
                  setPreview={setImagePreview}
                />

                <DocItem
                  title="Driving License"
                  img={view.documents?.drivingLicense?.image}
                  setPreview={setImagePreview}
                />

              </div>


              {/* REJECT REASON */}

              {view.kycStatus === "rejected" &&
                view.kycRejectReason && (

                  <div className="bg-red-500/10 p-3 rounded">

                    <p className="text-red-400 text-sm">
                      Reject Reason:
                    </p>

                    <p className="text-gray-300 text-sm">
                      {view.kycRejectReason}
                    </p>

                  </div>

                )}

            </div>

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
            src={`${API}${imagePreview}`}
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
