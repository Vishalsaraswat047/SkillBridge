/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

// Initialize Groq client safely
let groq: Groq | null = null;
const apiKey = process.env.GROQ_API_KEY;

if (apiKey && apiKey !== 'MY_GROQ_API_KEY') {
  try {
    groq = new Groq({ apiKey });
    console.log('Groq API client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Groq API client:', err);
  }
} else {
  console.log('No valid GROQ_API_KEY found. Utilizing intelligent local simulation logic.');
}

// Robust fallback static generators tailored for high fidelity student path choices across ECE, Mechanical, Business, Design, Biotech, Law, and CS
const getFallbackAnalysis = (profile: any) => {
  const target = profile.careerTarget || 'AI Engineer';
  const skillsList = profile.skills || [];
  const targetLower = target.toLowerCase();
  
  // Customizing fits based on goals
  let fits = [
    { role: target, matchPercentage: 88, description: `The ideal path aligning with your target goal of becoming a ${target}.`, suitabilityReason: `Matches your current interest in ${profile.interests?.join(', ') || 'this field'} and your registered educational path.` },
  ];

  let missing: string[] = [];
  let recommendedProjects: any[] = [];
  let opportunities: any[] = [];

  if (targetLower.includes('vlsi') || targetLower.includes('embedded') || targetLower.includes('robotics') || targetLower.includes('ev') || targetLower.includes('semiconductor') || targetLower.includes('electronics')) {
    fits.push(
      { role: 'Embedded Systems Engineer', matchPercentage: 82, description: 'Microcontroller programming and hardware interfacing specialist.', suitabilityReason: 'Matches your core hardware-level interests.' },
      { role: 'VLSI Architect', matchPercentage: 74, description: 'Design microchip logical gates and layout structures.', suitabilityReason: 'Leverages your engineering mathematical foundations.' }
    );
    missing = ['Verilog / VHDL Coding', 'FPGA Prototyping Tools', 'RTOS Microcontroller Basics', 'PCB Layout & Signal Integrity', 'C/Assembly Language'];
    recommendedProjects = [
      {
        id: "p1",
        title: "FPGA-Based Hardware Controller",
        description: "Verify and build a functional UART receiver circuit on standard FPGA developmental boards with signal timing visualizations.",
        difficulty: "Intermediate",
        industryRelevance: "Semiconductor & Aerospace",
        skillsAcquired: ['Verilog / VHDL', 'FPGA Prototyping Tools', 'Oscilloscope debugging'],
        estimatedHours: 45,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "Autonomous Drone Flight MCU firmware",
        description: "Write localized low-latency PID controller firmware for quadcopter stabilization on ARM Cortex microcontrollers.",
        difficulty: "Advanced",
        industryRelevance: "Robotics & UAV logistics",
        skillsAcquired: ['RTOS Microcontroller Basics', 'PID controller algorithms', 'C/Assembly Language'],
        estimatedHours: 65,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "IoT Environmental Telemetry Node",
        description: "Model and print a single-layer PCB routing temperature sensors to ESP32 over SPI communication channels.",
        difficulty: "Beginner",
        industryRelevance: "Smart Infrastructure",
        skillsAcquired: ['PCB Layout & Signal Integrity', 'IoT', 'SPI Bus Protocols'],
        estimatedHours: 25,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "Hardware Engineering Intern",
        organization: "Advanced Micro Chip Architectures",
        deadline: "July 18, 2026",
        eligibility: `Electronics/EE Students, Sem ${profile.currentSemester || '5'}+`,
        relevanceMatch: 95,
        skillsRequired: ['VLSI', 'Verilog / VHDL Coding']
      },
      {
        id: "o2",
        type: "Hackathon",
        title: "Robotics Autonomous Rover Combat",
        organization: "National Robotics Alliance",
        deadline: "August 04, 2026",
        eligibility: "Open to undergraduate engineering teams",
        relevanceMatch: 88,
        skillsRequired: ['Embedded Systems', 'Robotics', 'C/Assembly Language']
      },
      {
        id: "o3",
        type: "Competition",
        title: "Silicon layout Design Cup",
        organization: "Taiwan Semiconductor Foundation",
        deadline: "August 20, 2026",
        eligibility: "Individual student entries",
        relevanceMatch: 82,
        skillsRequired: ['Semiconductor Design', 'PCB Layout & Signal Integrity']
      }
    ];
  } else if (targetLower.includes('product') || targetLower.includes('business') || targetLower.includes('consult') || targetLower.includes('financial') || targetLower.includes('market') || targetLower.includes('operating') || targetLower.includes('mba') || targetLower.includes('com')) {
    fits.push(
      { role: 'Strategy Consultant', matchPercentage: 81, description: 'Solving core scaling bottlenecks for Fortune 500 businesses.', suitabilityReason: 'Leverages your analytical consulting interest.' },
      { role: 'Product Manager', matchPercentage: 76, description: 'Bridge consumer feedback with technology roadmap targets.', suitabilityReason: 'Matches your business strategy metrics.' }
    );
    missing = ['Business Case Modeling', 'Financial DCF Spreadsheet Valuation', 'Tableau Dashboards', 'Enterprise KPI Strategies', 'SQL Operations'];
    recommendedProjects = [
      {
        id: "p1",
        title: "SaaS Product Metrics Dashboard",
        description: "Analyze user churn rates and draft a comprehensive business intelligence report with interactive Tableau dashboards.",
        difficulty: "Intermediate",
        industryRelevance: "Global Consulting & Tech",
        skillsAcquired: ['Tableau Dashboards', 'SQL Operations', 'Product Strategy'],
        estimatedHours: 35,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "Ecommerce Expansion financial projection model",
        description: "Construct a highly dynamic 5-year discounted cash flow spreadsheet detailing ROI parameters for target geographies.",
        difficulty: "Advanced",
        industryRelevance: "Corporate Finance & VC",
        skillsAcquired: ['Business Case Modeling', 'Financial DCF Spreadsheet Valuation', 'Financial Analysis'],
        estimatedHours: 50,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "Consumer Acquisition Strategic Funnel Plan",
        description: "Audit existing SEM channels and construct an optimized viral marketing budget allocation framework.",
        difficulty: "Beginner",
        industryRelevance: "AdTech & SaaS",
        skillsAcquired: ['Marketing', 'Enterprise KPI Strategies', 'Analytical Writing'],
        estimatedHours: 20,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "Management Associate Intern",
        organization: "Boston McKinsey Consultants",
        deadline: "July 20, 2026",
        eligibility: `BBA/MBA/B.Com Students, Sem ${profile.currentSemester || '3'}+`,
        relevanceMatch: 95,
        skillsRequired: ['Business Case Modeling', 'Leadership']
      },
      {
        id: "o2",
        type: "Competition",
        title: "National Business Strategy Pitchathon",
        organization: "Venture Capitalist Summit 2026",
        deadline: "August 12, 2026",
        eligibility: "Undergrad business students",
        relevanceMatch: 90,
        skillsRequired: ['Product Strategy', 'Financial DCF Spreadsheet Valuation']
      },
      {
        id: "o3",
        type: "Hackathon",
        title: "FinTech Smart Analytics Cup",
        organization: "Bloomberg Financial Systems",
        deadline: "August 28, 2026",
        eligibility: "Open enrollment",
        relevanceMatch: 81,
        skillsRequired: ['Excel & Modeling', 'SQL Operations']
      }
    ];
  } else if (targetLower.includes('design') || targetLower.includes('game') || targetLower.includes('ux') || targetLower.includes('animat') || targetLower.includes('architect')) {
    fits.push(
      { role: 'UX/UI Design Lead', matchPercentage: 83, description: 'Create visually sound, tested, high converting digital workflows.', suitabilityReason: 'Matches your design aesthetics.' },
      { role: '3D Environmental Modeler', matchPercentage: 77, description: 'Sculpture structural spaces and digital objects.', suitabilityReason: 'Leverages your spatial understanding.' }
    );
    missing = ['Figma Layout Systems', '3D Blender Prototyping', 'Unity / Unreal Engine C#', 'Ray-Traced Scene Lighting', 'Space Ergonomics Planning'];
    recommendedProjects = [
      {
        id: "p1",
        title: "Interactive Game Prototyping in Unity",
        description: "Build a functioning level featuring physics-based collision rules, custom 3D textures, and path controllers.",
        difficulty: "Intermediate",
        industryRelevance: "Media & Indie Games",
        skillsAcquired: ['Unity / Unreal Engine C#', '3D Blender Prototyping', 'Game Physics'],
        estimatedHours: 45,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "Eco-Friendly Penthouse Space blueprint",
        description: "Draft structural interior drawings using AutoCAD, integrating modern sustainable material layouts.",
        difficulty: "Advanced",
        industryRelevance: "Sustainable Architecture",
        skillsAcquired: ['Space Ergonomics Planning', 'AutoCAD', 'SketchUp'],
        estimatedHours: 60,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "High-Fidelity Telemedicine App Prototype",
        description: "Create fully linked interactive telemedicine screen wireframes in Figma, complying with WCAG guidelines.",
        difficulty: "Beginner",
        industryRelevance: "Healthcare UX",
        skillsAcquired: ['Figma Layout Systems', 'UX/UI Design', 'Color Theory'],
        estimatedHours: 20,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "UI/UX Creative Intern",
        organization: "Pixel & Craft Agency",
        deadline: "July 22, 2026",
        eligibility: "Design & Animation Students",
        relevanceMatch: 96,
        skillsRequired: ['Figma Layout Systems', 'Figma']
      },
      {
        id: "o2",
        type: "Hackathon",
        title: "Immersive VR/XR Game Jam 2026",
        organization: "Unity Engine Creators Guild",
        deadline: "August 15, 2026",
        eligibility: "Open global developers",
        relevanceMatch: 87,
        skillsRequired: ['Unity / Unreal Engine C#', '3D Blender Prototyping']
      },
      {
        id: "o3",
        type: "Competition",
        title: "Modern Architectural Plan Award",
        organization: "Global Green Spaces Guild",
        deadline: "September 02, 2026",
        eligibility: "Undergrad students of Interior/Architecture",
        relevanceMatch: 82,
        skillsRequired: ['AutoCAD', 'Space Ergonomics Planning']
      }
    ];
  } else if (targetLower.includes('bio') || targetLower.includes('genom') || targetLower.includes('pharm') || targetLower.includes('med') || targetLower.includes('chem')) {
    fits.push(
      { role: 'Computational Biologist', matchPercentage: 84, description: 'Translate molecular sequences using computational code pipelines.', suitabilityReason: 'Matches your interest in biology-tech crossovers.' },
      { role: 'Drug Formulation Specialist', matchPercentage: 75, description: 'Formulate pharmaceutical compounds and run assays.', suitabilityReason: 'Leverages bio-chemical sciences foundations.' }
    );
    missing = ['CRISPR Vector Mapping', 'Biopython Data Pipelines', 'HPLC Assays Optimization', 'Statistical R Bioinformatics', 'Cell Assay Culturing'];
    recommendedProjects = [
      {
        id: "p1",
        title: "Biopython Genomic Data modeling",
        description: "Extract DNA file sets and model mutation severity variations using statistical data filters in Python.",
        difficulty: "Intermediate",
        industryRelevance: "Life Sciences & Genomics",
        skillsAcquired: ['Biopython Data Pipelines', 'Statistical R Bioinformatics', 'Computational Biology'],
        estimatedHours: 40,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "Active Ingredient Compound Formulation",
        description: "Draft a standardized test protocol optimizing chemical molecular weights for specific target receptor assays.",
        difficulty: "Advanced",
        industryRelevance: "Biopharmaceuticals",
        skillsAcquired: ['HPLC Assays Optimization', 'Clincal Research', 'Pharmacology'],
        estimatedHours: 55,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "CRISPR gene guide matching script",
        description: "Write simple text alignment script evaluating vector overlaps on synthetic genomics target models.",
        difficulty: "Beginner",
        industryRelevance: "Genetic Medicine",
        skillsAcquired: ['CRISPR Vector Mapping', 'Biopython', 'Excel'],
        estimatedHours: 25,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "Clinical Research Intern",
        organization: "Astra BioLabs International",
        deadline: "July 24, 2026",
        eligibility: "Biotech / Pharma students",
        relevanceMatch: 95,
        skillsRequired: ['HPLC Assays Optimization', 'Computational Biology']
      },
      {
        id: "o2",
        type: "Competition",
        title: "Genomic Sequencing Master Summit",
        organization: "World Health Bioinformatics",
        deadline: "August 16, 2026",
        eligibility: "Open researchers and students",
        relevanceMatch: 88,
        skillsRequired: ['Biopython Data Pipelines', 'Statistical R Bioinformatics']
      }
    ];
  } else if (targetLower.includes('law') || targetLower.includes('agri') || targetLower.includes('aviation') || targetLower.includes('counsel') || targetLower.includes('crop') || targetLower.includes('pilot')) {
    fits.push(
      { role: 'Regulatory Compliance Officer', matchPercentage: 81, description: 'Auditing systemic workflows for national safety protocols.', suitabilityReason: 'Perfect fit for your professional background.' }
    );
    missing = ['Commercial Contract Auditing', 'Analytical Regulatory Analysis', 'Case Trial Precedents Search', 'Precision Field Telemetry', 'Drone Drone Flight Theory'];
    recommendedProjects = [
      {
        id: "p1",
        title: "Corporate Contract Compliance Auditor",
        description: "Deconstruct and write a corporate guide targeting regulatory changes in employment and IP trade law laws.",
        difficulty: "Intermediate",
        industryRelevance: "Business Legal Services",
        skillsAcquired: ['Commercial Contract Auditing', 'Case Trial Precedents Search', 'Analytical Writing'],
        estimatedHours: 35,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "Precision Smart Yield Simulation Node",
        description: "Analyze crop yield datasets using GIS spatial mappings to optimize water distribution variables.",
        difficulty: "Advanced",
        industryRelevance: "Smart Agriculture",
        skillsAcquired: ['Precision Field Telemetry', 'GIS Mapping', 'Agro-ecology'],
        estimatedHours: 55,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "Civil Aviation Cabin Operations Checklist",
        description: "Formulate safety training workflows in compliance with FAA structural requirements.",
        difficulty: "Beginner",
        industryRelevance: "Aviation Logistics",
        skillsAcquired: ['Aviation Safety', 'Regulatory Compliance', 'Analytical Writing'],
        estimatedHours: 20,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "Legal Associate Intern",
        organization: "Alliance Legal & Corporate Advisors",
        deadline: "July 28, 2026",
        eligibility: "Law Candidates",
        relevanceMatch: 94,
        skillsRequired: ['Case Trial Precedents Search', 'Analytical Writing']
      },
      {
        id: "o2",
        type: "Competition",
        title: "Smart Field Precision Farming Cup",
        organization: "National Agro Tech Board",
        deadline: "August 18, 2026",
        eligibility: "Open Agriculture Students",
        relevanceMatch: 85,
        skillsRequired: ['Precision Field Telemetry', 'GIS Mapping']
      }
    ];
  } else if (targetLower.includes('cad') || targetLower.includes('mechanical') || targetLower.includes('civil') || targetLower.includes('structural') || targetLower.includes('solidworks') || targetLower.includes('thermo')) {
    fits.push(
      { role: 'Mechanical Simulation Architect', matchPercentage: 84, description: 'Execute virtual finite element stress audits for heavy machinery parts.', suitabilityReason: 'Leverages structural dynamics baselines.' }
    );
    missing = ['ANSYS FEA Thermal simulations', 'SolidWorks CAD modeling', 'GD&T Precision Parametrics', 'Revit Civil Blueprints', 'PLC Assembly programming'];
    recommendedProjects = [
      {
        id: "p1",
        title: "Heavy Heat-Exchanger Stress simulation",
        description: "Run comprehensive thermodynamic and mechanical loading tests over a customized structural steel joint assembly.",
        difficulty: "Intermediate",
        industryRelevance: "Thermal & Power Plant Automation",
        skillsAcquired: ['ANSYS FEA Thermal simulations', 'Thermodynamics', 'ANSYS'],
        estimatedHours: 40,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "PLC Integrated Robotic Arm path solver",
        description: "Code logic schedules coordinate pathways for standard 3-axis industrial arms manipulating parts.",
        difficulty: "Advanced",
        industryRelevance: "Manufacturing Automation",
        skillsAcquired: ['PLC Assembly programming', 'Industrial Automation', 'Robotics'],
        estimatedHours: 60,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "Civil Bridge load bearing sketch",
        description: "Construct parametric AutoCAD sketches of pre-stressed concrete structural trusses.",
        difficulty: "Beginner",
        industryRelevance: "Infrastructure Civil Drafting",
        skillsAcquired: ['SolidWorks CAD modeling', 'Structural Analysis', 'AutoCAD'],
        estimatedHours: 25,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "CAD & Simulation Intern",
        organization: "Advanced Propulsion Technologies",
        deadline: "July 31, 2026",
        eligibility: "Mechanical/Civil/Aero Students",
        relevanceMatch: 93,
        skillsRequired: ['SolidWorks CAD modeling', 'ANSYS FEA Thermal simulations']
      },
      {
        id: "o2",
        type: "Competition",
        title: "National CAD Drafting Championship",
        organization: "AutoDesk Engineering Association",
        deadline: "August 22, 2026",
        eligibility: "Individual enrollment",
        relevanceMatch: 86,
        skillsRequired: ['AutoCAD', 'Structural Analysis']
      }
    ];
  } else {
    // Default Fallback: Classic Software / CS
    fits.push(
      { role: 'Senior Software Developer', matchPercentage: 81, description: 'System scaling and modular backend architecture planning.', suitabilityReason: 'Matches programming skills.' },
      { role: 'Product Manager', matchPercentage: 70, description: 'Bridge consumer feedback with technology roadmap targets.', suitabilityReason: 'Fits multi-disciplinary student views.' }
    );
    missing = ['System Architecture Layouts', 'NextJS Framework setup', 'AWS cloud deployment', 'PostgreSQL database structures', 'Docker containerizing'];
    recommendedProjects = [
      {
        id: "p1",
        title: "Scalable SaaS Backend",
        description: "Construct an Express REST server matching PostgreSQL schemas and validated using custom unit tests.",
        difficulty: "Intermediate",
        industryRelevance: "SaaS Systems",
        skillsAcquired: ['PostgreSQL database structures', 'Node.js', 'System Architecture Layouts'],
        estimatedHours: 40,
        status: "Suggested"
      },
      {
        id: "p2",
        title: "Serverless Analytics Core",
        description: "Build an AWS Lambda system receiving telemetry streams and storing aggregates securely.",
        difficulty: "Advanced",
        industryRelevance: "Cloud Infrastructure",
        skillsAcquired: ['AWS cloud deployment', 'Docker containerizing', 'FastAPI'],
        estimatedHours: 55,
        status: "Suggested"
      },
      {
        id: "p3",
        title: "Responsive Management Console",
        description: "Create an interactive React console showing active data pipelines with rich charts.",
        difficulty: "Beginner",
        industryRelevance: "Consumer Apps",
        skillsAcquired: ['NextJS Framework setup', 'HTML/CSS', 'TypeScript'],
        estimatedHours: 20,
        status: "Suggested"
      }
    ];
    opportunities = [
      {
        id: "o1",
        type: "Internship",
        title: "Software Engineering Intern",
        organization: "Stellar Cloud Systems",
        deadline: "July 24, 2026",
        eligibility: `Tech students, Sem ${profile.currentSemester || '4'}+`,
        relevanceMatch: 95,
        skillsRequired: ['System Architecture Layouts', 'Node.js']
      },
      {
        id: "o2",
        type: "Hackathon",
        title: "Global Cloud Innovation Hack",
        organization: "NextGen Software Foundation",
        deadline: "August 14, 2026",
        eligibility: "Open to team enrollment",
        relevanceMatch: 87,
        skillsRequired: ['AWS cloud deployment', 'NextJS Framework setup']
      }
    ];
  }

  let strengths = [...skillsList];

  // Create highly customized month plans
  const roadmap = Array.from({ length: 6 }).map((_, i) => {
    const month = i + 1;
    let focus = "";
    let title = "";
    let milestones: string[] = [];
    let tasks: string[] = [];

    if (month === 1) {
      title = "Foundational Specialization";
      focus = `Strengthening your baseline tools for ${target}.`;
      milestones = ["Complete initial conceptual reviews", "Formulate basic simulation scripts"];
      tasks = ["Setup personalized developer tools or compilers", `Familiarize with standard ${missing[0] || 'core metrics'} syntax`, "Execute 3 small isolated study test runs"];
    } else if (month === 2) {
      title = "Target Specialization";
      focus = `Acquiring critical tools for ${target}.`;
      milestones = [`Learn essential techniques for ${missing[1] || 'advanced areas'}`, "Document structural parameters"];
      tasks = [`Complete extensive deep dive into ${missing[1] || 'advanced area'}`, "Design simple functional diagrams", "Simulate core module inputs and verify behavior"];
    } else if (month === 3) {
      title = "Practical Construction Work";
      focus = "Applying framework principles on modular student work.";
      milestones = ["Design primary schematic logic", "Integrate secondary data feeds"];
      tasks = ["Create a dedicated documentation sheet", "Write fundamental execution blocks", "Connect and mock external interface boundaries"];
    } else if (month === 4) {
      title = "Integrations and Testing";
      focus = "Creating high-fidelity presentations and auditing bugs.";
      milestones = ["Secure fully assembled output drafts", "Test core stress/compliance boundaries"];
      tasks = ["Refine parameters over 5 trial iterations", "Identify logical bottlenecks and fix", "Write full execution readmes on GitHub"];
    } else if (month === 5) {
      title = "Professional Placement Prep";
      focus = "Fine-tuning resume highlights and marketing strategies.";
      milestones = ["Assemble visual project portfolio sections", "Complete 5 simulated career mock interviews"];
      tasks = ["Polish LinkedIn profile highlights and wording", "Draft cover letter matching prime recruiter goals", "Attend virtual educational workshop / local alumni meetups"];
    } else {
      title = "Opportunity Applications Pipeline";
      focus = "Applying for selective high relevance internships.";
      milestones = ["Send 5 tailored applications to target targets", "Secure initial screening responses"];
      tasks = [`Apply to Junior ${target} position openings`, "Submit summarized materials and project files", "Complete basic placement assessment files"];
    }

    return {
      month,
      title,
      focus,
      milestones,
      weeklyPlans: Array.from({ length: 4 }).map((_, w) => ({
        week: w + 1,
        tasks: [
          {
            id: `task-m${month}-w${w}-1`,
            text: tasks[0] || "Examine next module documentation.",
            skillToAcquire: missing[month % missing.length] || "Analytical Mindset",
            completed: false
          },
          {
            id: `task-m${month}-w${w}-2`,
            text: tasks[1] || "Write custom implementation draft.",
            skillToAcquire: missedSkillLookup(month, w, missing),
            completed: false
          }
        ]
      }))
    };
  });

  const careerTwin = {
    currentStatus: `Solid baseline established under ${profile.degree || 'Degree'}. Actively strengthening portfolio with selected target competencies.`,
    projectedGrowth: [
      { label: `Sem ${profile.currentSemester}`, score: 45 },
      { label: "Month 1", score: 53 },
      { label: "Month 2", score: 62 },
      { label: "Month 3", score: 71 },
      { label: "Month 4", score: 80 },
      { label: "Month 5", score: 88 },
      { label: "Month 6", score: 95 }
    ],
    successProbability: 74,
    alternativePaths: [
      { role: fits[1]?.role || 'Professional Consultant', probability: 82, gapToBridge: `Broaden theoretical scope and focus on ${missing[2] || 'secondary analytical skills'}.` },
      { role: 'Research Associate', probability: 68, gapToBridge: 'Formulate research drafts, outline academic publications, and connect with lead lab professors.' }
    ],
    forecastSummary: `By implementing high portfolio projects resolving critical ${missing.slice(0, 2).join(' & ')} gaps, your success indicator climbs to 95%.`
  };

  const scores = {
    careerReadiness: 42,
    portfolioStrength: 35,
    skillCoverage: 48,
    employability: 40
  };

  return {
    profile,
    careerFits: fits,
    skillGap: { strengths, missingSkills: missing, improvementAreas: generateImprovementAreas(missing) },
    roadmap,
    recommendedProjects,
    opportunities,
    careerTwin,
    scores
  };
};

