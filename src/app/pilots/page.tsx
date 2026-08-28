'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { FileText, ArrowRight } from 'lucide-react';

export default function PilotsPage() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pilots');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPilots(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell activeBreadcrumb="Pilot Workspaces">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-600" />
              Pilot Workspaces Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active field pilots tracking milestone execution, KPI evidence, and outcome measurement.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading pilot workspaces...</div>
        ) : pilots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pilots.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 hover:border-teal-500/50 p-6 rounded-2xl space-y-4 transition flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-700 font-bold">{p.departmentName}</span>
                    <span className="text-xs font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-600">Startup: <strong className="text-slate-900 font-bold">{p.startup.name}</strong></p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Pilot Execution Progress</span>
                      <span className="font-extrabold text-teal-700">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${p.progress}%` }} className="bg-teal-600 h-full rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <div>Success Score: <strong className="text-emerald-700 font-bold">{p.pilotSuccessScore || 88}/100</strong></div>
                    <div>Procurement Readiness: <strong className="text-teal-700 font-bold">{p.procurementReadinessScore || 92}/100</strong></div>
                  </div>

                  <Link
                    href={`/pilots/${p.id}`}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Pilot Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No active pilots found.
          </div>
        )}
      </div>
    </AppShell>
  );
}
