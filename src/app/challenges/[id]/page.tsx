'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import {
  Building2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  ArrowRight,
  ShieldCheck,
  Play,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function SingleChallengePage() {
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [expandingWhy, setExpandingWhy] = useState<string | null>(null);

  const challengeId = params?.id as string;

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    if (!challengeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/challenges/${challengeId}`);
      const data = await res.json();
      setChallenge(data);
      if (data?.matches?.[0]) {
        setSelectedStartup(data.matches[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchPilot = async (startupId: string) => {
    if (!confirm('Launch official 60-Day Field Pilot Workspace for this startup?')) return;
    try {
      const res = await fetch('/api/pilots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          startupId,
          departmentName: challenge.departmentName,
          title: `PRAMAN Pilot: ${challenge.title}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/pilots/${data.pilot.id}`);
      } else {
        alert('Error initiating pilot: ' + data.error);
      }
    } catch (e) {
      alert('Failed to launch pilot workspace');
    }
  };

  if (loading) {
    return (
      <AppShell activeBreadcrumb="Matching & Ranking">
        <div className="py-12 text-center text-xs text-slate-500">Loading Problem & AI Match Engine...</div>
      </AppShell>
    );
  }

  if (!challenge) {
    return (
      <AppShell activeBreadcrumb="Matching & Ranking">
        <div className="py-12 text-center text-xs text-slate-500">Problem not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell activeBreadcrumb="Matching & Ranking">
      <div className="space-y-6">
        {/* Top Problem Detail Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                {challenge.domain}
              </span>
              <span className="text-xs text-slate-500">Status: <strong className="text-slate-900 uppercase font-mono">{challenge.status}</strong></span>
            </div>
            <span className="text-xs text-slate-500">Department: <strong className="text-slate-800 font-bold">{challenge.departmentName}</strong></span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{challenge.title}</h1>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong className="text-slate-900">Problem Statement:</strong> {challenge.problemDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block font-semibold">Tech Stack Required</span>
              <span className="font-bold text-slate-800">{challenge.requiredTechnologies}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block font-semibold">Budget Range</span>
              <span className="font-bold text-emerald-700">{challenge.budgetRange}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block font-semibold">Pilot Duration</span>
              <span className="font-bold text-amber-700">{challenge.pilotDuration}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block font-semibold">Location</span>
              <span className="font-bold text-slate-800">{challenge.location}</span>
            </div>
          </div>
        </div>

        {/* AI MATCHING & ELIGIBILITY SCREENING */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                AI-Assisted Startup Matching & Ranking
              </h2>
              <p className="text-xs text-slate-500">
                Explainable multi-factor scoring engine comparing challenge parameters against startup capabilities.
              </p>
            </div>

            <Link
              href="/evaluations"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>Go to Expert Evaluation</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Ranked List */}
            <div className="lg:col-span-7 space-y-3">
              {challenge.matches && challenge.matches.length > 0 ? (
                challenge.matches.map((m: any, index: number) => {
                  const isSelected = selectedStartup?.id === m.id;
                  const isExpanded = expandingWhy === m.id;
                  const st = m.startup;

                  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
                  if (m.totalScore < 60) badgeColor = 'bg-rose-50 text-rose-700 border-rose-300';
                  else if (m.totalScore < 75) badgeColor = 'bg-amber-50 text-amber-700 border-amber-300';

                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedStartup(m)}
                      className={`cursor-pointer bg-white border ${
                        isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                      } rounded-2xl p-4 transition space-y-3 shadow-sm`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{st.name}</h4>
                            <p className="text-[11px] text-slate-500">{st.domain} • {st.location}</p>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl border font-extrabold text-sm ${badgeColor}`}>
                          <span>{m.totalScore}% Match</span>
                        </div>
                      </div>

                      {/* Score Breakdown Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>Domain: {m.domainScore}/25</span>
                          <span>Tech: {m.techScore}/25</span>
                          <span>Eligibility: {m.eligibilityScore}/20</span>
                          <span>Exp: {m.experienceScore}/15</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div style={{ width: `${(m.domainScore / 25) * 25}%` }} className="bg-emerald-600" />
                          <div style={{ width: `${(m.techScore / 25) * 25}%` }} className="bg-amber-500" />
                          <div style={{ width: `${(m.eligibilityScore / 20) * 20}%` }} className="bg-teal-500" />
                          <div style={{ width: `${(m.experienceScore / 15) * 15}%` }} className="bg-purple-600" />
                        </div>
                      </div>

                      {/* Eligibility Status & Explanation Toggle */}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className="text-slate-400">Statutory Verification:</span>
                          {m.eligibilityStatus === 'ELIGIBLE' && (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                            </span>
                          )}
                          {m.eligibilityStatus === 'NEEDS_VERIFICATION' && (
                            <span className="text-amber-700 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Needs Verification
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandingWhy(isExpanded ? null : m.id);
                          }}
                          className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>{isExpanded ? 'Hide Rationale' : 'Explain WHY'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Expandable WHY Explanation */}
                      {isExpanded && (
                        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs space-y-2 mt-2">
                          <h5 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                            Match Scoring Rationale & Algorithm Breakdown:
                          </h5>
                          <pre className="font-sans whitespace-pre-wrap text-slate-300 text-[11px] leading-relaxed">
                            {m.whyExplanation}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
                  No matching startups evaluated yet.
                </div>
              )}
            </div>

            {/* Right Column: Detailed Startup Profile & Pilot Launch CTA */}
            <div className="lg:col-span-5 space-y-4">
              {selectedStartup ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 sticky top-20 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-700 font-bold">{selectedStartup.startup.domain}</span>
                      <span className="text-xs text-slate-400 font-mono">{selectedStartup.startup.stage}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedStartup.startup.name}</h3>
                    <p className="text-xs text-slate-600">{selectedStartup.startup.description}</p>
                  </div>

                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                      Proposed Solution Architecture:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedStartup.startup.solutionDescription}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                      Statutory Compliance Audit:
                    </h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500">DIPP Recognized:</span>
                        <span className="font-bold text-slate-800">{selectedStartup.startup.certifications}</span>
                      </div>
                      <div className="flex justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500">Operating History:</span>
                        <span className="font-bold text-slate-800">{selectedStartup.startup.yearsOperating} Years</span>
                      </div>
                      <div className="flex justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500">Compliance Status:</span>
                        <span className="font-bold text-emerald-700">{selectedStartup.startup.complianceStatus}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchPilot(selectedStartup.startup.id)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Select for Pilot & Launch Workspace</span>
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
                  Select a startup to view audit details.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
