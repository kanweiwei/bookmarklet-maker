"use client";

import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={64} className="animate-spin" />
      </div>
    </main>
  );
}
