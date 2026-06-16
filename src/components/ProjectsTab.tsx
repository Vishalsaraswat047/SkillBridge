/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerAnalysisResult, RecommendedProject } from '../types';
import { Briefcase, Clock, Award, Star, AlertCircle, Play, CheckCircle2, Circle } from 'lucide-react';

interface ProjectsTabProps {
  data: CareerAnalysisResult;
  onUpdateAnalysis: (updatedData: CareerAnalysisResult) => void;
}

export default function ProjectsTab({ data, onUpdateAnalysis }: ProjectsTabProps) {
  const { recommendedProjects, scores } = data;
  const [successMsg, setSuccessMsg] = useState('');

  // Handle setting a project to In Progress or Completed
  const setProjectStatus = (projectId: string, newStatus: "Suggested" | "In Progress" | "Completed") => {
    const updatedProjects = recommendedProjects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, status: newStatus };
    });

    // Score simulation logic
    // Count project completions
    let completedCount = 0;
    let inProgressCount = 0;

    updatedProjects.forEach(p => {
      if (p.status === 'Completed') completedCount++;
      else if (p.status === 'In Progress') inProgressCount++;
    });

    // Calculate Portfolio Strength formula
    // Base is 38%
    const completionBonus = completedCount * 18; // 18 points per finished project
    const progressBonus = inProgressCount * 8; // 8 points per in-progress project
    const newPortfolioStrength = Math.min(100, Math.round(38 + completionBonus + progressBonus));

    // Dynamic readiness adjustment
    const bonusReadiness = completedCount * 6;
    const newReadiness = Math.min(100, scores.careerReadiness + bonusReadiness);

    const updatedData: CareerAnalysisResult = {
      ...data,
      recommendedProjects: updatedProjects,
      scores: {
        ...scores,
        portfolioStrength: newPortfolioStrength,
        careerReadiness: newReadiness
      }
    };

    onUpdateAnalysis(updatedData);
    setSuccessMsg(`Project status updated to "${newStatus}". Calculated Portfolio Strength scaled to ${newPortfolioStrength}%.`);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div id="projects-dashboard" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Portfolio Project recommendations</h2>
          <p className="text-sm text-slate-500">Practical milestones structured to reinforce core skills and maximize employability weight.</p>
        </div>
        <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold text-slate-600">
          Portfolio Score: {scores.portfolioStrength}%
        </span>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Roster list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendedProjects?.map((project) => {
          const isSuggested = project.status === 'Suggested' || !project.status;
          const isInProgress = project.status === 'In Progress';
          const isCompleted = project.status === 'Completed';

          const difficultyColor = project.difficulty === 'Advanced' 
            ? 'bg-rose-50 text-rose-700 border-rose-100' 
            : project.difficulty === 'Intermediate' 
              ? 'bg-blue-50 text-blue-700 border-blue-100' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-100';

          return (
            <div 
              key={project.id} 
              id={`project-card-${project.id}`}
              className={`p-6 rounded-2xl bg-white border transition flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md ${
                isCompleted 
                  ? 'border-emerald-200 bg-emerald-50/5' 
                  : isInProgress 
                    ? 'border-blue-200' 
                    : 'border-slate-100'
              }`}
            >
              {/* Card top */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${difficultyColor}`}>
                    {project.difficulty}
                  </span>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {project.estimatedHours} Hours
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">{project.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">Sector: {project.industryRelevance}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed min-h-[50px] line-clamp-3">
                  {project.description}
                </p>

                {/* Acquired Skills tags */}
                <div className="pt-1 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Acquired Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillsAcquired.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[10px] text-slate-600 font-semibold rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Bottom status controller */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {isCompleted && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  {isInProgress && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                  {isSuggested && <span className="w-2 h-2 rounded-full bg-slate-300"></span>}
                  <span className="text-[10px] font-bold uppercase text-slate-400 pl-0.5">
                    {project.status || 'Suggested'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isSuggested && (
                    <button
                      onClick={() => setProjectStatus(project.id, 'In Progress')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Play className="w-3 h-3 fill-current" /> Start
                    </button>
                  )}

                  {isInProgress && (
                    <>
                      <button
                        onClick={() => setProjectStatus(project.id, 'Suggested')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setProjectStatus(project.id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        Complete
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => setProjectStatus(project.id, 'In Progress')}
                      className="px-2.5 py-1 bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition"
                    >
                      Revamp
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5 mt-4">
        <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          *<strong>Employability Weight</strong>: Recruiter metrics weight practical modular code highly over static certifications. Standardise code bases within GitHub registries for maximum rating.
        </p>
      </div>
    </div>
  );
}
