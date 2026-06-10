// src/app/alert/sending/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SendingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/alert/sent");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="text-center">
        <div className="text-3xl font-bold mb-4">Sending Alert…</div>
        <div className="text-lg text-gray-600">Please wait</div>
      </div>
    </div>
  );
}