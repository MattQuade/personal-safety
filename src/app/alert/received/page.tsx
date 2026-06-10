// src/app/alert/received/page.tsx

"use client";

import { useState } from "react";

export default function ReceivedPage() {
  const [ack, setAck] = useState(false);

  async function acknowledge() {
    await fetch("/api/alert/acknowledge", { method: "POST" });
    setAck(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Emergency Alert Received</h1>
        <p className="text-gray-700 mb-6">
          Matt has triggered a safety alert. Please acknowledge that you have
          seen this message.
        </p>

        {!ack ? (
          <button
            onClick={acknowledge}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700"
          >
            Acknowledge Alert
          </button>
        ) : (
          <div className="text-green-700 text-xl font-bold">
            Alert Acknowledged
          </div>
        )}
      </div>
    </div>
  );
}