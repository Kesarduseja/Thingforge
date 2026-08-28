'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Award, Sliders, Save, CheckCircle2 } from 'lucide-react';

export default function ExpertEvaluationPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
  const [selectedStartupId, setSelectedStartupId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [scores, setScores] = useState({
    technicalFeasibility: 22,
    innovation: 18,
    costEffectiveness: 14,
    scalability: 13,
    publicImpact: 14,
    implementationReadiness: 9,
    comments: 'Strong ultrasonic hardware longevity paired with dynamic routing GIS engine.',
  });

  const totalWeightedScore =
    scores.technicalFeasibility +
    scores.innovation +
    scores.costEffectiveness +
    scores.scalability +
    scores.publicImpact +
    scores.implementationReadiness;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resE, resC] = await Promise.all([
        fetch('/api/evaluations'),
        fetch('/api/challenges'),
      ]);
      const dataE = await resE.json();
      const dataC = await resC.json();

      setEvaluations(dataE);
      setChallenges(dataC);

      if (dataC?.[0]) {
        setSelectedChallengeId(dataC[0].id);
        if (dataC[0].matches?.[0]) {
          setSelectedStartupId(dataC[0].matches[0].startupId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (field: string, val: number) => {
    setScores({ ...scores, [field]: val });
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId || !selectedStartupId) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallengeId,
          startupId: selectedStartupId,
          ...scores,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Evaluation score (${totalWeightedScore}/100) recorded successfully!`);
        setTimeout(() => {
          setSuccessMsg('');
          fetchInitialData();
        }, 1500);
      } else {
        alert('Error saving evaluation: ' + data.error);
      }
    } catch (e) {
      alert('Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const currentChallenge = challenges.find((c) => c.id === selectedChallengeId);

  return (
    <AppShell activeBreadcrumb="Expert Evaluation">
      <div className="space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-700" />
              Expert Evaluation & TOPSIS Scoring Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-criteria decision analysis engine for objective domain expert evaluation.
            </p>
          </div>
        </div>

        {/* Challenge Selection Switcher */}
        {challenges.length > 0 && (
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase">Select Target Problem Statement:</span>
            <select
              value={selectedChallengeId}
              onChange={(e) => {
                setSelectedChallengeId(e.target.value);
                const ch = challenges.find((c) => c.id === e.target.value);
                if (ch?.matches?.[0]) setSelectedStartupId(ch.matches[0].startupId);
              }}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium p-2.5 rounded-xl focus:outline-none flex-1 max-w-lg"
            >
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.departmentName})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 2-Column Evaluation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmitEvaluation} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-700" />
                    Weighted Criteria Scoring Matrix
                  </h3>
                  <p className="text-xs text-slate-500">Total Weight Sum = 100 Points</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Score</span>
                  <span className="text-2xl font-black text-purple-700">{totalWeightedScore}/100</span>
                </div>
              </div>

              {/* Startup Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Target Startup *</label>
                <select
                  value={selectedStartupId}
                  onChange={(e) => setSelectedStartupId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium p-2.5 rounded-xl focus:outline-none"
                >
                  {currentChallenge?.matches?.map((m: any) => (
                    <option key={m.startupId} value={m.startupId}>
                      {m.startup.name} (AI Match: {m.totalScore}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">1. Technical Feasibility (Weight: 25%)</span>
                    <span className="font-extrabold text-blue-700">{scores.technicalFeasibility} / 25 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    value={scores.technicalFeasibility}
                    onChange={(e) => handleScoreChange('technicalFeasibility', Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">2. Innovation & Novelty (Weight: 20%)</span>
                    <span className="font-extrabold text-purple-700">{scores.innovation} / 20 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={scores.innovation}
                    onChange={(e) => handleScoreChange('innovation', Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">3. Cost Effectiveness (Weight: 15%)</span>
                    <span className="font-extrabold text-emerald-700">{scores.costEffectiveness} / 15 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={scores.costEffectiveness}
                    onChange={(e) => handleScoreChange('costEffectiveness', Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">4. Multi-Zone Scalability (Weight: 15%)</span>
                    <span className="font-extrabold text-amber-700">{scores.scalability} / 15 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={scores.scalability}
                    onChange={(e) => handleScoreChange('scalability', Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">5. Social & Environmental Impact (Weight: 15%)</span>
                    <span className="font-extrabold text-teal-700">{scores.publicImpact} / 15 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={scores.publicImpact}
                    onChange={(e) => handleScoreChange('publicImpact', Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">6. Field Deployment Readiness (Weight: 10%)</span>
                    <span className="font-extrabold text-cyan-700">{scores.implementationReadiness} / 10 pts</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={scores.implementationReadiness}
                    onChange={(e) => handleScoreChange('implementationReadiness', Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Qualitative Expert Rationale *</label>
                <textarea
                  rows={3}
                  value={scores.comments}
                  onChange={(e) => setScores({ ...scores, comments: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none"
                />
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Recording Score...' : 'Submit Expert Evaluation Score'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Evaluated Candidates Matrix
            </h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
              {evaluations.length > 0 ? (
                evaluations.map((ev, idx) => (
                  <div key={ev.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">#{idx + 1} {ev.startup.name}</span>
                      <span className="font-black text-sm text-purple-700">{ev.totalScore}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{ev.comments}"</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">No evaluations recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
