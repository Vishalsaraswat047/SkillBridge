/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  degree: string;
  branch: string;
  college: string;
  currentSemester: number;
  skills: string[]; // Current skills
  certifications: string[];
  interests: string[];
  careerTarget: string; // Target Role
}

export interface CareerPathFit {
  role: string;
  matchPercentage: number;
  description: string;
  suitabilityReason: string;
}

export interface SkillGapAnalysis {
  strengths: string[];
  missingSkills: string[];
  improvementAreas: {
    skill: string;
    description: string;
    severity: "Low" | "Medium" | "High";
  }[];
}

export interface MonthMilestone {
  month: number;
  title: string;
  focus: string;
  milestones: string[];
  weeklyPlans: {
    week: number;
    tasks: {
      id: string;
      text: string;
      skillToAcquire?: string;
      completed: boolean;
    }[];
  }[];
}

export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  industryRelevance: string; // e.g. "Healthcare", "FinTech", "SaaS"
  skillsAcquired: string[];
  estimatedHours: number;
  status: "Suggested" | "In Progress" | "Completed";
}

export interface CareerTwinSim {
  currentStatus: string;
  projectedGrowth: { label: string; score: number }[]; // Monthly projection for next 6 months
  successProbability: number; // e.g. 75%
  alternativePaths: {
    role: string;
    probability: number;
    gapToBridge: string;
  }[];
  forecastSummary: string;
}

export interface MatchOpportunity {
  id: string;
  type: "Internship" | "Hackathon" | "Competition" | "Scholarship";
  title: string;
  organization: string;
  deadline: string;
  eligibility: string;
  relevanceMatch: number; // match rating e.g., 95
  skillsRequired: string[];
  url?: string;
}

export interface CareerAnalysisResult {
  profile: StudentProfile;
  careerFits: CareerPathFit[];
  skillGap: SkillGapAnalysis;
  roadmap: MonthMilestone[];
  recommendedProjects: RecommendedProject[];
  opportunities: MatchOpportunity[];
  careerTwin: CareerTwinSim;
  scores: {
    careerReadiness: number;
    portfolioStrength: number;
    skillCoverage: number;
    employability: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
