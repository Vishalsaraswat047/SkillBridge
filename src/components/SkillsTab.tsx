/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerAnalysisResult } from '../types';
import { Award, AlertTriangle, HelpCircle, Plus, Check, Play, BookOpen } from 'lucide-react';

interface SkillsTabProps {
  data: CareerAnalysisResult;
  onUpdateAnalysis: (updatedData: CareerAnalysisResult) => void;
}

export default function SkillsTab({ data, onUpdateAnalysis }: SkillsTabProps) {
  const { profile, skillGap, scores } = data;
  const [newSkillText, setNewSkillText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle adding a skill interactively
  const handleAcquireSkill = (skill: string) => {
    if (profile.skills.includes(skill)) return;

    // Create a new updated dataset simulating an intelligence recalculation
    const updatedSkills = [...profile.skills, skill];
    const updatedMissing = skillGap.missingSkills.filter(s => s !== skill);
    const updatedImprovement = skillGap.improvementAreas.filter(area => area.skill !== skill);

    // Dynamic mathematical score scaling
    const skillCountDiff = updatedSkills.length - profile.skills.length;
    let newCoverage = Math.min(100, scores.skillCoverage + (skillCountDiff * 8));
    let newReadiness = Math.min(100, scores.careerReadiness + (skillCountDiff * 5));
    let newEmployability = Math.min(100, scores.employability + (skillCountDiff * 4));

    const updatedData: CareerAnalysisResult = {
      ...data,
      profile: {
        ...profile,
        skills: updatedSkills
      },
      skillGap: {
        ...skillGap,
        strengths: updatedSkills,
        missingSkills: updatedMissing,
        improvementAreas: updatedImprovement
      },
      scores: {
        ...scores,
        skillCoverage: newCoverage,
        careerReadiness: newReadiness,
        employability: newEmployability
      }
    };

    onUpdateAnalysis(updatedData);
    setSuccessMsg(`Skill "${skill}" successfully added! Calculated Coverage escalated to ${newCoverage}%.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const cleanSkill = newSkillText.trim();
    handleAcquireSkill(cleanSkill);
    setNewSkillText('');
  };

  return (
    <div id="skills-dashboard" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Skills Intelligence Center</h2>
          <p className="text-sm text-slate-500">Examine current strengths, formulate strategies for critical gaps, and tracking growth.</p>
        </div>
        {/* Simple inline tool form to simulate adding skills */}
        <form onSubmit={handleCustomAdd} className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <input 
            type="text" 
            id="input-inline-skill"
            placeholder="Introduce new skill..." 
            className="px-3 py-1.5 text-xs focus:outline-none bg-transparent"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
          />
          <button 
            type="submit" 
            id="btn-inline-add"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Acquire
          </button>
        </form>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Analytical SVG Chart & Skill Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Competency Visual Chart */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Skill Growth Tracking</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Real-time map visualizing current skillset size versus target {profile.careerTarget} specifications.
            </p>

            {/* Custom SVG Competency Radar/Bar representation */}
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Core Language Baseline</span>
                  <span>{profile.skills.includes('Python') || profile.skills.includes('JavaScript') ? '90%' : '50%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: profile.skills.includes('Python') || profile.skills.includes('JavaScript') ? '90%' : '50%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Specialized Libraries</span>
                  <span>{scores.skillCoverage > 60 ? '75%' : '40%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: scores.skillCoverage > 60 ? '75%' : '40%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Architecture & APIs</span>
                  <span>{profile.skills.includes('Git') || profile.skills.includes('SQL') ? '80%' : '30%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: profile.skills.includes('Git') || profile.skills.includes('SQL') ? '80%' : '30%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>DevOps & Testing</span>
                  <span>{profile.skills.includes('Docker') ? '85%' : '20%'}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: profile.skills.includes('Docker') ? '85%' : '20%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Acquired</span>
                <span className="text-xl font-bold text-slate-800">{profile.skills.length}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Missing</span>
                <span className="text-xl font-bold text-slate-800 text-amber-600">{skillGap.missingSkills.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Lists Roster (Strengths vs Gaps) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-emerald-500" /> Current Strengths
              </h3>
              
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {profile.skills.length === 0 ? (
                  <p className="text-xs text-slate-400">No active skills recorded. Use the inputs to simulate acquiring industry tools.</p>
                ) : (
                  profile.skills.map(sk => (
                    <div key={sk} className="px-3 py-2 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">{sk}</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Validated</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 text-xs text-slate-400 italic">
              *Strengths boost overall Portfolios.
            </div>
          </div>

          {/* Missing Skills & Gap Analysis */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> Critical Skill Gaps
              </h3>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {skillGap.missingSkills.length === 0 ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                    <p className="text-xs font-bold text-emerald-800">Amazing Job!</p>
                    <p className="text-[11px] text-emerald-600 mt-1">Zero missing skills recorded for this career target path.</p>
                  </div>
                ) : (
                  skillGap.missingSkills.map(sk => (
                    <div key={sk} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700">{sk}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Required for {profile.careerTarget}</p>
                      </div>
                      
                      <button
                        onClick={() => handleAcquireSkill(sk)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Play className="w-3 h-3 fill-current" /> Learn
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 text-xs text-slate-400 leading-relaxed">
              *Clicking "Learn" simulates completing targeted course elements and immediately adds it to your profile.
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Learning/Improvement Areas */}
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-450 uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-600">
          <BookOpen className="w-4 h-4 text-blue-500" /> Focus Development Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGap.improvementAreas?.length === 0 ? (
            <div className="p-4 border border-slate-100 rounded-xl text-center col-span-3">
              <span className="text-xs text-slate-400 leading-normal">Your development areas are fully optimized.</span>
            </div>
          ) : (
            skillGap.improvementAreas?.map(imp => {
              const severityColor = imp.severity === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' : imp.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100';
              return (
                <div key={imp.skill} className={`p-4 border rounded-xl flex flex-col justify-between space-y-4 bg-slate-50/30`}>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800">{imp.skill}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityColor}`}>
                        {imp.severity} Severity
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1">{imp.description}</p>
                  </div>
                  <button 
                    onClick={() => handleAcquireSkill(imp.skill)}
                    className="text-[11px] font-extrabold text-blue-600 hover:text-blue-700 block text-left"
                  >
                    Resolve Skill Gaps →
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
