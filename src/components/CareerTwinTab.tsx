/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerAnalysisResult } from '../types';
import { Sparkles, HelpCircle, ArrowRight, Zap, Target, Award, Shield, UserCheck, BarChart2 } from 'lucide-react';

interface CareerTwinTabProps {
  data: CareerAnalysisResult;
}

export default function CareerTwinTab({ data }: CareerTwinTabProps) {
  const { careerTwin, profile, scores } = data;

  // What-If Simulator states
  const [hasAwsCert, setHasAwsCert] = useState(false);
  const [hasHackathonWin, setHasHackathonWin] = useState(false);
  const [hasInternshipExp, setHasInternshipExp] = useState(false);
  const [simSemester, setSimSemester] = useState(profile.currentSemester);

  // Dynamic simulation formula
  const baseProb = careerTwin.successProbability; // e.g. 72%
  let additionalPoints = 0;
  if (hasAwsCert) additionalPoints += 8;
  if (hasHackathonWin) additionalPoints += 12;
  if (hasInternshipExp) additionalPoints += 15;
  
  // semester scaling
  const semDiff = simSemester - profile.currentSemester;
  additionalPoints += semDiff * 4;

  const simulatedProbability = Math.min(99, baseProb + additionalPoints);

  return (
    <div id="careertwin-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Your Digital Career Twin</h2>
          <p className="text-sm text-slate-500">Autonomous modeling and predictive simulations forecasting long-term placement weights.</p>
        </div>
        <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-indigo-500 fill-current" /> Active Career Twin Sandbox
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Twin Status & Success Probability Forecasts */}
        <div className="lg:col-span-4 p-6 bg-slate-900 border border-slate-800 text-white rounded-2xl flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Twin Baseline Engine
            </h3>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Outlook</span>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                {careerTwin.currentStatus}
              </p>
            </div>

            {/* Simulated Probability Gauge */}
            <div className="py-2 text-center space-y-2">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-950/40 relative">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-blue-400">{simulatedProbability}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PROBABILITY</span>
                  </div>
                  {/* Visual rotating glow */}
                  <div className="absolute -inset-0.5 border-2 border-dashed border-indigo-500/30 rounded-full animate-[spin_10s_infinite_linear]"></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed leading-normal">
                Predictive probability of landing an elite career tier role at graduation.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-820 rounded-xl space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth Forecast</h4>
            <p className="text-xs text-slate-300 leading-relaxed leading-normal">
              {careerTwin.forecastSummary}
            </p>
          </div>
        </div>

        {/* Right: What-If Simulator Sandbox Console */}
        <div className="lg:col-span-8 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 className="w-4.5 h-4.5 text-blue-500" /> What-If Sandbox Simulator
              </h3>
              <span className="text-xs text-slate-400 font-medium italic">Simulate alternative growth factors</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Equip virtual achievements, mock certifications, or simulate progressive semesters to immediately witness how your virtual digital career twin's trajectory and compatibility scores scale up of target placement indexes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Simulator togglers */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Simulate Achievements</h4>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/50 cursor-pointer text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="sim-aws-cert"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      checked={hasAwsCert}
                      onChange={(e) => setHasAwsCert(e.target.checked)}
                    />
                    <span>AWS Cloud Practitioner Cert</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+8% Prob</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/50 cursor-pointer text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="sim-hackathon"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      checked={hasHackathonWin}
                      onChange={(e) => setHasHackathonWin(e.target.checked)}
                    />
                    <span>National Hackathon Winner</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% Prob</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/50 cursor-pointer text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="sim-intern"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      checked={hasInternshipExp}
                      onChange={(e) => setHasInternshipExp(e.target.checked)}
                    />
                    <span>6-Month Corporate Internship</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+15% Prob</span>
                </label>
              </div>

              {/* Semester projection slider */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Simulate Semester Timeline</h4>
                  <p className="text-[10px] text-slate-400">Jump ahead in academic progress</p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Sem {profile.currentSemester} (Current)</span>
                    <span className="text-indigo-600">Simulating: Sem {simSemester}</span>
                  </div>

                  <input 
                    type="range" 
                    id="sim-sem-slider"
                    min={profile.currentSemester} 
                    max="8" 
                    step="1" 
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={simSemester}
                    onChange={(e) => setSimSemester(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Sem {profile.currentSemester}</span>
                    <span>Sem 8</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  *Advancing semesters factors in cumulative baseline projects and core coursework.
                </p>
              </div>
            </div>
          </div>

          {/* Sandbox Visual Console Logs (Telemetry feel) */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 font-mono text-[10px] space-y-1">
            <div className="flex items-center text-blue-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping mr-1.5"></span>
              <span>TELEMETRY SANDBOX SIMULATOR REBOOT SEQUENCE COMPLETE...</span>
            </div>
            <p>AWS Certification Flag: {hasAwsCert ? 'ACTIVE [CALCULATING RE-ALIGNMENT WEIGHTS]' : 'INACTIVE'}</p>
            <p>Hackathon Flag: {hasHackathonWin ? 'ACTIVE [LIFTING PORTFOLIO RATING INDEX +12%]' : 'INACTIVE'}</p>
            <p>Simulating Academic Sem: {simSemester} [SECTOR GROWTH ADJUSTED TO TARGET {profile.careerTarget}]</p>
            <p className="text-emerald-400 font-bold">PREDICTED SUCCESS INDEX: {simulatedProbability}% [MARGIN FOR VARIANCE 4.2%]</p>
          </div>
        </div>

      </div>

      {/* Alternative Career Paths */}
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-emerald-500" /> Alternate Forecast Path Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerTwin.alternativePaths?.map((alt) => (
            <div key={alt.role} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 hover:bg-slate-50 transition">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800">{alt.role}</h4>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {alt.probability}% Success Chance
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-705 text-slate-700">Required Gap Bridge:</strong> {alt.gapToBridge}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
