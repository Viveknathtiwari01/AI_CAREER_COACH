import { Briefcase, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JobSuitabilityAnalyzer from "./_components/job-suitability-analyzer";

export default function JobSuitabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Job Suitability Analyzer
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Match Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <JobSuitabilityAnalyzer />
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Upload your resume and paste a job description to get an instant suitability score. 
          Our AI will analyze your qualifications against the job requirements, generate 
          relevant questions, and provide detailed feedback on your fit for the position.
        </AlertDescription>
      </Alert>
    </div>
  );
} 