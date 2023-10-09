"use client";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AppProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/edit");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
