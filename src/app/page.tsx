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
  const [sendingEmergency, setSendingEmergency] = useState(false);
  const [sendingSafe, setSendingSafe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMsg, setDebugMsg] = useState("Location: Waiting...");

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

  // ==================== IMPROVED LOCATION FUNCTION ====================
  async function getCurrentLocation(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setDebugMsg("❌ Geolocation not supported by browser");
        resolve(null);
        return;
      }

      setDebugMsg("🔄 Requesting location...");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = `lat=${pos.coords.latitude.toFixed(5)}, lng=${pos.coords.longitude.toFixed(5)}`;
          setDebugMsg(`✅ Location captured: ${loc}`);
          resolve(loc);
        },
        (err) => {
          const errorMsg = `❌ Failed (${err.code}): ${err.message}`;
          setDebugMsg(errorMsg);
          console.error(errorMsg);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }

  async function sendAlert() {
    if (sendingEmergency) return;
    setSendingEmergency(true);
    setError(null);

    const location = await getCurrentLocation();

    const message = `🚨 EMERGENCY ALERT\nMatt has triggered a safety alert.\nLocation: ${location || 'Unknown'}${location ? `\nMap: https://maps.google.com/?q=${location.replace('lat=', '').replace(', lng=', ',')}` : ''}`;

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, location }),
      });

      await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: process.env.NEXT_PUBLIC_TEST_PHONE_NUMBER, message }),
      });

      await loadAlerts();
    } catch {
      setError('Failed to send emergency alert');
    } finally {
      setSendingEmergency(false);
    }
  }

  async function sendSafe() {
    if (sendingSafe) return;
    setSendingSafe(true);
    setError(null);

    const location = await getCurrentLocation();

    const message = `✅ SAFE CHECK-IN\nMatt is OK - arrived safely.\nLocation: ${location || 'Unknown'}${location ? `\nMap: https://maps.google.com/?q=${location.replace('lat=', '').replace(', lng=', ',')}` : ''}`;

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, location }),
      });

      await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: process.env.NEXT_PUBLIC_TEST_PHONE_NUMBER, message }),
      });

      await loadAlerts();
    } catch {
      setError('Failed to send safe status');
    } finally {
      setSendingSafe(false);
    }
  }

  // ... (rest of your updateAlert and clearAllAlerts functions stay the same)

  async function updateAlert(id: number, action: 'acknowledge' | 'cancel' | 'delete') {
    try {
      if (action === 'delete') {
        await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/alerts/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      }
      await loadAlerts();
    } catch {
      setError('Failed to update alert');
    }
  }

  async function clearAllAlerts() {
    if (!confirm('Clear ALL alerts?')) return;
    try {
      await fetch('/api/alerts/clear', { method: 'POST' });
      await loadAlerts();
    } catch {
      setError('Failed to clear alerts');
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Personal Safety Alert</h1>

      {error && <div className="bg-red-700 p-4 rounded mb-6 text-center">{error}</div>}

      <div className="bg-gray-900 p-3 rounded mb-6 w-full max-w-lg text-sm text-center">
        {debugMsg}
      </div>

      <button onClick={sendAlert} disabled={sendingEmergency} className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 w-full max-w-lg py-8 text-2xl font-bold rounded-2xl mb-6">
        {sendingEmergency ? 'Sending Emergency...' : '🚨 SEND EMERGENCY ALERT'}
      </button>

      <button onClick={sendSafe} disabled={sendingSafe} className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 w-full max-w-lg py-8 text-2xl font-bold rounded-2xl mb-10">
        {sendingSafe ? 'Sending Safe Status...' : "✅ I'VE ARRIVED - I'M OK"}
      </button>

      {/* Rest of your UI (Recent Alerts, buttons, etc.) remains the same */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Alerts</h2>
        {alerts.length > 0 && (
          <button onClick={clearAllAlerts} className="text-red-400 hover:text-red-500 text-sm">
            Clear All
          </button>
        )}
      </div>

      {alerts.length === 0 && <p className="text-gray-400">No alerts yet.</p>}

      {alerts.map((a) => {
        const isEmergency = a.message?.includes('EMERGENCY') || a.message?.includes('🚨');
        return (
          <li key={a.id} className={`p-5 rounded-xl mb-4 border w-full max-w-lg ${
            isEmergency ? 'bg-red-950 border-red-800' : 'bg-gray-900 border-gray-700'
          }`}>
            <div className="flex justify-between mb-2">
              <strong className={isEmergency ? 'text-red-400' : 'text-green-400'}>
                #{a.id} — {a.status.toUpperCase()}
              </strong>
              <span className="text-gray-400 text-sm">
                {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
            <div className="text-lg mb-1">{a.message}</div>
            {a.location && <div className="text-sm text-gray-400 mb-2">📍 {a.location}</div>}
          </li>
        );
      })}
    </main>
  );
}