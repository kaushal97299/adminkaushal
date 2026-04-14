"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

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
  ShieldAlert
} from "lucide-react";

interface MenuItem {
  name?: string;
  path: string;
  icon: LucideIcon;
  showInMobile?: boolean;
}

const menu: MenuItem[] = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, showInMobile: true },
  { name: "Users", path: "/users", icon: Users, showInMobile: true },
  { name: "Sellers", path: "/sellers", icon: Store, showInMobile: true },
  { name: "Inventory", path: "/inventory", icon: Store, showInMobile: true   },
  { name: "Contact", path: "/contact", icon: BookOpen, showInMobile: false },
  { name: "Reports", path: "/reports", icon: BarChart3, showInMobile: true },
  { name: "Settings", path: "/settings", icon: Settings, showInMobile: false },
  { name: "Admin Claims", path: "/adminclaims", icon: ShieldAlert, showInMobile: true },
];

export default function Navigation() {

  const pathname = usePathname();
  const router = useRouter();

  const [openProfile,setOpenProfile] = useState(false);
  const [openMobileProfile,setOpenMobileProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/access");
  };

  const renderItem = (item:MenuItem,mobile=false)=>{

    const Icon = item.icon;
    const active = pathname === item.path;

    return(

      <Link
        key={item.path}
        href={item.path}
        className={`
        flex items-center gap-3
        transition-all duration-200
        ${
          mobile
          ? "flex-col text-[11px]"
          : "px-4 py-2.5 rounded-lg"
        }
        ${
          active
          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
        }
        `}
      >

        <Icon size={mobile ? 22 : 18}/>

        {!mobile && (
          <span className="text-sm font-medium">
            {item.name}
          </span>
        )}

      </Link>

    );

  };

  return(

<>
{/* ================= Desktop Sidebar ================= */}

<aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-[#020617] border-r border-white/10 z-30">

{/* BRAND */}

<div className="h-16 flex items-center justify-center gap-2 border-b border-white/10">

<Crown className="text-yellow-400" size={22}/>

<h1 className="text-lg font-semibold text-white">
CarPro Admin
</h1>

</div>


{/* PROFILE */}

<div className="relative border-b border-white/10">

<button
onClick={()=>setOpenProfile(!openProfile)}
className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5"
>

<div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
A
</div>

<div className="flex-1 text-left">

<p className="text-sm font-semibold text-white">
Admin Panel
</p>

<span className="text-xs text-slate-400">
Super Admin
</span>

</div>

<ChevronDown
size={16}
className={`transition ${openProfile ? "rotate-180" : ""}`}
/>

</button>


{/* DROPDOWN */}

{openProfile &&(

<div className="absolute left-3 right-3 top-full mt-2 bg-[#020617] border border-white/10 rounded-lg shadow-xl overflow-hidden">

<Link
href="/admin/profile"
className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-400 hover:bg-white/5"
>
<User size={16}/> My Profile
</Link>

<Link
href="/settings"
className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-400 hover:bg-white/5"
>
<Settings size={16}/> Account Settings
</Link>

<button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
<LogOut size={16}/> Logout
</button>

</div>

)}

</div>


{/* MENU */}

<nav className="flex-1 px-3 py-4 space-y-1.5">

{menu.map((item)=>renderItem(item))}

</nav>

</aside>


{/* ================= Mobile Bottom Bar ================= */}

<div className="fixed bottom-0 left-0 w-full h-16 bg-[#020617]/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center md:hidden z-40">

{menu
.filter((item)=>item.showInMobile)
.map((item)=>renderItem(item,true))}

<button
onClick={()=>setOpenMobileProfile(true)}
className="flex flex-col items-center text-slate-400 hover:text-cyan-400"
>

<User size={22}/>

<span className="text-[11px]">
Profile
</span>

</button>

</div>


{/* ================= Mobile Profile ================= */}

{openMobileProfile &&(

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden">

<div className="absolute bottom-0 left-0 right-0 bg-[#020617] rounded-t-3xl border-t border-white/10 p-6">

<div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4"/>

<div className="flex items-center gap-3 mb-6">

<div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
A
</div>

<div>
<p className="font-semibold text-white">
Admin Panel
</p>
<span className="text-xs text-slate-400">
Super Admin
</span>
</div>

</div>

<div className="space-y-3">

<Link
onClick={()=>setOpenMobileProfile(false)}
href="/admin/profile"
className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10"
>
<User size={18}/> My Profile
</Link>

<Link
onClick={()=>setOpenMobileProfile(false)}
href="/settings"
className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10"
>
<Settings size={18}/> Settings
</Link>

<button
onClick={handleLogout}
className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 text-red-400"
>
<LogOut size={18}/> Logout
</button>

</div>

</div>

</div>

)}

</>

);

}