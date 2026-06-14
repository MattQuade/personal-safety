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

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const data = await res.json();
          // Ensure we extract an array even if the API structure varies
          setAlerts(Array.isArray(data) ? data : data.alerts || []);
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Personal Safety Monitor
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Live system status and webhook activity log.
          </p>
        </header>

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