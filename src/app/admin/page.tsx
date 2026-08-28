'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Shield, Users, Clock } from 'lucide-react';

export default function AdminPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (Array.isArray(data)) setAuditLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { name: 'Rajesh Sharma (IAS)', email: 'gov@praman.local', role: 'GOVERNMENT', dept: 'Urban Development & Municipal Affairs Dept' },
    { name: 'Ananya Verma (CEO, EcoSmart)', email: 'startup@ecosmart.local', role: 'STARTUP', dept: 'EcoSmart Waste Tech' },
    { name: 'Dr. Vikramaditya Roy', email: 'expert@iitb.local', role: 'EVALUATOR', dept: 'Dept of Smart Infrastructure, IIT Bombay' },
    { name: 'P. K. Mishra (Director)', email: 'authority@procure.local', role: 'DECISION_AUTHORITY', dept: 'State Procurement Board' },
    { name: 'System Admin', email: 'admin@praman.local', role: 'ADMIN', dept: 'PRAMAN Platform Management' },
  ];

  const filteredLogs = auditLogs.filter(
    (log) => filterRole === 'ALL' || log.userRole === filterRole
  );

  return (
    <AppShell activeBreadcrumb="Audit Trail & RBAC">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              Admin Dashboard & Immutable Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Role-Based Access Control (RBAC) management and tamper-evident audit logging for public procurement compliance.
            </p>
          </div>
        </div>

        {/* RBAC Users Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control (RBAC) Demo Accounts
            </h3>
            <span className="text-xs text-slate-400 font-mono">5 Active Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Department / Organization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demoUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-500 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{u.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immutable Audit Logs Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Immutable System Audit Logs
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Filter Role:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium p-1.5 rounded-lg focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="GOVERNMENT">Government</option>
                <option value="STARTUP">Startup</option>
                <option value="EVALUATOR">Evaluator</option>
                <option value="DECISION_AUTHORITY">Decision Authority</option>
                <option value="SYSTEM">System Engine</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading audit logs...</div>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 hover:bg-slate-50 p-2 rounded-xl transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.userName}</span>
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border border-slate-200">
                        {log.userRole}
                      </span>
                      <span className="text-emerald-700 font-bold font-mono">{log.action}</span>
                    </div>
                    <p className="text-slate-600 text-xs font-medium">{log.details}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">No audit logs matching filter.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
