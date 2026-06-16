/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { Plus, X, GraduationCap, Code, Compass, Target, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
}

interface IndustryStream {
  id: string;
  name: string;
  icon: string;
  degrees: string[];
  specializations: string[];
  skills: string[];
  interests: string[];
  targets: { role: string; desc: string; icon: string }[];
}

const INDUSTRY_STREAMS: IndustryStream[] = [
  {
    id: 'cs',
    name: 'Computer Science & IT',
    icon: '💻',
    degrees: ['B.Tech Computer Science', 'M.Tech Computer Science', 'B.Sc Computer Science', 'MCA', 'M.Sc IT'],
    specializations: ['Artificial Intelligence', 'Cybersecurity', 'Web Engineering', 'Data Science', 'Cloud Computing', 'Database Systems', 'Mobile App Development'],
    skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL', 'HTML/CSS', 'Git', 'Docker', 'React', 'Node.js', 'FastAPI', 'Pandas', 'AWS', 'PostgreSQL'],
    interests: ['Artificial Intelligence', 'Cybersecurity', 'Web Development', 'Data Science', 'Product Management', 'Cloud Computing', 'SaaS'],
    targets: [
      { role: 'AI Engineer', desc: 'Build and deploy machine learning models, neural networks, and prompt workflows.', icon: '🧠' },
      { role: 'Data Scientist', desc: 'Analyze complex data paradigms, make growth forecasts, and construct descriptive charts.', icon: '📊' },
      { role: 'Software Developer', desc: 'Formulate scalable APIs, client interfaces, microservices, and web infrastructure.', icon: '💻' },
      { role: 'Cybersecurity Analyst', desc: 'Secure cloud systems, conduct network surveillance, and design defensive schemas.', icon: '🛡️' },
      { role: 'Startup Founder', desc: 'MVP development, scalable platform features, and user acquisition.', icon: '🚀' }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics & Electrical',
    icon: '⚡',
    degrees: ['B.Tech Electronics & Communication', 'Electrical Engineering', 'B.Tech Instrumentation', 'M.Tech Microelectronics', 'B.E. Power Systems'],
    specializations: ['VLSI Design', 'Embedded Systems', 'IoT & Automation', 'EV Technology', 'Robotics & Control', 'Signal Processing', 'UAV Systems'],
    skills: ['VLSI', 'Embedded Systems', 'PCB Design', 'IoT', 'Robotics', 'Signal Processing', 'FPGA Development', 'UAV Systems', 'EV Technology', 'Semiconductor Design', 'C/Assembly', 'MATLAB', 'Digital Systems', 'Microprocessors'],
    interests: ['Semiconductor Technology', 'VLSI Design', 'Robotics & Automation', 'UAV Systems', 'Embedded AI', 'EV Systems', 'IoT', 'Communication Networks'],
    targets: [
      { role: 'VLSI Engineer', desc: 'Design and verify integrated circuits, silicon microarchitecture, and FPGA layouts.', icon: '🎛️' },
      { role: 'Embedded Systems Engineer', desc: 'Develop low-level firmware, microcontrollers, real-time operating systems (RTOS), and device drivers.', icon: '🔬' },
      { role: 'Robotics Engineer', desc: 'Create autonomous robotic structures, control systems, and robotic operating systems (ROS).', icon: '🤖' },
      { role: 'Semiconductor Engineer', desc: 'Research silicon fabrication processes, semiconductor material structures, and cleanroom technologies.', icon: '💾' },
      { role: 'EV Systems Engineer', desc: 'Optimize electric vehicle battery management, power converters, and safety systems.', icon: '🔋' }
    ]
  },
  {
    id: 'mechanical',
    name: 'Mechanical & Civil',
    icon: '🏗️',
    degrees: ['Mechanical Engineering', 'Civil Engineering', 'Production Engineering', 'Automotive Engineering', 'B.Arch Architecture'],
    specializations: ['CAD/CAM Design', 'Thermal & Fluid Dynamics', 'Structural Analysis', 'Smart Manufacturing', 'Robotics', 'Material Science', 'Geotechnical Engineering'],
    skills: ['Mechanical CAD', 'CAM', 'Manufacturing Process', 'SolidWorks', 'AutoCAD', 'ANSYS', 'Thermodynamics', 'Product Design', 'Industrial Automation', 'Structural Analysis', 'Revit', 'Heat Transfer', 'Finite Element Analysis'],
    interests: ['Mechanical Design', 'Automotive Engineering', 'Robotics & Automation', 'Structural Design', 'Smart Manufacturing', 'Fluid Dynamics', 'Renewable Energy'],
    targets: [
      { role: 'CAD Designer', desc: 'Produce high-precision engineering blueprints, 3D component drafts, and parametric layouts.', icon: '📐' },
      { role: 'Mechanical Research Engineer', desc: 'Simulate stress/thermal properties, materials research, and automotive physics prototyping.', icon: '⚙️' },
      { role: 'Industrial Automation Engineer', desc: 'Deploy robotic assembly lines, programmable logic controllers (PLCs), and supply chain configurations.', icon: '🏭' },
      { role: 'Structural Civil Engineer', desc: 'Deconstruct smart structural models, load bearing assessments, and civil blueprints.', icon: '🌉' }
    ]
  },
  {
    id: 'business',
    name: 'Business, MBA & Commerce',
    icon: '📊',
    degrees: ['BBA', 'B.Com', 'MBA', 'M.Com', 'B.Sc Economics'],
    specializations: ['Marketing Management', 'Finance & Investment', 'HR & Leadership', 'Business Analytics', 'Operations & Supply Chain', 'Entrepreneurship'],
    skills: ['Marketing', 'Finance', 'HR Management', 'Business Analytics', 'Sales Strategy', 'Operations', 'Excel & Modeling', 'Tableau / PowerBI', 'SQL', 'Product Strategy', 'Leadership', 'Negotiation', 'Market Research'],
    interests: ['Digital Marketing', 'Product Management', 'Consulting', 'Corporate Finance', 'Entrepreneurship', 'Business Intelligence', 'Market Research'],
    targets: [
      { role: 'Product Manager', desc: 'Iterate feature specifications, lead multi-functional teams, roadmap product deliveries, and assess metrics.', icon: '🎯' },
      { role: 'Business Analyst', desc: 'Translate business data streams, optimize operating processes, and create KPI visuals.', icon: '📈' },
      { role: 'Financial Analyst', desc: 'Build financial spreadsheets, forecast cash streams, and structural equity assessments.', icon: '💵' },
      { role: 'Digital Marketing Manager', desc: 'Engineer viral content campaigns, optimize SEM/SEO channels, and control acquisition budgets.', icon: '📢' },
      { role: 'Operations Consultant', desc: 'Formulate organizational strategy, reorganize supply operations, and solve key business challenges.', icon: '🤝' }
    ]
  },
  {
    id: 'design',
    name: 'Design, Architecture & Games',
    icon: '🎨',
    degrees: ['B.Des Interior Design', 'B.Arch Architecture', 'B.Sc Game Design & Animation', 'Bachelor of Fine Arts'],
    specializations: ['Interior Architecture', 'Game Engineering', 'UI/UX Design', '3D Animation', 'Sustainable Design', 'Fictional Level Design'],
    skills: ['AutoCAD', 'SketchUp', 'Unity', 'Unreal Engine', '3D Rendering', 'Figma', 'Adobe Creative Cloud', 'Blender', 'Maya', 'Space Planning', 'Game Physics', 'Level Design', 'Graphic Design', 'Color Theory'],
    interests: ['UX/UI Design', 'Product Design', 'Interior Architecture', '3D Visualization', 'Game Programming', 'Creative Technologies', 'Sustainable Design'],
    targets: [
      { role: 'Interior Designer', desc: 'Sculpture interior space plans, material selections, and dynamic architectural renderings.', icon: '🛋️' },
      { role: 'Game Developer', desc: 'Program interactive mechanics, construct levels, and code entity logic in Unity/Unreal.', icon: '🎮' },
      { role: 'UX/UI Designer', desc: 'Animate wireframes, high-fidelity prototypes, user research scripts, and interface components.', icon: '📱' },
      { role: '3D Animator / Visualizer', desc: 'Texture complex 3D meshes, configure ray-traced lighting landscapes, and keyframe characters.', icon: '🧊' },
      { role: 'Architectural Visualizer', desc: 'Plan and model high-fidelity 3D structural, landscaping, and exterior environmental models.', icon: '🏠' }
    ]
  },
  {
    id: 'biotech',
    name: 'Biotech & Medical Sci',
    icon: '🧬',
    degrees: ['B.Tech Biotechnology', 'B.Sc Biotechnology', 'B.Pharm', 'M.Pharm', 'Medical Sciences', 'B.Sc Biochemistry'],
    specializations: ['Bioinformatics', 'Clinical Research', 'Drug Discovery', 'Bioprocess Development', 'Genetics', 'Virology'],
    skills: ['Bioinformatics', 'CRISPR', 'Molecular Cloning', 'Bioprocess Analysis', 'Clinical Research', 'HPLC', 'Computational Biology', 'Python (Biopython)', 'R Scripting', 'Cell Biology', 'Genomic Data', 'Lab Safety'],
    interests: ['Genomics', 'Drug Discovery', 'Biopharmaceuticals', 'Medical Diagnostics', 'AgriTech', 'Synthetic Biology'],
    targets: [
      { role: 'Bioinformatician', desc: 'Model genomic sequences, biological data mining, and structural protein visualizations.', icon: '🔬' },
      { role: 'Pharmaceutical Scientist', desc: 'Formulate chemical drugs, run active ingredient modeling, and design clinical trial protocols.', icon: '💊' },
      { role: 'Biotech Research Associate', desc: 'Perform molecular assays, gene editing runs, and cellular culture prototyping.', icon: '🧫' }
    ]
  },
  {
    id: 'professional',
    name: 'Law, Agri, Aviation & More',
    icon: '⚖️',
    degrees: ['Bachelor of Laws (LL.B)', 'B.Sc Agriculture', 'B.Sc Aviation & Flight Operations', 'Architecture & Planning', 'Other Professional Program'],
    specializations: ['Corporate Law', 'Precision Farming', 'Aviation Logistics', 'Environmental Compliance', 'Criminal Justice', 'Agro-meteorology'],
    skills: ['Legal Drafting', 'Contract Law', 'Agro-ecology', 'Precision Farming', 'Flight Theory', 'Aviation Safety', 'Regulatory Compliance', 'Case Analysis', 'GIS Mapping', 'Analytical Writing', 'Litigation Support'],
    interests: ['Corporate Law', 'Sustainable Agriculture', 'Aviation Logistics', 'Environmental Compliance', 'Intellectual Property', 'Public Policy'],
    targets: [
      { role: 'Corporate Counsel', desc: 'Draft commercial contracts, review trade/IP compliance guidelines, and advise corporate boards.', icon: '⚖️' },
      { role: 'Precision Agriculturist', desc: 'Optimize crop yields using smart GIS mappings, sensor telemetry, and agrochemical modeling.', icon: '🌾' },
      { role: 'Aviation Operations Consultant', desc: 'Design flight crew schedules, safety compliance frameworks, and terminal logistics grids.', icon: '🛫' }
    ]
  }
];

export default function Onboarding({ onSubmit, isLoading }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedStream, setSelectedStream] = useState<IndustryStream>(INDUSTRY_STREAMS[0]);
  
  // Basic states
  const [name, setName] = useState('');
  const [degree, setDegree] = useState(INDUSTRY_STREAMS[0].degrees[0]);
  const [branch, setBranch] = useState(INDUSTRY_STREAMS[0].specializations[0]);
  const [college, setCollege] = useState('');
  const [currentSemester, setCurrentSemester] = useState(4);
  
  // Custom presets states that adapt
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = useState('');

  // When selected stream changes, auto-adapt options dynamically!
  const handleStreamChange = (stream: IndustryStream) => {
    setSelectedStream(stream);
    setDegree(stream.degrees[0]);
    setBranch(stream.specializations[0]);
    
    // Auto populate top skills & interests from that stream
    setSelectedSkills(stream.skills.slice(0, 3));
    setSelectedInterests(stream.interests.slice(0, 2));
    setSelectedTarget(stream.targets[0]?.role || '');
  };

  // Initialize defaults on mount
  useEffect(() => {
    handleStreamChange(INDUSTRY_STREAMS[0]);
  }, []);

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const profile: StudentProfile = {
        name: name || 'Student Pro',
        degree,
        branch,
        college: college || 'Global Education Institute',
        currentSemester,
        skills: selectedSkills,
        certifications: [],
        interests: selectedInterests,
        careerTarget: selectedTarget
      };
      onSubmit(profile);
    }
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div id="onboarding-container" className="max-w-3xl mx-auto my-6 p-8 bg-white rounded-2xl border border-slate-100 shadow-xl relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {isLoading ? (
        <div className="text-center py-16 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500/25 border-t-blue-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 font-sans tracking-tight">Generating Multi-Industry Intelligence...</h3>
          <p className="text-slate-500 max-w-md text-xs leading-relaxed mb-6">
            SkillBridge AI is mapping your exact roadmap, computing critical skill gaps based on your degree, sizing your Digital Career Twin, and compiling live opportunities matching your profile.
          </p>
          <div className="space-y-2 w-full max-w-sm text-left">
            <div className="flex items-center text-xs text-blue-600 font-semibold gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              Structuring specialized curriculum checkpoints...
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-[progress_3s_infinite_linear]" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top progress tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-black tracking-widest mb-2">
              <span className="text-blue-600">STEP {step} OF 4</span>
              <span>{Math.round(progressPercent)}% COMPLETE</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="min-h-[385px]">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-6"
                id="step-academic"
              >
                <div className="flex items-start gap-3.5 mb-1">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Academic & Educational Background</h2>
                    <p className="text-xs text-slate-500">Pick your educational vertical stream, degree and specialization.</p>
                  </div>
                </div>

                <div className="space-y-5 pt-1">
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      id="input-name"
                      placeholder="e.g. Varsha Saraswat" 
                      required
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Educational Stream Family Cards Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Educational Stream / Industry Family</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {INDUSTRY_STREAMS.map(stream => {
                        const isChosen = selectedStream.id === stream.id;
                        return (
                          <button
                            key={stream.id}
                            type="button"
                            onClick={() => handleStreamChange(stream)}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 cursor-pointer ${
                              isChosen 
                                ? 'bg-blue-600/95 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xl">{stream.icon}</span>
                            <span className="text-[10px] font-black leading-tight line-clamp-1">{stream.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Degree program choice */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Degree Program</label>
                        <span className="text-[9px] text-blue-600 font-bold">Suggested defaults</span>
                      </div>
                      <input 
                        type="text" 
                        id="input-degree"
                        placeholder="e.g. B.Tech Electronics & Communication" 
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 transition mb-2"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-1">
                        {selectedStream.degrees.map(deg => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => setDegree(deg)}
                            className={`px-2 py-1 text-[9px] font-semibold border rounded-lg transition ${
                              degree === deg 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            {deg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Specialization / branch choice */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branch / Specialization</label>
                        <span className="text-[9px] text-blue-600 font-bold">Suggested defaults</span>
                      </div>
                      <input 
                        type="text" 
                        id="input-branch"
                        placeholder="e.g. Embedded Systems" 
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 transition mb-2"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-1">
                        {selectedStream.specializations.slice(0, 3).map(br => (
                          <button
                            key={br}
                            type="button"
                            onClick={() => setBranch(br)}
                            className={`px-2 py-1 text-[9px] font-semibold border rounded-lg transition ${
                              branch === br 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            {br}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">College / Institution</label>
                      <input 
                        type="text" 
                        id="input-college"
                        placeholder="e.g. Stanford University" 
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 transition"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Semester</label>
                      <select 
                        id="select-semester"
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 transition cursor-pointer"
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(parseInt(e.target.value))}
                      >
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
                id="step-skills"
              >
                <div className="flex items-start gap-3.5 mb-1">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Your Current Skills</h2>
                    <p className="text-xs text-slate-500">Add things you can already perform. Presets match your <strong>{selectedStream.name}</strong> selection!</p>
                  </div>
                </div>

                {/* Custom Skill Input Form */}
                <form onSubmit={addCustomSkill} className="flex gap-2 pt-1">
                  <input 
                    type="text" 
                    id="input-custom-skill"
                    placeholder="Enter customized skill (e.g. MATLAB, Financial Modeling)..." 
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50/50 text-xs"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    id="btn-add-skill"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Custom
                  </button>
                </form>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Adaptive Skill Set Suggestions</h4>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {selectedStream.skills.map(skill => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          id={`skill-preset-${skill.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10' 
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedSkills.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Skills ({selectedSkills.length})</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkills.map(s => (
                        <div key={s} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] text-blue-600 font-bold flex items-center gap-1 animate-fade-in">
                          {s}
                          <button onClick={() => toggleSkill(s)} className="text-blue-400 hover:text-blue-600 cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
                id="step-interests"
              >
                <div className="flex items-start gap-3.5 mb-1">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Specialized Learning Interests</h2>
                    <p className="text-xs text-slate-500">Pick sectors that fit your current branch of interest and degree choice.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedStream.interests.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        id={`interest-${interest.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3.5 rounded-xl text-left border text-xs font-bold cursor-pointer transition flex items-center justify-between ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm shadow-emerald-500/5' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span>{interest}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
                id="step-target"
              >
                <div className="flex items-start gap-3.5 mb-1">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Target Career Goal</h2>
                    <p className="text-xs text-slate-500">Identify your primary professional target. We adapt your 6-month roadmap sprints around this.</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1 max-h-[300px] overflow-y-auto pr-1">
                  {selectedStream.targets.map(preset => {
                    const isSelected = selectedTarget === preset.role;
                    return (
                      <button
                        key={preset.role}
                        type="button"
                        id={`target-${preset.role.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSelectedTarget(preset.role)}
                        className={`w-full p-4 rounded-xl text-left border transition flex items-start gap-4 cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50/70 border-blue-500 shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/10'
                        }`}
                      >
                        <div className="text-2xl mt-0.5">{preset.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
                            {preset.role}
                            {isSelected && <span className="px-2 py-0.5 bg-blue-600 text-[9px] text-white font-bold rounded-full">Target Configured</span>}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-normal leading-relaxed">{preset.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom navigation buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 bg-white">
            <button
              type="button"
              id="onboarding-prev"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                step === 1 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              Back
            </button>

            <button
              type="button"
              id="onboarding-next"
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition cursor-pointer"
            >
              {step === 4 ? 'Launch Intelligence Board' : 'Continue'}
              {step === 4 ? <Sparkles className="w-4 h-4 animate-bounce" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
