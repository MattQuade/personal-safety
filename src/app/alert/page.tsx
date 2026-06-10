// src/app/alert/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AlertPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function sendAlert() {
    setLoading(true);

    try {
      await fetch("/api/alert/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+61416619600",
          message: "⚠️ EMERGENCY ALERT: Matt has triggered a safety alert.",
        }),
      });

      router.push("/alert/sending");
    } catch (err) {
      alert("Failed to send alert.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <button
        onClick={sendAlert}
        disabled={loading}
        className="bg-red-600 text-white text-3xl font-bold px-12 py-12 rounded-full shadow-xl hover:bg-red-700 active:scale-95 transition"
      >
        {loading ? "Sending..." : "SEND ALERT"}
      </button>
    </div>
  );
}