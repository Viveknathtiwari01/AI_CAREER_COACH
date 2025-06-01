import { BrainCircuit, Briefcase, LineChart, ScrollText, FileCheck, Target } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights powered by advanced AI technology.",
    route: "/dashboard"
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:
      "Practice with role-specific questions and get instant feedback to improve your performance.",
    route: "/interview"
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description:
      "Stay ahead with real-time industry trends, salary data, and market analysis.",
    route: "/dashboard"
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes with AI assistance.",
    route: "/resume"
  },
  {
    icon: <FileCheck className="w-10 h-10 mb-4 text-primary" />,
    title: "ATS Score Checker",
    description: "Analyze your resume's ATS compatibility and get improvement suggestions.",
    route: "/ats-score"
  },
  {
    icon: <Target className="w-10 h-10 mb-4 text-primary" />,
    title: "Job Suitability Analyzer",
    description: "Evaluate your fit for specific roles with AI-powered assessment.",
    route: "/job-suitability"
  },
];
