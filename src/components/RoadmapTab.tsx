/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerAnalysisResult, MonthMilestone } from '../types';
import { CheckSquare, Square, Calendar, ChevronRight, ChevronDown, Award, Trash, Play } from 'lucide-react';

interface RoadmapTabProps {
  data: CareerAnalysisResult;
  onUpdateAnalysis: (updatedData: CareerAnalysisResult) => void;
}

export default function RoadmapTab({ data, onUpdateAnalysis }: RoadmapTabProps) {
  const { roadmap, scores } = data;
  const [activeMonth, setActiveMonth] = useState<number>(1);

  // Toggle a single task inside the roadmap
  const handleToggleTask = (monthNum: number, weekNum: number, taskId: string) => {
    const updatedRoadmap = roadmap.map(m => {
      if (m.month !== monthNum) return m;

      const updatedWeeklyPlans = m.weeklyPlans.map(w => {
        if (w.week !== weekNum) return w;

        const updatedTasks = w.tasks.map(t => {
          if (t.id !== taskId) return t;
          return { ...t, completed: !t.completed };
        });

        return { ...w, tasks: updatedTasks };
      });

      return { ...m, weeklyPlans: updatedWeeklyPlans };
    });

    // Score simulation logic: calculate completed task ratio
    let totalTasksCount = 0;
    let completedTasksCount = 0;

    updatedRoadmap.forEach(m => {
      m.weeklyPlans.forEach(w => {
        w.tasks.forEach(t => {
          totalTasksCount++;
          if (t.completed) completedTasksCount++;
        });
      });
    });

    const completionRatio = completedTasksCount / (totalTasksCount || 1);
    // Linearly scale readiness based on completed tasks
    const bonusReadiness = Math.round(completionRatio * 30); // max 30% bonus
    const originalBaseReadiness = 45; // baseline from initial profile
    const targetCareerReadiness = Math.min(100, originalBaseReadiness + bonusReadiness);

    const updatedData: CareerAnalysisResult = {
      ...data,
      roadmap: updatedRoadmap,
      scores: {
        ...scores,
        careerReadiness: targetCareerReadiness
      }
    };

    onUpdateAnalysis(updatedData);
  };

  const getMonthCompletion = (m: MonthMilestone) => {
    let tasksCount = 0;
    let completedCount = 0;
    m.weeklyPlans.forEach(w => {
      w.tasks.forEach(t => {
        tasksCount++;
        if (t.completed) completedCount++;
      });
    });
    return tasksCount === 0 ? 0 : Math.round((completedCount / tasksCount) * 100);
  };

  return (
    <div id="roadmap-dashboard" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Learning Roadmap System</h2>
        <p className="text-sm text-slate-500">Chronological learning sprints configured directly to bypass structural target blockages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Accordion Sidebar: Months 1 to 6 Navigation buttons */}
        <div className="col-span-1 lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">6-Month Iterative Blocks</h3>
          
          <div className="space-y-2.5">
            {roadmap.map((monthPlan) => {
              const isActive = activeMonth === monthPlan.month;
              const percent = getMonthCompletion(monthPlan);
              return (
                <button
                  key={monthPlan.month}
                  id={`roadmap-month-nav-${monthPlan.month}`}
                  onClick={() => setActiveMonth(monthPlan.month)}
                  className={`w-full p-4 rounded-xl text-left border cursor-pointer transition flex items-center justify-between ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15' 
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                      Month {monthPlan.month}
                    </span>
                    <h4 className="text-sm font-bold truncate max-w-[180px]">{monthPlan.title}</h4>
                    <span className={`text-[10px] font-medium block ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      Focus: <span className="font-bold">{monthPlan.focus}</span>
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 pl-1">
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-600'}`}>
                      {percent}%
                    </span>
                    <div className="w-12 bg-slate-100/30 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${isActive ? 'bg-white' : 'bg-blue-600'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Month Detail Workspace */}
        <div className="col-span-1 lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          {(() => {
            const currentPlan = roadmap.find(m => m.month === activeMonth);
            if (!currentPlan) return <p className="text-xs text-slate-400">Loading plan Details...</p>;

            const progress = getMonthCompletion(currentPlan);

            return (
              <div className="space-y-6">
                {/* Header overview area for the selected month */}
                <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">
                      Onboarding Target Month {currentPlan.month}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-800 pt-1">{currentPlan.title}</h3>
                    <p className="text-xs text-slate-505 text-slate-500">Strategic focus: {currentPlan.focus}</p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold block">Month Completion</span>
                      <span className="text-lg font-bold text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center p-1.5 text-blue-600 font-bold text-xs bg-slate-50">
                      {progress}%
                    </div>
                  </div>
                </div>

                {/* Major Month milestones Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Month Milestones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentPlan.milestones.map((mil, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">{mil}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Weekly Breakdown with interactive checklist task rows */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Weekly Micro-Sprints</h4>

                  <div className="space-y-3">
                    {currentPlan.weeklyPlans.map((wp) => (
                      <div key={wp.week} className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/20">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">Week {wp.week} Tasks</span>
                          <span className="text-[10px] text-blue-600 font-semibold bg-blue-50/50 px-2 py-0.5 rounded-full">Weekly Block</span>
                        </div>

                        <div className="space-y-2.5">
                          {wp.tasks.map((task) => (
                            <div 
                              key={task.id} 
                              id={`roadmap-task-${task.id}`}
                              onClick={() => handleToggleTask(currentPlan.month, wp.week, task.id)}
                              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition ${
                                task.completed 
                                  ? 'bg-slate-50 border-slate-200 text-slate-400' 
                                  : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700 shadow-sm'
                              }`}
                            >
                              <div className="mt-0.5">
                                {task.completed ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600 fill-blue-50" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>

                              <div className="flex-1 space-y-1">
                                <p className={`text-xs ${task.completed ? 'line-through text-slate-400 font-medium' : 'font-semibold text-slate-700'}`}>
                                  {task.text}
                                </p>
                                {task.skillToAcquire && (
                                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${task.completed ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                    Skill focus: {task.skillToAcquire}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
