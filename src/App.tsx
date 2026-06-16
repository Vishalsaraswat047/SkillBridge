/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, CareerAnalysisResult } from './types';
import Onboarding from './components/Onboarding';
import OverviewTab from './components/OverviewTab';
import SkillsTab from './components/SkillsTab';
import RoadmapTab from './components/RoadmapTab';
import ProjectsTab from './components/ProjectsTab';
import OpportunitiesTab from './components/OpportunitiesTab';
import CareerTwinTab from './components/CareerTwinTab';
import AIAssistant from './components/AIAssistant';
import { Compass, Sparkles, LogOut, LayoutDashboard, Code, CalendarClock, Briefcase, Eye, Bot, RefreshCw } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [analysis, setAnalysis] = useState<CareerAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved credentials representing standard persistence
  useEffect(() => {
    const savedProfile = localStorage.getItem('skillbridge_profile');
    const savedAnalysis = localStorage.getItem('skillbridge_analysis');
    
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleOnboardingSubmit = async (newProfile: StudentProfile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: newProfile })
      });

      if (!response.ok) {
        throw new Error('Failed to run strategic profile analyzer.');
      }

      const result: CareerAnalysisResult = await response.json();
      
      setProfile(newProfile);
      setAnalysis(result);
      
      localStorage.setItem('skillbridge_profile', JSON.stringify(newProfile));
      localStorage.setItem('skillbridge_analysis', JSON.stringify(result));
    } catch (err) {
      console.error('Failed to run onboarding path analyzer:', err);
      setError('Strategic analysis failed. Please ensure your backend server has started successfully and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnalysis = (updatedResult: CareerAnalysisResult) => {
    setAnalysis(updatedResult);
    setProfile(updatedResult.profile);
    localStorage.setItem('skillbridge_profile', JSON.stringify(updatedResult.profile));
    localStorage.setItem('skillbridge_analysis', JSON.stringify(updatedResult));
  };

  const handleResetProfile = () => {
    setShowResetModal(true);
  };

  const executeReset = () => {
    setProfile(null);
    setAnalysis(null);
    localStorage.removeItem('skillbridge_profile');
    localStorage.removeItem('skillbridge_analysis');
    setActiveTab('overview');
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      
      {/* Visual Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/10">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              SkillBridge AI <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">OS v1.2</span>
            </h1>
            <span className="text-[10px] pr-2 text-slate-400 font-bold block">"Navigate Your Future."</span>
          </div>
        </div>

        {profile && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-800 block">{profile.name}</span>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Target: {profile.careerTarget}</span>
            </div>
            
            <button
              onClick={handleResetProfile}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
              title="Reset Career Coordinates"
              id="header-reset-btn"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center justify-between text-xs animate-fade-in animate-duration-200" id="error-banner">
            <span className="font-semibold">{error}</span>
            <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-800 font-bold px-2.5 py-1 bg-white hover:bg-slate-50 border border-rose-100 rounded-lg transition" id="close-error-btn">Dismiss</button>
          </div>
        )}
        {!profile || !analysis ? (
          <Onboarding onSubmit={handleOnboardingSubmit} isLoading={loading} />
        ) : (
          <div className="space-y-6">
            
            {/* Horizontal Dashboard navigation tab system */}
            <div className="flex flex-wrap gap-1 bg-white p-1.5 border border-slate-100 rounded-2xl shadow-sm">
              <button
                id="tab-overview"
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'overview' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Overview
              </button>

              <button
                id="tab-skills"
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'skills' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Skills Gap
              </button>

              <button
                id="tab-roadmap"
                onClick={() => setActiveTab('roadmap')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'roadmap' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" /> Learning Roadmap
              </button>

              <button
                id="tab-projects"
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'projects' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Portfolio Projects
              </button>

              <button
                id="tab-opportunities"
                onClick={() => setActiveTab('opportunities')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'opportunities' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Opportunities
              </button>

              <button
                id="tab-twin"
                onClick={() => setActiveTab('twin')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'twin' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Career Twin
              </button>

              <button
                id="tab-chat"
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === 'chat' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-3.5 h-3.5" /> AI Strategist
              </button>
            </div>

            {/* Active Content workspace */}
            <div id="dashboard-content" className="min-h-[460px]">
              {activeTab === 'overview' && (
                <OverviewTab data={analysis} setActiveTab={setActiveTab} />
              )}
              {activeTab === 'skills' && (
                <SkillsTab data={analysis} onUpdateAnalysis={handleUpdateAnalysis} />
              )}
              {activeTab === 'roadmap' && (
                <RoadmapTab data={analysis} onUpdateAnalysis={handleUpdateAnalysis} />
              )}
              {activeTab === 'projects' && (
                <ProjectsTab data={analysis} onUpdateAnalysis={handleUpdateAnalysis} />
              )}
              {activeTab === 'opportunities' && (
                <OpportunitiesTab data={analysis} />
              )}
              {activeTab === 'twin' && (
                <CareerTwinTab data={analysis} />
              )}
              {activeTab === 'chat' && (
                <AIAssistant data={analysis} />
              )}
            </div>

          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-100 text-center text-slate-400 text-xs font-semibold">
        <p>© 2026 SkillBridge AI. Your Career. Planned by Intelligence.</p>
      </footer>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in" id="reset-confirm-modal">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-scale-up">
            <div className="flex gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl max-w-max h-max">
                <LogOut className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-800 tracking-tight">Reset Career Coordinates?</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  This will securely wipe all local career telemetry, learning sprint tracking, and target profile maps. This is irreversible.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                id="btn-cancel-reset"
              >
                Cancel
              </button>
              <button
                onClick={executeReset}
                className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-500/10 transition cursor-pointer"
                id="btn-confirm-reset"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
