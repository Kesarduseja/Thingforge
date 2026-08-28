'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, UserRole } from '@/components/layout/Header';
import { Rocket, ShieldCheck, MapPin, Search, CheckCircle2, Users, Award, ExternalLink } from 'lucide-react';

export default function StartupRegistryPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>('STARTUP');
  const [startups, setStartups] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/startups');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStartups(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredStartups = startups.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.technologies.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'ALL' || st.domain.includes(selectedDomain);
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-purple-400" />
                Startup Innovation Registry (Module 2)
              </h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                DEMO / SAMPLE DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verified startup database with technical capabilities, statutory certifications, and statutory compliance status.
            </p>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search startups by name, technology stack, or capabilities..."
              className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Domains</option>
            <option value="Waste">Waste Management</option>
            <option value="CleanTech">CleanTech</option>
            <option value="Logistics">Logistics & Mobility</option>
            <option value="Hardware">Hardware & Sensors</option>
            <option value="Robotics">Robotics</option>
          </select>
        </div>

        {/* Startup Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading startup registry...</div>
        ) : filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((st) => (
              <div
                key={st.id}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-xl space-y-4 transition flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                      {st.domain}
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      {st.complianceStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{st.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{st.location}</span>
                      <span>•</span>
                      <span>{st.stage}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {st.description}
                  </p>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Solution Architecture:
                    </span>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-snug">
                      {st.solutionDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-800 pt-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Tech Stack:</span>
                    <p className="text-[11px] text-slate-300 font-mono">{st.technologies}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Certifications:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[160px]">{st.certifications}</span>
                  </div>

                  <Link
                    href={`/startups/${st.id}`}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Full Startup Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
            No startups matching filter criteria.
          </div>
        )}
      </main>
    </div>
  );
}
