// src/app/alert/sent/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SentPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/alert/active");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="text-3xl font-bold mb-4 text-green-700">
          Alert Sent
        </div>
        <div className="text-lg text-gray-600">
          Tracking and monitoring activated
        </div>
      </div>
    </div>
  );
}