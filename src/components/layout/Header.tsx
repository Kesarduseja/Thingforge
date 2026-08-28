'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Building2, Rocket, Award, CheckCircle2, BarChart3, RefreshCw, Layers, FileText } from 'lucide-react';

export type UserRole = 'GOVERNMENT' | 'STARTUP' | 'EVALUATOR' | 'DECISION_AUTHORITY' | 'ADMIN';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const pathname = usePathname();
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const roles = [
    { key: 'GOVERNMENT', label: '🏛️ Government Dept', desc: 'Create Challenge & Track Pilots' },
    { key: 'STARTUP', label: '🚀 Startup Portal', desc: 'Browse Opportunities & Submit Solutions' },
    { key: 'EVALUATOR', label: '⚖️ Expert Evaluator', desc: 'TOPSIS-Inspired Weighted Scoring' },
    { key: 'DECISION_AUTHORITY', label: '👑 Decision Authority', desc: 'Final Human Procurement Sign-off' },
    { key: 'ADMIN', label: '🛡️ Admin & Audit', desc: 'RBAC Access & System Logs' },
  ];

  const handleResetData = async () => {
    if (!confirm('Reset database to preloaded SIH primary demo scenario?')) return;
    setIsResetting(true);
    setResetMessage('Resetting database...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMessage('Demo data restored successfully!');
        setTimeout(() => {
          setResetMessage('');
          window.location.reload();
        }, 1200);
      } else {
        setResetMessage('Failed to reset: ' + data.error);
      }
    } catch (e: any) {
      setResetMessage('Error resetting data');
    } finally {
      setIsResetting(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: Layers },
    { href: '/challenges', label: 'Challenges', icon: Building2 },
    { href: '/startups', label: 'Startups', icon: Rocket },
    { href: '/evaluations', label: 'Evaluations', icon: Award },
    { href: '/pilots', label: 'Pilot Workspaces', icon: FileText },
    { href: '/decision', label: 'Decision Portal', icon: CheckCircle2 },
    { href: '/reuse', label: 'Scale & Reuse', icon: RefreshCw },
    { href: '/analytics', label: 'Analytics & Audit', icon: BarChart3 },
  ];

  return (
    <header className="w-full bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      {/* Top Demo Context Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SIH 2026 Prototype
          </span>
          <span className="font-medium text-slate-200">
            Problem SIH26136 — Team ThinkForge | PRAMAN: Evidence-Based Innovation Procurement
          </span>
        </div>
        <div className="flex items-center gap-3">
          {resetMessage && (
            <span className="text-amber-400 font-semibold animate-pulse text-[11px]">{resetMessage}</span>
          )}
          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded text-xs transition"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            Reset Demo Dataset
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-3 gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition">
                PRAMAN
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-mono">
                POC v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">From Public Problems to Proven Innovation</p>
          </div>
        </Link>

        {/* Live Role Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
            Switch Role:
          </span>
          {roles.map((r) => {
            const isActive = currentRole === r.key;
            return (
              <button
                key={r.key}
                onClick={() => onRoleChange(r.key as UserRole)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={r.desc}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 py-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
