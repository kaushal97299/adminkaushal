"use client";

import { usePathname } from "next/navigation";

export default function ConditionalLayout({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/access";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {nav}
      <main className="md:ml-60 w-full md:w-[calc(100vw-240px)] min-h-screen pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
