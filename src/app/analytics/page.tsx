'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BarChart3, Zap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartDataScores = [
    { category: '90-100% (Top Fit)', count: 2 },
    { category: '75-89% (Good Fit)', count: 3 },
    { category: '60-74% (Moderate)', count: 2 },
    { category: '< 60% (Low Fit)', count: 1 },
  ];

  const chartDataPilots = [
    { name: 'Highly Successful', value: 1, color: '#059669' },
    { name: 'In Progress', value: 1, color: '#d97706' },
    { name: 'Under Review', value: 1, color: '#0284c7' },
  ];

  return (
    <AppShell activeBreadcrumb="Analytics & Impact">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              Platform Analytics & Impact Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Comprehensive analytics on public problem resolution rates, startup matches, and pilot outcome scores.
            </p>
          </div>
        </div>

        {/* High-Level Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Problems</span>
            <div className="text-2xl font-black text-slate-900">{analytics?.totalChallenges || 1}</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Registered Startups</span>
            <div className="text-2xl font-black text-purple-700">{analytics?.totalStartups || 8}</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Avg AI Match %</span>
            <div className="text-2xl font-black text-amber-600">{analytics?.avgMatchScore || 82}%</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Field Pilots</span>
            <div className="text-2xl font-black text-teal-600">{analytics?.activePilots || 1}</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Procurement Ready</span>
            <div className="text-2xl font-black text-emerald-600">{analytics?.procurementReady || 1}</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Reuse Targets</span>
            <div className="text-2xl font-black text-indigo-600">{analytics?.reuseCount || 3}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              AI Match Score Distribution Across Startup Registry
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataScores}>
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Pilot Outcome Success Distribution
            </h3>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartDataPilots} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {chartDataPilots.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
