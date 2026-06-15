'use client';

import { useEffect, useState } from 'react';

interface AlertItem {
  id: string;
  type?: string;
  message?: string;
  status?: string;
  createdAt?: string;
}

export default function Home() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Fetch live feed items
  async function fetchAlerts() {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(Array.isArray(data) ? data : data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  // 2. Handle button clicks to trigger alerts
  async function handleTrigger(type: 'EMERGENCY' | 'SAFE') {
    setButtonLoading(true);
    setStatusMessage(`Sending ${type} request...`);
    
    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          message: type === 'EMERGENCY' 
            ? '🚨 EMERGENCY: Personal safety alert triggered!' 
            : '✅ ALL CLEAR: Everything is safe and secure.',
        }),
      });

      if (response.ok) {
        setStatusMessage(`Successfully sent ${type} notification!`);
        // Refresh the feed to show the new event log
        fetchAlerts();
      } else {
        setStatusMessage(`Failed to send: Server returned an error.`);
      }
    } catch (err) {
      setStatusMessage('Network error occurred while sending alert.');
      console.error(err);
    } finally {
      setButtonLoading(false);
      // Clear status message after 4 seconds
      setTimeout(() => setStatusMessage(''), 4000);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Personal Safety Monitor
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Live system status and webhook activity log.
          </p>
        </header>

        {/* --- CONTROL BUTTONS SECTION --- */}
        <section className="mb-8 p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={buttonLoading}
              onClick={() => handleTrigger('EMERGENCY')}
              className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 border border-red-500/20"
            >
              <span className="text-xl">🚨</span>
              <span>EMERGENCY ALERT</span>
            </button>

            <button
              disabled={buttonLoading}
              onClick={() => handleTrigger('SAFE')}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 border border-emerald-500/20"
            >
              <span className="text-xl">✅</span>
              <span>ALL CLEAR / SAFE</span>
            </button>
          </div>

          {/* Action Notification Message Status */}
          {statusMessage && (
            <p className="text-xs text-center mt-3 text-zinc-400 animate-fade-in italic">
              {statusMessage}
            </p>
          )}
        </section>
        {/* ------------------------------- */}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-300">Active Incident Feed</h2>
          
          {loading ? (
            <p className="text-sm text-gray-500 animate-pulse">Loading feed items...</p>
          ) : (!alerts || !Array.isArray(alerts) || alerts.length === 0) ? (
            <p className="text-gray-400 text-sm italic">No alerts yet.</p>
          ) : (
            alerts.map((a) => {
              const isEmergency = a?.message?.includes('EMERGENCY') || a?.message?.includes('🚨');
              
              return (
                <div 
                  key={a?.id || Math.random().toString()} 
                  className={`p-4 mb-3 rounded-lg border transition-all ${
                    isEmergency 
                      ? 'bg-red-950/30 border-red-900 text-red-200' 
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm uppercase tracking-wider text-xs">
                      {a?.type || 'Alert'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {a?.createdAt ? new Date(a.createdAt).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{a?.message || 'No message contents provided'}</p>
                  {a?.status && (
                    <span className={`inline-block mt-2 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full ${
                      a.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {a.status}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}