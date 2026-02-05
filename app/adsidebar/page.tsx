"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import "./sidebar.css";

import {
  LayoutDashboard,
  Users,
  Store,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  User,
  ChevronDown,
} from "lucide-react";

/* Menu Type */
interface MenuItem {
  name?: string;
  path: string;
  icon: LucideIcon;
  showInMobile?: boolean;
}

/* Menu */
const menu: MenuItem[] = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, showInMobile: true },
  { name: "Users", path: "/users", icon: Users, showInMobile: true },
  { name: "Sellers", path: "/sellers", icon: Store, showInMobile: true },
  { name: "Bookings", path: "/bookings", icon: BookOpen, showInMobile: false },
  { name: "Reports", path: "/reports", icon: BarChart3, showInMobile: true },
  { name: "Settings", path: "/settings", icon: Settings, showInMobile: true },
];

export default function Navigation() {
  const pathname = usePathname();

  const [openProfile, setOpenProfile] = useState(false);
  const [openMobileProfile, setOpenMobileProfile] = useState(false);

  /* Nav Item */
  const renderItem = (item: MenuItem, mobile = false) => {
    const Icon = item.icon;
    const active = pathname === item.path;

    return (
      <Link
        key={item.path}
        href={item.path}
        className={`
          flex items-center justify-center gap-2
          transition-all duration-300
          ${
            mobile
              ? "flex-col text-[11px]"
              : "px-4 py-3 rounded-xl justify-start"
          }
          ${
            active
              ? "text-cyan-400 bg-white/5 shadow-lg"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }
        `}
      >
        <Icon size={mobile ? 22 : 20} />
        {!mobile && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col bg-[#020617] border-r border-white/10">

        {/* Brand */}
        <div className="h-20 flex items-center justify-center gap-2 border-b border-white/10">
          <Crown className="text-yellow-400" size={26} />
          <h1 className="text-xl font-bold text-white">
            CarPro Admin
          </h1>
        </div>

        {/* Profile (Desktop) */}
        <div className="relative border-b border-white/10">

          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/5"
          >
            <div className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
              A
            </div>

            <div className="flex-1 text-left">
              <p className="font-semibold text-white">Admin Panel</p>
              <span className="text-xs text-slate-400">Super Admin</span>
            </div>

            <ChevronDown
              size={18}
              className={`transition ${openProfile ? "rotate-180" : ""}`}
            />
          </button>

          {/* Desktop Dropdown */}
          {openProfile && (
            <div className="absolute left-4 right-4 top-full mt-2 bg-[#020617] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">

              <Link
                href="/admin/profile"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5"
              >
                <User size={18} /> My Profile
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5"
              >
                <Settings size={18} /> Account Settings
              </Link>

              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menu.map((item) => renderItem(item))}
        </nav>
      </aside>

      {/* ================= Mobile Bottom Bar ================= */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center md:hidden z-40">

        {menu
          .filter((item) => item.showInMobile)
          .map((item) => renderItem(item, true))}

        {/* Profile Button (Mobile) */}
        <button
          onClick={() => setOpenMobileProfile(true)}
          className="flex flex-col items-center text-slate-400 hover:text-cyan-400"
        >
          <User size={22} />
          <span className="text-[11px]">Profile</span>
        </button>
      </div>

      {/* ================= Mobile Profile Modal ================= */}
      {openMobileProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden">

          {/* Slide Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#020617] rounded-t-3xl border-t border-white/10 p-6 animate-slideUp">

            {/* Handle */}
            <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                A
              </div>

              <div>
                <p className="font-semibold text-white">Admin Panel</p>
                <span className="text-xs text-slate-400">Super Admin</span>
              </div>
            </div>

            {/* Menu */}
            <div className="space-y-3">

              <Link
                onClick={() => setOpenMobileProfile(false)}
                href="/admin/profile"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <User size={18} /> My Profile
              </Link>

              <Link
                onClick={() => setOpenMobileProfile(false)}
                href="/settings"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <Settings size={18} /> Settings
              </Link>

              <button
                onClick={() => setOpenMobileProfile(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 text-red-400"
              >
                <LogOut size={18} /> Logout
              </button>

              <button
                onClick={() => setOpenMobileProfile(false)}
                className="w-full text-center text-slate-400 mt-2"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
