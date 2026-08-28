'use client';

import React, { useState } from 'react';
import { Sidebar, UserRole } from './Sidebar';
import { RefreshCw, Bell, User, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeBreadcrumb?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeBreadcrumb = 'Dashboard',
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('GOVERNMENT');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const handleResetData = async () => {
    if (!confirm('Reset database to preloaded SIH hero demo scenario?')) return;
    setIsResetting(true);
    setResetMsg('Restoring demo dataset...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMsg('Demo dataset restored successfully!');
        setTimeout(() => {
          setResetMsg('');
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      setResetMsg('Error resetting data');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Left Sidebar */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching Screenshot 2 */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-400">Command Center</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{activeBreadcrumb}</span>
          </div>

          {/* Right Status Indicators & Profile */}
          <div className="flex items-center gap-3">
            {resetMsg && (
              <span className="text-xs font-semibold text-emerald-600 animate-pulse">{resetMsg}</span>
            )}

            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-200 transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Hero Demo</span>
            </button>

            {/* Systems Operational Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Systems Operational</span>
            </div>

            {/* Role Profile Badge */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                {currentRole[0]}
              </div>
              <div className="hidden md:block text-[11px] leading-tight">
                <span className="font-bold text-slate-800 block">
                  {currentRole === 'GOVERNMENT' && 'Government Officer'}
                  {currentRole === 'STARTUP' && 'Startup Founder'}
                  {currentRole === 'EVALUATOR' && 'Expert Evaluator'}
                  {currentRole === 'DECISION_AUTHORITY' && 'Procurement Director'}
                  {currentRole === 'ADMIN' && 'System Auditor'}
                </span>
                <span className="text-slate-400 text-[9px] block">Urban Development Dept.</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Canvas Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
