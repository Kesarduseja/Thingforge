'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { RefreshCw, Building2, MapPin, CheckCircle2, Send } from 'lucide-react';

export default function ScaleReusePage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposedMsg, setProposedMsg] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reuse');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOpportunities(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateProposal = (opp: any) => {
    setProposedMsg(`Cross-department adoption proposal dispatched to ${opp.targetDept} (${opp.targetCity})!`);
    setTimeout(() => setProposedMsg(''), 2500);
  };

  return (
    <AppShell activeBreadcrumb="Handoff & Scale">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-emerald-600" />
                Scale & Cross-Department Solution Reuse
              </h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                RECOMMENDED FOR REUSE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated cross-department discovery engine matching proven, pilot-verified solutions to cities with identical problem statements.
            </p>
          </div>
        </div>

        {proposedMsg && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-bounce shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{proposedMsg}</span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-700">Proven Pilot Solution</span>
            <h2 className="text-xl font-extrabold text-slate-900">AI-Enabled Solid Waste Collection & Dynamic Dispatch System</h2>
            <p className="text-xs text-slate-600">
              Verified Startup: <strong className="text-slate-900 font-bold">EcoSmart Waste Tech</strong> • Origin: <strong className="text-slate-800">Urban Development & Municipal Affairs Dept</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Pilot Success Score</span>
              <span className="font-extrabold text-emerald-700 text-sm">88 / 100</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Procurement Readiness</span>
              <span className="font-extrabold text-teal-700 text-sm">92 / 100</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Complaint Reduction</span>
              <span className="font-extrabold text-emerald-700 text-sm">-84%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Fuel Savings</span>
              <span className="font-extrabold text-amber-700 text-sm">28.5%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Potential Target Departments & Cities with Similar Challenges
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Scanning municipal challenges...</div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white border border-slate-200 hover:border-emerald-500/50 p-5 rounded-2xl space-y-4 transition flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {opp.targetCity}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                        {opp.similarityScore}% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800">{opp.targetDept}</h4>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        Similarity Explanation:
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {opp.matchingReason}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInitiateProposal(opp)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Initiate Fast-Track Reuse Proposal</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
              No cross-department reuse recommendations found.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
