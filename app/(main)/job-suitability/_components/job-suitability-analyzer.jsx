"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { analyzeJobSuitability, generateQuestions } from "@/actions/job-suitability";

export default function JobSuitabilityAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("upload"); // upload, questions, result
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

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
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and provide a job description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      // Generate questions first
      const generatedQuestions = await generateQuestions(formData);
      setQuestions(generatedQuestions);
      setStep("questions");
    } catch (err) {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      formData.append("answers", JSON.stringify(answers));

      const analysisResult = await analyzeJobSuitability(formData);
      setResult(analysisResult);
      setStep("result");
    } catch (err) {
      setError("Failed to analyze answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <>
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

          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px]"
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file || !jobDescription.trim() || loading}
            className="w-full"
          >
            {loading ? "Analyzing..." : "Generate Questions"}
          </Button>
        </>
      )}

      {step === "questions" && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Answer these questions:</h3>
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <p className="mb-4">{question.text}</p>
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            onClick={handleSubmitAnswers}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Analyzing..." : "Submit Answers"}
          </Button>
        </div>
      )}

      {step === "result" && result && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{result.score}%</h3>
              <Progress value={result.score} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Job Suitability Score
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Analysis</h4>
              <div className="space-y-2">
                {result.analysis.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    {item.type === "improvement" ? (
                      <XCircle className="h-4 w-4 text-red-500 mt-1" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    )}
                    <span>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => {
                setStep("upload");
                setFile(null);
                setJobDescription("");
                setQuestions([]);
                setAnswers({});
                setResult(null);
              }}
              variant="outline"
              className="w-full"
            >
              Start New Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 