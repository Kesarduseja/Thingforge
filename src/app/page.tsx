'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import {
  Play,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Zap,
  Star,
  FastForward,
  BarChart3,
  Building2,
  Rocket,
  ShieldCheck,
  FileText,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function CommandCenterDashboard() {
  const [heroLoaded, setHeroLoaded] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [challenge, setChallenge] = useState<any>(null);
  const [pilot, setPilot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resC, resP] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/pilots'),
      ]);
      const dataC = await resC.json();
      const dataP = await resP.json();

      if (Array.isArray(dataC) && dataC.length > 0) {
        setChallenge(dataC[0]);
      }
      if (Array.isArray(dataP) && dataP.length > 0) {
        setPilot(dataP[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = (stepNum: number, notice: string) => {
    setCurrentStep(stepNum);
    setActionNotice(notice);
    setTimeout(() => setActionNotice(''), 2500);
  };

  const steps = [
    { num: 1, label: 'Problem #1042' },
    { num: 2, label: 'Structuring' },
    { num: 3, label: 'Matching' },
    { num: 4, label: 'Pilot' },
    { num: 5, label: 'Readiness' },
    { num: 6, label: 'Handoff' },
    { num: 7, label: 'Scale' },
  ];

  return (
    <AppShell activeBreadcrumb="Dashboard">
      <div className="space-y-6">
        {/* Top Hero Header matching Screenshot 2 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>EVIDENCE-DRIVEN INNOVATION PROCUREMENT</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold font-mono">
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 uppercase">
                DEMO MODE
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">
                SIMULATED DATA
              </span>
              <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200 uppercase">
                READY CHECK PENDING
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              From Government Problem to <span className="text-emerald-600">Evidence-Ready Procurement</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Decision support only — final procurement remains with authorized government officials.
            </p>
          </div>

          {/* 7-Step Horizontal Process Bar matching Screenshot 2 */}
          <div className="flex overflow-x-auto items-center gap-1.5 py-2 scrollbar-none border-t border-slate-100 pt-4">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              return (
                <div key={s.num} className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setCurrentStep(s.num)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{s.num}</span>
                    <span>{s.label}</span>
                  </button>
                  {s.num < 7 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                </div>
              );
            })}
          </div>
        </div>

        {actionNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 2-Column Dashboard Layout matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Launch Judge Demo Panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <h2>Launch Judge Demo</h2>
              </div>

              {/* Green Intro Card */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  ✨
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Judge-ready demonstration</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Load the hero scenario and move through the complete procurement lifecycle.
                  </div>
                </div>
              </div>

              {/* 2-Column Action Buttons Grid matching Screenshot 2 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setHeroLoaded(true);
                    triggerAction(1, 'Loaded Hero Scenario: Urban Solid Waste Collection AI Optimization');
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-3 rounded-xl shadow-md shadow-emerald-800/20 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Load Hero Scenario</span>
                </button>

                <button
                  onClick={() => {
                    setHeroLoaded(false);
                    triggerAction(1, 'Demo dataset reset to initial state');
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Hero Demo</span>
                </button>

                <button
                  onClick={() => triggerAction(2, 'Structured requirement specs & KPIs using PRAMAN AI')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Structure with PRAMAN AI</span>
                </button>

                <button
                  onClick={() => triggerAction(2, 'Requirement approved by Urban Development Dept')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approve Requirement</span>
                </button>

                <button
                  onClick={() => triggerAction(3, 'Evaluated AI match across 8 startups. Top match: EcoSmart (92%)')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Run Match Engine</span>
                </button>

                <button
                  onClick={() => triggerAction(3, 'Shortlisted EcoSmart Waste Tech (#1 Ranked)')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Shortlist EcoSmart AI</span>
                </button>

                <button
                  onClick={() => triggerAction(4, 'Fast-forwarded 60-day pilot execution to 75% progress with 120% KPI achievement')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <FastForward className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fast-forward Pilot</span>
                </button>

                <button
                  onClick={() => triggerAction(5, 'Calculated Pilot Success (88/100) & Procurement Readiness (92/100)')}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Calculate Readiness</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Problem Intake & Hero Scenario Viewer Card matching Screenshot 2 */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h2>Problem Intake</h2>
                </div>
                {heroLoaded && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase">
                    HERO SCENARIO ACTIVE
                  </span>
                )}
              </div>

              {heroLoaded && challenge ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      {challenge.departmentName}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{challenge.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">Problem Statement:</strong> {challenge.problemDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Budget Range</span>
                      <span className="font-bold text-emerald-700">{challenge.budgetRange}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Location</span>
                      <span className="font-bold text-slate-800">{challenge.location}</span>
                    </div>
                  </div>

                  {/* Top Startup Match Spotlight */}
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5 text-emerald-600" />
                        Top Matched Startup Solution:
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                        92% Match Score
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">EcoSmart Waste Tech</span>
                      <span className="text-slate-500 font-mono text-[11px]">Growth Stage • Pune</span>
                    </div>
                  </div>

                  {/* Pilot Progress Snapshot */}
                  {pilot && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">Active Field Pilot Status</span>
                        <span className="font-extrabold text-emerald-600">{pilot.progress}% Progress</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${pilot.progress}%` }} className="bg-emerald-600 h-full rounded-full" />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>View Full AI Match Rationale</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {pilot && (
                      <Link
                        href={`/pilots/${pilot.id}`}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1"
                      >
                        <span>Open Pilot Workspace</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    ✨
                  </div>
                  <div>No hero problem loaded yet.</div>
                  <button
                    onClick={() => {
                      setHeroLoaded(true);
                      fetchDashboardData();
                    }}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    LOAD HERO SCENARIO
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Challenges</span>
            <div className="text-2xl font-black text-slate-900">1</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Primary SIH Scenario</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Verified Startups</span>
            <div className="text-2xl font-black text-purple-700">8</div>
            <span className="text-[10px] text-slate-500 font-medium">Domain Capable</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Pilot Success Score</span>
            <div className="text-2xl font-black text-emerald-600">88/100</div>
            <span className="text-[10px] text-emerald-600 font-semibold">120% KPI Achievement</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Procurement Readiness</span>
            <div className="text-2xl font-black text-teal-600">92/100</div>
            <span className="text-[10px] text-teal-600 font-semibold">Ready for Review</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
