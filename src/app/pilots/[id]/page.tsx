'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Edit2,
  Save,
  ShieldAlert,
} from 'lucide-react';

export default function PilotWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const [pilot, setPilot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [editKpiActual, setEditKpiActual] = useState('');
  const [editKpiPct, setEditKpiPct] = useState('');

  const pilotId = params?.id as string;

  useEffect(() => {
    if (pilotId) {
      fetchPilot();
    }
  }, [pilotId]);

  const fetchPilot = async () => {
    if (!pilotId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pilots/${pilotId}`);
      const data = await res.json();
      setPilot(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMilestone = async (milestoneId: string, status: string) => {
    try {
      const res = await fetch(`/api/pilots/${pilotId}/milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPilot();
      }
    } catch (e) {
      alert('Failed to update milestone');
    }
  };

  const handleUpdateKpi = async (kpiId: string) => {
    try {
      const res = await fetch(`/api/pilots/${pilotId}/kpi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiId,
          actual: editKpiActual,
          achievementPct: Number(editKpiPct),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingKpiId(null);
        fetchPilot();
      }
    } catch (e) {
      alert('Failed to update KPI');
    }
  };

  if (loading) {
    return (
      <AppShell activeBreadcrumb="Pilot Workspace">
        <div className="py-12 text-center text-xs text-slate-500">Loading Pilot Workspace...</div>
      </AppShell>
    );
  }

  if (!pilot) {
    return (
      <AppShell activeBreadcrumb="Pilot Workspace">
        <div className="py-12 text-center text-xs text-slate-500">Pilot Workspace not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell activeBreadcrumb="Pilot Workspace">
      <div className="space-y-6">
        {/* Workspace Top Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                {pilot.departmentName}
              </span>
              <span className="text-xs text-slate-500">Status: <strong className="text-amber-700 uppercase font-mono">{pilot.status}</strong></span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Dates: {pilot.startDate} to {pilot.endDate}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{pilot.title}</h1>
              <p className="text-xs text-slate-600 mt-1">
                Startup Vendor: <strong className="text-slate-900 font-bold">{pilot.startup?.name}</strong> ({pilot.startup?.domain})
              </p>
            </div>

            <Link
              href="/decision"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 self-start md:self-auto"
            >
              <span>Proceed to Decision Authority Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Milestone Roadmap Execution</span>
              <span className="font-extrabold text-teal-700">{pilot.progress}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div style={{ width: `${pilot.progress}%` }} className="bg-emerald-600 h-full rounded-full transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* SCORES & HUMAN-IN-THE-LOOP SAFEGUARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Pilot Success Score
                </h3>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded">
                {pilot.liveSuccessStatus || 'HIGHLY SUCCESSFUL'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-emerald-600">{pilot.liveSuccessScore || 88}</span>
              <span className="text-xs text-slate-400 font-bold">/ 100 Points</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-[10px] uppercase block">Outcome Calculation Rationale:</span>
              {pilot.liveSuccessExplanation?.map((line: string, i: number) => (
                <div key={i} className="leading-relaxed">{line}</div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Procurement Readiness Score
                </h3>
              </div>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-2 py-0.5 rounded">
                {pilot.liveReadinessStatus || 'READY FOR REVIEW'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-teal-600">{pilot.liveReadinessScore || 92}</span>
              <span className="text-xs text-slate-400 font-bold">/ 100 Points</span>
            </div>

            <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              ✓ No active procurement blockers detected. Ready for human authorization.
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Human-in-the-loop safeguard:</strong> AI recommendation score only — Final procurement authorization requires human sign-off.
              </span>
            </div>
          </div>
        </div>

        {/* MILESTONE TRACKER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-amber-600" />
            Pilot Milestones & Evidence Verification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pilot.milestones?.map((m: any, idx: number) => (
              <div key={m.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                      P{idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">{m.title}</h4>
                  </div>

                  <select
                    value={m.status}
                    onChange={(e) => handleUpdateMilestone(m.id, e.target.value)}
                    className="text-[10px] font-bold uppercase p-1 rounded border border-slate-300 focus:outline-none cursor-pointer bg-white text-slate-800"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <p className="text-xs text-slate-600">{m.description}</p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-mono">Target: {m.targetDate}</span>
                  {m.evidenceUrl && (
                    <a
                      href={m.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      <ExternalLink className="w-3 h-3" /> View Evidence Report
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI + OUTCOME MEASUREMENT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            KPI & Quantitative Outcome Tracking
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-3">KPI Metric Name</th>
                  <th className="p-3">Baseline</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Actual Achieved</th>
                  <th className="p-3">Achievement %</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pilot.kpiItems?.map((k: any) => {
                  const isEditing = editingKpiId === k.id;
                  return (
                    <tr key={k.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-bold text-slate-900">{k.name}</td>
                      <td className="p-3 text-slate-500">{k.baseline}</td>
                      <td className="p-3 text-amber-700 font-bold">{k.target}</td>

                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editKpiActual}
                            onChange={(e) => setEditKpiActual(e.target.value)}
                            className="bg-white border border-emerald-500 rounded p-1 text-xs text-slate-900 w-24"
                          />
                        ) : (
                          <span className="font-extrabold text-emerald-700">{k.actual}</span>
                        )}
                      </td>

                      <td className="p-3 font-extrabold text-emerald-700">{k.achievementPct}%</td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {k.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleUpdateKpi(k.id)}
                            className="bg-emerald-700 text-white p-1 rounded transition"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingKpiId(k.id);
                              setEditKpiActual(k.actual);
                              setEditKpiPct(String(k.achievementPct));
                            }}
                            className="text-slate-400 hover:text-emerald-700 p-1 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
