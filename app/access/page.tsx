"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Mail, Lock, ArrowLeft } from "lucide-react";

/* ================= AXIOS (ENV BASE URL) ================= */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= COMPONENT ================= */

type Mode = "login" | "forgot";

export default function AdminAuth() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= AUTO LOGIN CHECK ================= */

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      router.push("/");
    }
  }, [router]);

  /* ================= LOGIN ================= */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/api/admin/login", {
        email,
        password,
      });

      /* Save Token */
      if (res.data?.token) {
        localStorage.setItem(
          "admin_token",
          res.data.token
        );
      }

      router.push("/");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMsg(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    }

    setLoading(false);
  };

  /* ================= FORGOT ================= */

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const res = await api.post(
        "/api/admin/forgot-password",
        { email }
      );

      setMsg(
        res.data?.message ||
        "Reset link sent to email"
      );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMsg(
        err.response?.data?.message ||
        "Email not found"
      );
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden">

      {/* ================= BUBBLES ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="bubble b1" />
        <span className="bubble b2" />
        <span className="bubble b3" />
        <span className="bubble b4" />
        <span className="bubble b5" />
      </div>

      {/* ================= GRID ================= */}
      <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-2">

        {/* ================= BRAND ================= */}
        <div className="hidden lg:flex flex-col items-center justify-center px-12 text-center">

          <h1 className="text-6xl font-bold text-white mb-4">
            CarPro
          </h1>

          <p className="text-xl text-slate-300 mb-6">
            Premium Admin Platform
          </p>

          <p className="max-w-md text-slate-400">
            Secure booking management & control system
          </p>

        </div>

        {/* ================= AUTH ================= */}
        <div className="flex items-center justify-center px-4 sm:px-6">

          <div
            className="
              w-full max-w-md
              bg-slate-900/85
              backdrop-blur-xl
              border border-white/10
              rounded-3xl
              p-7 sm:p-9
              shadow-[0_0_50px_rgba(56,189,248,0.18)]
            "
          >
            {/* Header */}
            <div className="mb-7 text-center">

              <h2 className="text-3xl font-semibold text-white mb-1">
                {mode === "login"
                  ? "Welcome Back"
                  : "Reset Password"}
              </h2>

              <p className="text-slate-400 text-sm">
                {mode === "login"
                  ? "Login to admin dashboard"
                  : "Enter admin email to reset"}
              </p>

            </div>

            {/* Message */}
            {msg && (
              <p className="text-sm text-teal-400 mb-4 text-center">
                {msg}
              </p>
            )}

            {/* ================= LOGIN ================= */}
            {mode === "login" && (
              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Email */}
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="Email address"
                    className="auth-input"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="auth-input"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                {/* Forgot */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setMsg("");
                    }}
                    className="text-sm text-sky-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Button */}
                <button
                  disabled={loading}
                  className="auth-btn"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            )}

            {/* ================= FORGOT ================= */}
            {mode === "forgot" && (
              <form
                onSubmit={handleForgot}
                className="space-y-5"
              >
                {/* Email */}
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="Admin email"
                    className="auth-input"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                {/* Back */}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMsg("");
                  }}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>

                {/* Button */}
                <button
                  disabled={loading}
                  className="auth-btn"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
