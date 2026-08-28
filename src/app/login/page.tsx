'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, UserCheck, Award, Rocket, CheckCircle2, Search, FlaskConical, ShoppingBag, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'Officer' | 'Evaluator' | 'Startup' | 'Auditor'>('Officer');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Left Dark Emerald Hero Panel matching Screenshot 1 */}
      <div className="hidden lg:flex lg:w-7/12 bg-[#041a14] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-950">
              P
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">PRAMAN</h1>
              <p className="text-xs text-emerald-400 font-medium">Public Procurement & Innovation Gateway</p>
            </div>
          </div>

          <div className="pt-8 space-y-6 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-[11px] font-bold tracking-wider uppercase">
              • SMART INDIA HACKATHON - DEMO
            </span>

            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Empowering Government.<br />
              Enabling <span className="text-emerald-400">Innovation.</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              PRAMAN creates an evidence-driven bridge between government challenges and startup innovation — from discovery to pilot, procurement and scale.
            </p>
          </div>

          {/* Innovation Procurement Journey Grid Cards */}
          <div className="pt-6">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
              INNOVATION PROCUREMENT JOURNEY
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-[#082920]/80 border border-[#0d4234] p-3 rounded-xl space-y-1 text-center">
                <Search className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">Identify</div>
                <div className="text-[10px] text-slate-400">Challenges</div>
              </div>
              <div className="bg-[#082920]/80 border border-[#0d4234] p-3 rounded-xl space-y-1 text-center">
                <FlaskConical className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">Pilot</div>
                <div className="text-[10px] text-slate-400">Validate</div>
              </div>
              <div className="bg-[#082920]/80 border border-[#0d4234] p-3 rounded-xl space-y-1 text-center">
                <ShoppingBag className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">Procure</div>
                <div className="text-[10px] text-slate-400">Adopt</div>
              </div>
              <div className="bg-[#082920]/80 border border-[#0d4234] p-3 rounded-xl space-y-1 text-center">
                <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">Scale</div>
                <div className="text-[10px] text-slate-400">Impact</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges matching Screenshot 1 */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-[#0d3d30] text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Evidence-Driven</div>
              <div className="text-[10px] text-slate-400">KPI Verified</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Startup-Friendly</div>
              <div className="text-[10px] text-slate-400">Transparent</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Award className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Impact-Focused</div>
              <div className="text-[10px] text-slate-400">Scalable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Floating Card Authentication Modal matching Screenshot 1 */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-100 relative">
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SECURE DEMO ENVIRONMENT</span>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
          {/* Green Lock Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              SECURE GOVERNMENT ACCESS
            </span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h3>
            <p className="text-xs text-slate-500">Sign in to continue to the PRAMAN command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">OFFICIAL EMAIL</label>
              <input
                type="email"
                readOnly
                value="officer@praman.local"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <span>PASSWORD</span>
                <span className="text-[10px] text-slate-400 font-normal capitalize">Demo credential</span>
              </div>
              <input
                type="password"
                readOnly
                value="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">VERIFICATION CODE</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  • Simulated MFA
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center font-mono font-bold tracking-widest text-slate-800 text-sm">
                1 2 3 4 5 6
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-800/30 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Verify & Enter →'}</span>
            </button>
          </form>

          {/* DEMO ACCESS Quick Role Selectors matching Screenshot 1 */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block text-center">
              DEMO ACCESS
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('Officer')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-1 ${
                  selectedRole === 'Officer'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Officer</span>
                </div>
                <span className="text-[10px] text-slate-500">Government access</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('Evaluator')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-1 ${
                  selectedRole === 'Evaluator'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Evaluator</span>
                </div>
                <span className="text-[10px] text-slate-500">Review & scoring</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('Startup')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-1 ${
                  selectedRole === 'Startup'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Rocket className="w-4 h-4 text-amber-600" />
                  <span>Startup</span>
                </div>
                <span className="text-[10px] text-slate-500">Innovation access</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('Auditor')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-1 ${
                  selectedRole === 'Auditor'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Auditor</span>
                </div>
                <span className="text-[10px] text-slate-500">Governance access</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Protected demonstration environment — Authentication and government integrations are simulated for SIH demonstration.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