const missedSkillLookup = (m: number, w: number, list: string[]): string => {
  if (list.length === 0) return "Analytical Mindset";
  return list[(m + w) % list.length];
};

const generateImprovementAreas = (missing: string[]) => {
  return missing.map((sk, index) => ({
    skill: sk,
    description: `Requires focused conceptual projects and training modules to reach industry-grade standards of application execution.`,
    severity: index === 0 ? "High" as const : index === 1 ? "Medium" as const : "Low" as const
  }));
};

app.post('/api/analyze-profile', async (req, res) => {
  const profile = req.body.profile;
  if (!profile) {
    return res.status(400).json({ error: 'Profile data is missing' });
  }

  // If no Groq client initialized, yield fallback
  if (!groq) {
    console.log('Groq API client not initialized. Falling back to local high-fidelity generator.');
    return res.json(getFallbackAnalysis(profile));
  }

  try {
    const prompt = `
Analyze the following student profile for SkillBridge AI (The Career Navigation and Growth Operating System):
Name: ${profile.name}
Degree: ${profile.degree}
Branch: ${profile.branch}
College: ${profile.college}
Current Semester: ${profile.currentSemester}
Current Skills: ${profile.skills?.join(', ')}
Certifications: ${profile.certifications?.join(', ')}
Interests: ${profile.interests?.join(', ')}
Target Career Goal: ${profile.careerTarget}

Generate a complete, high-fidelity, customized Career Analysis JSON result. You MUST respond strictly in the following JSON format conforming to the schema requested below.

Provide:
1. Career Fit Analysis: Rank compatible roles (at least 3), with match percentage (INTEGER, 1-100), suitability reasons based on interests.
2. Skill Gap Analysis: List specific strengths, missing skills (at least 4-5 core technologies required for target career), and improvement areas (with skill name, description, and severity: 'High', 'Medium', 'Low').
3. Interactive 6-Month Roadmap: Generate exactly 6 months of detailed customized progress. Each month must have a title, focus keyword, 2 major milestone strings, and 4 weeks. Each week must have 2 actual tasks (with ID, text, skillToAcquire, and completed: false).
4. Practical Project Recommendations: At least 3 practical projects matching their level and target career, styled with difficulty ('Beginner', 'Intermediate', 'Advanced'), industry relevance, skills acquired, and estimate hours.
5. Opportunity Discovery: At least 3 mock and realistic internships/competitions aligned with their profile, complete with organization name, deadline, eligibility rules, percentage match, and skills required.
6. Career Twin Sim: Projected growth trajectory scores for 7 milestones (current semester + 6 months), success probability (INTEGER), at least 2 alternate paths with probabilities and gapToBridge details, and a clear forecast summary text.
7. Numerical Scores out of 100 representing: careerReadiness, portfolioStrength, skillCoverage, and employability. Make the initial scores realistic (e.g. between 30 and 60 depending on how many skills they listed, so they have room to grow).

Ensure the response strictly complies with JSON syntax. Do NOT prepend or postpend HTML markers or markdown blockquotes other than pure JSON.
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const resultText = response.choices[0]?.message?.content || '';
    const parsedData = JSON.parse(resultText.trim());
    
    // Supplement some default statuses to allow UI mutation
    const modifiedProjects = parsedData.recommendedProjects.map((p: any) => ({
      ...p,
      status: 'Suggested'
    }));

    return res.json({
      profile,
      ...parsedData,
      recommendedProjects: modifiedProjects
    });
  } catch (err) {
    console.error('Groq content generation failed, falling back to offline analytics:', err);
    return res.json(getFallbackAnalysis(profile));
  }
});

app.post('/api/chat', async (req, res) => {
  const { profile, messages, latestMessage } = req.body;
  
  if (!latestMessage) {
    return res.status(400).json({ error: 'Latest message is required' });
  }

  const targetRole = profile?.careerTarget || 'Target Role';

  if (!groq) {
    // Generate a simple, tailored response offline
    let responseText = `As your Career GPS Strategist, I'm analyzing your progress toward becoming a ${targetRole}. `;
    
    const input = latestMessage.toLowerCase();
    if (input.includes('learn') || input.includes('skill')) {
      responseText += `To progress quickly, you should focus heavily on acquiring specialized competencies such as Git, backend databases, or advanced modeling practices. Check out your customized "Skills" tab for the exact skill gap analysis!`;
    } else if (input.includes('project')) {
      responseText += `Building projects is the single best way to maximize your Portfolio Strength Score. I have generated customized project suggestions in your "Projects" tab. Start with the Beginner project to jump from 38% to 45% readiness instantly!`;
    } else if (input.includes('ready') || input.includes('internship')) {
      responseText += `Your current Career Readiness Score is ${profile ? '45%' : 'under development'}. You are perfectly positioned to apply for beginner-level hackathons and foundational internships, listed on your "Opportunities" dashboard, to start gaining real-world exposure!`;
    } else {
      responseText += `Currently, your digital Career Twin shows a success trajectory of 72% for getting elite jobs in ${targetRole}. You can boost this probability continuously by checking off weekly learning milestones in the "Roadmap" dashboard! Let me know which exact area you want to zoom into.`;
    }

    return res.json({ text: responseText });
  }

  try {
    const chatHistory = (messages || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are the Career GPS Strategist assistant for SkillBridge AI (tagline: "Navigate Your Future"). 
You are speaking to ${profile?.name || 'a student'}, who is studying ${profile?.branch || 'their major'} for a degree in ${profile?.degree || 'their field of interest'} (Current Semester ${profile?.currentSemester || 'Ongoing'}).
Their profile currently consists of skills: ${profile?.skills?.join(', ') || 'None provided yet'}, and interests: ${profile?.interests?.join(', ') || 'None provided yet'}.
Their target career is: ${profile?.careerTarget || 'Technology/Leadership'}.

Your job is to provide highly constructive, personalized, and encouraging guidance based on their profile. Always refer to concepts like the "Digital Career Twin" (predicting growth outcomes), "Portfolio Strength Score", "Employability Score", and tracking their "Career Readiness" metrics.
Respond in a friendly, conversational, yet authoritative educational demeanor. Keep text structure organized with brief bullet points where necessary.`
        },
        ...chatHistory,
        { role: 'user', content: latestMessage }
      ]
    });

    return res.json({ text: response.choices[0]?.message?.content || '' });
  } catch (err) {
    console.error('Chat AI generation failed:', err);
    return res.status(500).json({ error: 'AI Assistant could not compile a response. Feel free to try again.' });
  }
});

// Serve frontend assets in production, otherwise Vite handles development mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running in Development mode - Powered by Vite middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Running in Production mode - Serving static assets.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on public ingress bridge: http://0.0.0.0:${PORT}`);
  });
}

// Only start the server when run directly (not imported as module on Vercel)
const isVercel = process.env.VERCEL === '1';
if (!isVercel) {
  startServer();
}

export default app;
