/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Search, Eye, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

const PER_PAGE = 10;

export default function AdminUsers() {

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filtered, setFiltered] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewUser, setViewUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  /* ================= LOAD USERS ================= */
  useEffect(() => {

    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch(`${API}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {

        if (!data.success) {
          router.push("/admin/login");
          return;
        }

        setUsers(data.users);
        setFiltered(data.users);
        setLoading(false);

      })
      .catch(() => {
        alert("Failed to load users");
        setLoading(false);
      });

  }, [router]);



  /* ================= SEARCH ================= */
  useEffect(() => {

    const result = users.filter(u =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.state?.toLowerCase().includes(search.toLowerCase())
    );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiltered(result);
    setPage(1);

  }, [search, users]);



  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const paginated = filtered.slice(start, end);



  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {

    if (!confirm("Delete this user?")) return;

    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API}/api/admin/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {

      const updated = users.filter(u => u._id !== id);

      setUsers(updated);
      setFiltered(updated);

      alert("User deleted");

    } else {
      alert("Delete failed");
    }
  };



  /* ================= VIEW ================= */
  const handleView = async (id: string) => {

    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API}/api/admin/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setViewUser(data.user);
    } else {
      alert("Failed to load user");
    }
  };



  /* ================= AVATAR ================= */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAvatar = (user: any) => {

    if (!user?.avatar) return "/avatar.png";

    if (user.avatar.startsWith("http")) return user.avatar;

    if (user.avatar.startsWith("data:image")) return user.avatar;

    return `${API}/${user.avatar}`;
  };



  /* ================= LOADING ================= */
  if (loading) {
    return (
      <p className="text-center mt-20 text-slate-400">
        Loading users...
      </p>
    );
  }



  return (
    <div className="min-h-screen p-6 bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto bg-slate-900 border border-white/10 rounded-xl shadow p-6">


        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">

          <h1 className="text-2xl font-bold text-cyan-400">
            All Users
          </h1>

          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2 bg-slate-800">

            <Search size={18} className="text-slate-400" />

            <input
              placeholder="Search by email or state"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none bg-transparent text-slate-200 placeholder:text-slate-500"
            />

          </div>

        </div>



        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm border border-white/10">

            <thead className="bg-slate-800 text-slate-200">
              <tr>

                <th className="p-3 border border-white/10">Name</th>
                <th className="p-3 border border-white/10">Email</th>
                <th className="p-3 border border-white/10">Phone</th>
                <th className="p-3 border border-white/10">State</th>
                <th className="p-3 border border-white/10">Joined</th>
                <th className="p-3 border border-white/10">Action</th>

              </tr>
            </thead>


            <tbody>

              {paginated.map(user => (

                <tr
                  key={user._id}
                  className="text-center border-b border-white/10 hover:bg-white/5"
                >

                  <td className="p-2">{user.name}</td>
                  <td className="p-2 text-slate-300">{user.email}</td>
                  <td className="p-2">{user.phone || "-"}</td>
                  <td className="p-2">{user.state || "-"}</td>

                  <td className="p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-2 space-x-4">

                    {/* VIEW */}
                    <button
                      onClick={() => handleView(user._id)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Eye size={18} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>

                </tr>

              ))}


              {!paginated.length && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>



        {/* PAGINATION */}
        {totalPages > 1 && (

          <div className="flex justify-center gap-2 mt-6">

            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-white/10 rounded disabled:opacity-40 hover:bg-white/5"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border border-white/10 rounded
                  ${page === i + 1
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-white/5"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-white/10 rounded disabled:opacity-40 hover:bg-white/5"
            >
              Next
            </button>

          </div>
        )}



        {/* VIEW MODAL */}
        {viewUser && (

          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-xl p-6 relative">


              {/* CLOSE */}
              <button
                onClick={() => setViewUser(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>



              {/* HEADER */}
              <div className="flex flex-col items-center mb-5">

                <img
                  src={getAvatar(viewUser)}
                  className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500/30 mb-3"
                  alt="User"
                />

                <h2 className="text-lg font-semibold">
                  {viewUser.name}
                </h2>

                <p className="text-sm text-slate-400">
                  {viewUser.email}
                </p>

              </div>



              {/* DETAILS */}
              <div className="space-y-2 text-sm text-slate-300">

                <p><b className="text-slate-400">Phone:</b> {viewUser.phone || "-"}</p>
                <p><b className="text-slate-400">Gender:</b> {viewUser.gender || "-"}</p>
                <p><b className="text-slate-400">DOB:</b> {viewUser.dob || "-"}</p>

                <p><b className="text-slate-400">Bio:</b> {viewUser.bio || "-"}</p>
                <p><b className="text-slate-400">Emergency:</b> {viewUser.emergency || "-"}</p>

                <p><b className="text-slate-400">Address:</b> {viewUser.address || "-"}</p>

                <p><b className="text-slate-400">Village:</b> {viewUser.village || "-"}</p>
                <p><b className="text-slate-400">District:</b> {viewUser.district || "-"}</p>
                <p><b className="text-slate-400">State:</b> {viewUser.state || "-"}</p>
                <p><b className="text-slate-400">Pincode:</b> {viewUser.pincode || "-"}</p>

                <p>
                  <b className="text-slate-400">Joined:</b>{" "}
                  {new Date(viewUser.createdAt).toLocaleString()}
                </p>

              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}