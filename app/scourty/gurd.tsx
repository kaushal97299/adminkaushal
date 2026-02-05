"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";


interface TokenData {
  exp: number;
}

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    // Allow login page
    if (pathname === "/access") return;

    const token = localStorage.getItem("admin_token");

    // No token → login
    if (!token) {
      router.replace("/access");
      return;
    }

    try {
      const decoded: TokenData = jwtDecode(token);

      const now = Date.now() / 1000;

      // Expired → logout
      if (decoded.exp < now) {
        localStorage.removeItem("admin_token");
        router.replace("/access");
      }

    } catch {
      localStorage.removeItem("admin_token");
      router.replace("/access");
    }

  }, [router, pathname]);

  return <>{children}</>;
}
