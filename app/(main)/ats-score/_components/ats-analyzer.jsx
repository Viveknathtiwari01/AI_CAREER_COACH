"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { analyzeResume } from "@/actions/ats-score";

export default function ATSAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const analysisResult = await analyzeResume(formData);
      setResult(analysisResult);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {file ? file.name : "Click to upload your resume (PDF)"}
          </span>
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="w-full"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{result.score}%</h3>
              <Progress value={result.score} className="w-full" />
              <p className="text-sm text-muted-foreground">
                ATS Compatibility Score
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Improvement Suggestions</h4>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    {suggestion.type === "improvement" ? (
                      <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    )}
                    <span>{suggestion.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 