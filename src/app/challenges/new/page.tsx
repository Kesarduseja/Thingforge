'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, UserRole } from '@/components/layout/Header';
import { Building2, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export default function NewChallengePage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('GOVERNMENT');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    problemDescription: '',
    departmentName: 'Urban Development & Municipal Affairs Department',
    domain: 'Smart Waste Management',
    requiredTechnologies: 'AI/ML, IoT Sensors, Route Optimization, GIS Mapping',
    budgetRange: '₹15 Lakhs - ₹40 Lakhs (Pilot Stage)',
    location: 'Mumbai & Thane Region, Maharashtra',
    eligibilityRequirements: 'DIPP Recognized Startup, Minimum 2 Years Operating, Prior IoT/Analytics Pilot Experience, Fully Compliant Statutory Status',
    expectedOutcomes: 'Reduce bin overflow incidents by >80%, improve collection truck route efficiency by >25%',
    pilotDuration: '60 Days',
    kpis: 'Response Time < 15 mins, Bin Overflow Reduction > 80%, Truck Fuel Saving > 20%',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Challenge successfully created. Auto-matching with startup registry...');
        setTimeout(() => {
          router.push(`/challenges/${data.challenge.id}`);
        }, 1500);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err: any) {
      alert('Failed to submit challenge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              Create Government Procurement Challenge
            </h1>
            <p className="text-xs text-slate-400">
              Module 1 — Submit a problem statement to initiate AI-assisted startup matching.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-semibold animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
          {/* Section 1: Basic Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              1. Challenge Overview
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Challenge Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI-Enabled Solid Waste Collection Optimization System"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Department Name *</label>
                <input
                  type="text"
                  name="departmentName"
                  required
                  value={formData.departmentName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Domain / Category *</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Smart Waste Management">Smart Waste Management</option>
                  <option value="Smart City Infrastructure">Smart City Infrastructure</option>
                  <option value="Urban Mobility & Logistics">Urban Mobility & Logistics</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="CleanTech & Renewable Energy">CleanTech & Renewable Energy</option>
                  <option value="Civic Health Tech">Civic Health Tech</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Problem Description *</label>
              <textarea
                name="problemDescription"
                rows={4}
                required
                value={formData.problemDescription}
                onChange={handleChange}
                placeholder="Detailed breakdown of operational bottleneck or public service gap..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Technical & Budget Requirements */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              2. Technical & Statutory Eligibility
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Required Technologies *</label>
                <input
                  type="text"
                  name="requiredTechnologies"
                  required
                  value={formData.requiredTechnologies}
                  onChange={handleChange}
                  placeholder="e.g. AI/ML, IoT Sensors, Route Optimization, GIS Mapping"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Pilot Budget Range *</label>
                <input
                  type="text"
                  name="budgetRange"
                  required
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Pilot Duration *</label>
                <input
                  type="text"
                  name="pilotDuration"
                  required
                  value={formData.pilotDuration}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Eligibility Requirements *</label>
              <textarea
                name="eligibilityRequirements"
                rows={2}
                required
                value={formData.eligibilityRequirements}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Outcomes & KPIs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              3. Expected Outcomes & Key Performance Indicators
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Expected Outcomes</label>
              <input
                type="text"
                name="expectedOutcomes"
                value={formData.expectedOutcomes}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target KPIs (Comma separated)</label>
              <input
                type="text"
                name="kpis"
                value={formData.kpis}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting & Matching...' : 'Submit Challenge & Trigger AI Match'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
