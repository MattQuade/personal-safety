'use client';

import { useEffect, useState } from 'react';

type Alert = {
  id: number;
  created_at: string;
  status: 'pending' | 'acknowledged' | 'cancelled';
  message: string | null;
  location: string | null;
};

export default function HomePage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAlerts() {
    try {
      const res = await fetch('/api/alerts', { cache: 'no-store' });
      const data = await res.json();
      setAlerts(data);
    } catch {
      setError('Failed to load alerts');
    }
  }

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  async function sendAlert() {
    setSending(true);
    setError(null);

    let location: string | null = null;

    if ('geolocation' in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        location = `lat=${pos.coords.latitude},lng=${pos.coords.longitude}`;
      } catch {}
    }

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Emergency alert triggered',
          location,
        }),
      });
      await loadAlerts();
    } catch {
      setError('Failed to send alert');
    } finally {
      setSending(false);
    }
  }

  async function updateAlert(id: number, action: 'acknowledge' | 'cancel') {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      await loadAlerts();
    } catch {
      setError('Failed to update alert');
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Personal Safety Alert</h1>

      {error && (
        <div className="bg-red-700 p-3 rounded mb-4 w-full max-w-lg text-center">
          {error}
        </div>
      )}

      <button
        onClick={sendAlert}
        disabled={sending}
        className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-bold text-xl py-6 px-10 rounded-xl w-full max-w-lg mb-8"
      >
        {sending ? 'Sending…' : 'SEND EMERGENCY ALERT'}
      </button>

      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Recent Alerts</h2>

        {alerts.length === 0 && (
          <p className="text-gray-400">No alerts yet.</p>
        )}

        <ul className="space-y-3">
          {alerts.map((a) => (
            <li
              key={a.id}
              className="bg-gray-900 p-4 rounded border border-gray-700"
            >
              <div className="flex justify-between">
                <strong>#{a.id} — {a.status.toUpperCase()}</strong>
                <span className="text-gray-400 text-sm">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </div>

              {a.location && (
                <div className="text-gray-400 text-sm mt-1">
                  Location: {a.location}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateAlert(a.id, 'acknowledge')}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => updateAlert(a.id, 'cancel')}
                  className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}