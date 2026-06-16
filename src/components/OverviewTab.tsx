/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CareerAnalysisResult, MonthMilestone } from '../types';
import { Award, Compass, BookOpen, Flag, Target, ArrowRight, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface OverviewTabProps {
  data: CareerAnalysisResult;
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ data, setActiveTab }: OverviewTabProps) {
  const { profile, scores, careerFits, roadmap, careerTwin } = data;

  // Get current state from Roadmap: find the next uncompleted milestone
  const currentMonthTask = roadmap?.find(m => m.month === 1);
  const nextMilestoneName = currentMonthTask?.milestones?.[0] || 'Foundational specialization';
  const monthFocusName = currentMonthTask?.focus || 'Core fundamentals & initial setups';

  return (
    <div id="overview-tab" className="space-y-6">
      {/* Visual Welcome Board */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5Grid">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Career Navigator Live</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">Hello, {profile.name} 👋</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Constructed complete telemetry maps targeting <span className="text-blue-300 font-bold">{profile.careerTarget}</span>. Currently positioned in <span className="font-semibold text-white">{profile.college}</span>, Semester {profile.currentSemester}.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setActiveTab('twin')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-600/10 cursor-pointer"
            >
              Analyze Career Twin <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Bento Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Readiness & Quality Meter */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" /> Career Readiness
            </h3>
            <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
              {/* SVG Circle Gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke="#f1f5f9" 
                  strokeWidth="10" 
                  fill="transparent" 
                />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke="#3b82f6" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - scores.careerReadiness / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-800">{scores.careerReadiness}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall score</span>
              </div>
            </div>
          </div>
          <div className="text-center bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on specialized skills matched, portfolio ratings, and learning checkpoint validations.
            </p>
          </div>
        </div>

        {/* Dynamic Career Fit Matrix */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" /> Career Path Suitabilities
              </h3>
              <span className="text-xs text-blue-600 font-bold">4 Paths Evaluated</span>
            </div>

            <div className="space-y-3.5">
              {careerFits?.slice(0, 3).map((fit, idx) => {
                const colorClass = idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-emerald-500' : 'bg-amber-500';
                const bgLight = idx === 0 ? 'bg-blue-50' : idx === 1 ? 'bg-emerald-50' : 'bg-amber-50';
                const textDark = idx === 0 ? 'text-blue-700' : idx === 1 ? 'text-emerald-700' : 'text-amber-700';
                
                return (
                  <div key={fit.role} className="p-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
                        <h4 className="text-sm font-bold text-slate-800">{fit.role}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${bgLight} ${textDark}`}>
                        {fit.matchPercentage}% Compatibility
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {fit.suitabilityReason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-right pt-3">
            <button 
              onClick={() => setActiveTab('skills')}
              className="text-xs text-blue-600 font-bold hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
            >
              Analyze Skill Gaps <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Scores Bento Grid (Coverage, Portfolio, Employability) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Portfolio Strength</span>
            <span className="text-2xl font-bold text-slate-800">{scores.portfolioStrength}%</span>
            <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
              <div className="bg-emerald-500 h-full" style={{ width: `${scores.portfolioStrength}%` }}></div>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Skill Coverage</span>
            <span className="text-2xl font-bold text-slate-800">{scores.skillCoverage}%</span>
            <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
              <div className="bg-blue-500 h-full" style={{ width: `${scores.skillCoverage}%` }}></div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Employability Index</span>
            <span className="text-2xl font-bold text-slate-800">{scores.employability}%</span>
            <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
              <div className="bg-indigo-500 h-full" style={{ width: `${scores.employability}%` }}></div>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Target Focus & Milestones Section */}
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Flag className="w-4 h-4 text-amber-500" /> Active Career Milestones (Month 1 Focus)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Active Goal */}
          <div className="col-span-1 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Interactive Priority</span>
            <h4 className="text-sm font-bold text-slate-800">{roadmap?.[0]?.title || 'Month 1 Specialization'}</h4>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Focus key: {monthFocusName}
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <span>Sprint Targets</span>
            </div>
            {currentMonthTask?.milestones?.map((milestone, mIdx) => (
              <div key={milestone} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mt-0.5">
                  {mIdx + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-700">{milestone}</p>
                  <p className="text-[11px] text-slate-500">Track milestones and check off tasks within the Roadmap Dashboard tab.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Note */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>How to optimize rankings</strong>: Checking off learning tasks in the <span className="font-semibold underline cursor-pointer" onClick={() => setActiveTab('roadmap')}>Roadmap</span> dashboard or changing project progress metrics inside the <span className="font-semibold underline cursor-pointer" onClick={() => setActiveTab('projects')}>Projects</span> folder will automatically scale your digital telemetry profiles.
        </p>
      </div>
    </div>
  );
}
