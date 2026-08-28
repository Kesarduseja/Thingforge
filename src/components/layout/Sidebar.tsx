'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Zap,
  FileText,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  Shield,
  Award,
  ChevronDown,
  User,
  Sparkles,
  Layers,
} from 'lucide-react';

export type UserRole = 'GOVERNMENT' | 'STARTUP' | 'EVALUATOR' | 'DECISION_AUTHORITY' | 'ADMIN';

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, onRoleChange }) => {
  const pathname = usePathname();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleInfo: Record<UserRole, { title: string; dept: string; label: string }> = {
    GOVERNMENT: { title: 'Government Officer', dept: 'Urban Development Dept.', label: 'Officer' },
    STARTUP: { title: 'Startup Founder', dept: 'EcoSmart Waste Tech', label: 'Startup' },
    EVALUATOR: { title: 'Expert Evaluator', dept: 'IIT Bombay Committee', label: 'Evaluator' },
    DECISION_AUTHORITY: { title: 'Procurement Director', dept: 'State Decision Board', label: 'Authority' },
    ADMIN: { title: 'System Auditor', dept: 'PRAMAN Governance', label: 'Auditor' },
  };

  const currentRoleDetails = roleInfo[currentRole] || roleInfo.GOVERNMENT;

  const navGroups = [
    {
      group: 'COMMAND CENTER',
      items: [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/analytics', label: 'Analytics & Impact', icon: BarChart3 },
      ],
    },
    {
      group: 'PROBLEM → PILOT',
      items: [
        { href: '/challenges', label: 'Problems Directory', icon: Building2 },
        { href: '/challenges/new', label: 'Problem Intake', icon: PlusCircle },
        { href: '/evaluations', label: 'Expert Evaluation', icon: Award },
        { href: '/pilots', label: 'Pilot Workspaces', icon: FileText },
      ],
    },
    {
      group: 'DECISION & SCALE',
      items: [
        { href: '/decision', label: 'Procurement Readiness', icon: CheckCircle2 },
        { href: '/reuse', label: 'Handoff & Scale', icon: RefreshCw },
        { href: '/admin', label: 'Audit Trail & RBAC', icon: Shield },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#051c16] text-slate-200 border-r border-[#0d3329] flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-2xl select-none z-40">
      {/* Top Brand Section */}
      <div className="p-4 space-y-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-900/50 group-hover:bg-emerald-500 transition">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-400 transition">
                PRAMAN
              </span>
            </div>
            <p className="text-[10px] font-medium text-emerald-400/80 tracking-wide uppercase">
              Innovation Procurement
            </p>
          </div>
        </Link>

        {/* System Online Badge */}
        <div className="bg-[#092920] border border-[#0d4234] rounded-lg px-3 py-1.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-semibold text-[10px] uppercase tracking-wider">System Online</span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase">
            DEMO
          </span>
        </div>

        {/* Active Role Selector Card */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="w-full bg-[#0a2e24] hover:bg-[#0c382c] border border-[#114838] p-2.5 rounded-xl transition flex items-center justify-between text-left shadow-md"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{currentRoleDetails.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentRoleDetails.dept}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {/* Role Switcher Dropdown */}
          {showRoleMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#092920] border border-[#114838] rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Switch Role Profile:
              </div>
              {(['GOVERNMENT', 'EVALUATOR', 'STARTUP', 'DECISION_AUTHORITY', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                    currentRole === r
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-[#0c382c] hover:text-white'
                  }`}
                >
                  <span>{roleInfo[r].title}</span>
                  <span className="text-[9px] uppercase font-mono bg-black/30 px-1 py-0.5 rounded">
                    {roleInfo[r].label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-500/70">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-emerald-600/90 text-white font-bold shadow-md shadow-emerald-950 border border-emerald-400/30'
                        : 'text-slate-300 hover:bg-[#0a2e24] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500/70'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Credit */}
      <div className="p-4 border-t border-[#0d3329] bg-[#031410] text-[10px] text-slate-400 flex items-center justify-between">
        <span className="font-mono">PRAMAN v1.0.0</span>
        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
          SIH 2026
        </span>
      </div>
    </aside>
  );
};
