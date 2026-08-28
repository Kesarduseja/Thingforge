'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CheckCircle2, ShieldCheck, RefreshCw, Clock, XCircle, Send, Lock } from 'lucide-react';

export default function DecisionPortalPage() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [selectedPilotId, setSelectedPilotId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionChoice, setActionChoice] = useState<string>('PROCEED_PROCUREMENT');
  const [comments, setComments] = useState('Approved for municipal procurement scale-out based on 92/100 readiness score and 84% reduction in overflow complaints.');
  const [submitting, setSubmitting] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState('');

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pilots');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPilots(data);
        setSelectedPilotId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPilotId) return;

    if (!confirm(`Confirm final decision: ${actionChoice} for selected pilot?`)) return;

    setSubmitting(true);
    setDecisionSuccess('');

    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotId: selectedPilotId,
          action: actionChoice,
          comments,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDecisionSuccess(`Final Human Decision executed and signed into Audit Trail: ${actionChoice}`);
        setTimeout(() => {
          setDecisionSuccess('');
          fetchPilots();
        }, 2000);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Failed to record decision');
    } finally {
      setSubmitting(false);
    }
  };

  const currentPilot = pilots.find((p) => p.id === selectedPilotId);

  return (
    <AppShell activeBreadcrumb="Decisions Sign-Off">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              Procurement Decision Authority Sign-Off Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized human decision-making safeguard. Evaluates scores, evidence, and audit trails before final procurement authorization.
            </p>
          </div>
        </div>

        {pilots.length > 0 && (
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase">Select Pilot Case for Authorization:</span>
            <select
              value={selectedPilotId}
              onChange={(e) => setSelectedPilotId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium p-2 rounded-xl focus:outline-none flex-1 max-w-lg"
            >
              {pilots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.startup?.name})
                </option>
              ))}
            </select>
          </div>
        )}

        {currentPilot ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">1. AI Match Score</span>
                  <div className="text-2xl font-black text-amber-600">92%</div>
                  <p className="text-[10px] text-slate-400">Domain & Tech fit</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">2. Expert TOPSIS Score</span>
                  <div className="text-2xl font-black text-purple-700">93 / 100</div>
                  <p className="text-[10px] text-slate-400">Multi-criteria ranking</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">3. Pilot Success Score</span>
                  <div className="text-2xl font-black text-emerald-600">
                    {currentPilot.pilotSuccessScore || 88} / 100
                  </div>
                  <p className="text-[10px] text-slate-400">Milestones & KPIs</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">4. Procurement Readiness</span>
                  <div className="text-2xl font-black text-teal-600">
                    {currentPilot.procurementReadinessScore || 92} / 100
                  </div>
                  <p className="text-[10px] text-slate-400">Statutory Compliance</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Field KPI Outcomes & Evidence Summary
                </h3>
                <div className="space-y-2 text-xs">
                  {currentPilot.kpiItems?.map((k: any) => (
                    <div key={k.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-800 font-bold">{k.name}</span>
                      <span className="font-extrabold text-emerald-700">Actual: {k.actual} ({k.achievementPct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleExecuteDecision} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm sticky top-20">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Human Authority Sign-Off
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">Select final procurement decision action:</p>
                </div>

                <div className="space-y-2.5">
                  <label
                    onClick={() => setActionChoice('PROCEED_PROCUREMENT')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition text-xs ${
                      actionChoice === 'PROCEED_PROCUREMENT'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Proceed to Public Procurement</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setActionChoice('IMPROVE_ITERATE')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition text-xs ${
                      actionChoice === 'IMPROVE_ITERATE'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-amber-600" />
                      <span>2. Improve / Iterate Solution</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setActionChoice('EXTEND_PILOT')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition text-xs ${
                      actionChoice === 'EXTEND_PILOT'
                        ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold ring-2 ring-teal-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>3. Extend Pilot Duration (30 Days)</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setActionChoice('REJECT')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition text-xs ${
                      actionChoice === 'REJECT'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold ring-2 ring-rose-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>4. Reject Solution</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mandatory Justification Note *</label>
                  <textarea
                    rows={4}
                    required
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none"
                  />
                </div>

                {decisionSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{decisionSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Signing Decision...' : 'Sign & Authorize Final Human Decision'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No active pilot selected.
          </div>
        )}
      </div>
    </AppShell>
  );
}
