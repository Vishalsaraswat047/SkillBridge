/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerAnalysisResult } from '../types';
import { Briefcase, Calendar, Award, ExternalLink, Filter, Search, FileCheck, HelpCircle } from 'lucide-react';

interface OpportunitiesTabProps {
  data: CareerAnalysisResult;
}

export default function OpportunitiesTab({ data }: OpportunitiesTabProps) {
  const { opportunities, profile } = data;
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedList, setAppliedList] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApply = (id: string, name: string) => {
    if (appliedList.includes(id)) return;
    setAppliedList([...appliedList, id]);
    setToastMessage(`Successfully registered interest for "${name}"! Your Career Twin has flagged this opportunity.`);
    
    // Auto-dismiss within 4.5 seconds
    setTimeout(() => {
      setToastMessage(prev => prev ? null : null);
    }, 4500);
  };

  // Filter opportunities list
  const filtered = opportunities?.filter(op => {
    const matchesFilter = filterType === 'All' || op.type === filterType;
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          op.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="opportunities-dashboard" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Opportunity Intelligence Discoveries</h2>
          <p className="text-sm text-slate-500">Live matched internships, hackathons, and research programs matched targeting your current semester profile.</p>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            id="opp-search"
            placeholder="Search by role, company, or tech..." 
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['All', 'Internship', 'Hackathon', 'Competition', 'Scholarship'].map((type) => (
            <button
              key={type}
              id={`opp-filter-${type}`}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                filterType === type 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 hover:bg-slate-250 text-slate-600 hover:text-slate-800'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered?.length === 0 ? (
          <div className="p-12 text-center col-span-2 border border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-350 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Matched Opportunities</h4>
            <p className="text-xs text-slate-400">Try modifying your search filter keywords.</p>
          </div>
        ) : (
          filtered?.map((op) => {
            const hasApplied = appliedList.includes(op.id);
            const badgeTypeColor = op.type === 'Internship' 
              ? 'bg-blue-50 text-blue-700 border-blue-100' 
              : op.type === 'Hackathon' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-100';

            return (
              <div 
                key={op.id} 
                id={`opportunity-card-${op.id}`}
                className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeTypeColor}`}>
                      {op.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-0.5 rounded-full">
                      {op.relevanceMatch}% Match
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{op.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{op.organization}</p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5 leading-relaxed">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Deadline: <span className="font-semibold text-slate-700">{op.deadline}</span>
                    </p>
                    <p className="flex items-center gap-1.5 leading-relaxed">
                      <FileCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Eligibility: <span className="font-semibold text-slate-700">{op.eligibility}</span>
                    </p>
                  </div>

                  {/* Skills tags required */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Skills Checked Against:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {op.skillsRequired.map(skill => {
                        const hasSkill = profile.skills.some(val => val.toLowerCase() === skill.toLowerCase());
                        
                        return (
                          <span 
                            key={skill} 
                            className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                              hasSkill 
                                ? 'bg-emerald-50 border-emerald-150 text-emerald-700 font-bold' 
                                : 'bg-slate-50 border-slate-100 text-slate-500'
                            }`}
                          >
                            {skill} {hasSkill ? '✓' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-2.5">
                  <span className="text-[10px] text-slate-400 font-bold">Standard Match Protocol</span>

                  <button
                    onClick={() => handleApply(op.id, op.title)}
                    disabled={hasApplied}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      hasApplied 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10'
                    }`}
                  >
                    {hasApplied ? 'Interest Logged ✓' : 'Register Interest'}
                    {!hasApplied && <ExternalLink className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 max-w-sm animate-fade-in border border-emerald-500" id="apply-toast">
          <FileCheck className="w-5 h-5 shrink-0" />
          <div className="text-left text-[11px] font-medium leading-normal">
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white text-xs font-bold pl-2 cursor-pointer">✕</button>
        </div>
      )}

    </div>
  );
}
