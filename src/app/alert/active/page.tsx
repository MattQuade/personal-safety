// src/app/alert/active/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function ActiveAlertPage() {
  const [status, setStatus] = useState<string>("loading");
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/alert/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setLocation(data.lastKnownLocation);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Active Alert</h1>

      <div className="mb-6">
        <div className="text-xl font-semibold">Status:</div>
        <div className="text-2xl">{status}</div>
      </div>

      <div>
        <div className="text-xl font-semibold">Last Known Location:</div>
        {location ? (
          <div className="mt-2">
            <div>Latitude: {location.lat}</div>
            <div>Longitude: {location.lng}</div>
            <div className="text-gray-500 text-sm">
              Updated: {new Date(location.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 mt-2">No location yet</div>
        )}
      </div>
    </div>
  );
}