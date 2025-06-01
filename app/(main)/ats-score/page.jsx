import { FileText, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ATSAnalyzer from "./_components/ats-analyzer";

export default function ATSScorePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          ATS Score Checker
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ATSAnalyzer />
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Upload your resume in PDF format to get an instant ATS compatibility score. 
          Our AI will analyze your resume based on formatting, keywords, section completeness, 
          and other ATS-friendly criteria to help you optimize your chances of getting past 
          automated screening systems.
        </AlertDescription>
      </Alert>
    </div>
  );
} 