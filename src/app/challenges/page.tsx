'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Building2, Plus, ArrowRight, MapPin, DollarSign, Clock, Search } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/challenges');
      const data = await res.json();
      if (Array.isArray(data)) {
        setChallenges(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell activeBreadcrumb="Problems Directory">
      <div className="space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              Government Problems Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active public procurement problem statements looking for innovative startup solutions.
            </p>
          </div>

          <Link
            href="/challenges/new"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 self-start md:self-auto shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Problem Intake</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems by title, domain, or department..."
            className="bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none flex-1 font-medium"
          />
        </div>

        {/* Challenge Cards List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading problems directory...</div>
        ) : filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 hover:border-emerald-500/50 p-6 rounded-2xl space-y-4 transition flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                      {c.domain}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase border border-slate-200">
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{c.title}</h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {c.problemDescription}
                  </p>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{c.budgetRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{c.pilotDuration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Matches:</span>
                      <span className="font-bold text-emerald-700">{c.matches?.length || 0} Startups</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400 font-medium">{c.departmentName}</span>
                    <Link
                      href={`/challenges/${c.id}`}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-lg border border-emerald-200 transition flex items-center gap-1"
                    >
                      <span>View AI Matches & Eligibility</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No problems found matching query.
          </div>
        )}
      </div>
    </AppShell>
  );
}
