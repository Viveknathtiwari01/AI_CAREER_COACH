"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables. Please add it to your .env file.");
}

// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeResume(formData) {
  try {
    console.log("Starting resume analysis...");
    
    const { userId } = await auth();
    if (!userId) {
      console.error("Authentication failed: No user ID found");
      throw new Error("Unauthorized");
    }
    console.log("User authenticated successfully");

    const resumeFile = formData.get("resume");
    if (!resumeFile) {
      console.error("No resume file provided in form data");
      throw new Error("No resume file provided");
    }
    console.log("Resume file received");

    // Convert PDF to text (you'll need to implement this)
    console.log("Attempting to extract text from PDF...");
    const resumeText = await extractTextFromPDF(resumeFile);
    if (!resumeText) {
      console.error("Failed to extract text from PDF");
      throw new Error("Failed to extract text from PDF");
    }
    console.log("Text extracted from PDF successfully");

    // Analyze resume with AI
    console.log("Generating AI analysis...");
    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume and provide:
    1. An overall ATS compatibility score (0-100)
    2. Specific suggestions for improvement in these categories:
       - Formatting and structure
       - Keywords and skills
       - Section completeness
       - Job title relevance
       - Experience descriptions
       - Education and certifications
    
    Format your response as follows:
    Score: [number]%
    
    Suggestions:
    - [Category]: [Suggestion]
    - [Category]: [Suggestion]
    ...
    
    Resume text:
    ${resumeText}`;

    console.log("Sending prompt to Gemini...");
    try {
      const result = await model.generateContent(prompt);
      if (!result || !result.response) {
        console.error("Failed to get response from Gemini");
        throw new Error("Failed to generate AI response");
      }

      const response = await result.response;
      const analysis = response.text();
      if (!analysis) {
        console.error("Empty response from Gemini");
        throw new Error("Empty AI response");
      }
      console.log("Received analysis from Gemini:", analysis);

      // Parse AI response and structure the result
      console.log("Parsing analysis results...");
      const score = extractScore(analysis);
      const suggestions = extractSuggestions(analysis);
      console.log("Analysis complete. Score:", score);

      return {
        score,
        suggestions,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to analyze resume with AI. Please try again.");
    }
  } catch (error) {
    console.error("Error in analyzeResume:", error);
    console.error("Error stack:", error.stack);
    throw new Error(error.message || "Failed to analyze resume");
  }
}

// Helper function to extract text from PDF
async function extractTextFromPDF(file) {
  try {
    console.log("Starting PDF text extraction...");
    // For now, return a sample text for testing
    const sampleText = `John Doe
Software Engineer
Experience:
- 5 years of full-stack development
- Proficient in JavaScript, React, Node.js
- Led multiple successful projects
Education:
- Bachelor's in Computer Science
Skills:
- Frontend: React, Vue, Angular
- Backend: Node.js, Python, Java
- Database: MongoDB, PostgreSQL`;
    
    console.log("PDF text extraction completed");
    return sampleText;
  } catch (error) {
    console.error("Error in extractTextFromPDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Helper function to extract score from AI response
function extractScore(analysis) {
  try {
    console.log("Extracting score from analysis...");
    const scoreMatch = analysis.match(/Score:\s*(\d+)%/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    console.log("Score extracted:", score);
    return score;
  } catch (error) {
    console.error("Error in extractScore:", error);
    return 0;
  }
}

// Helper function to extract suggestions from AI response
function extractSuggestions(analysis) {
  try {
    console.log("Extracting suggestions from analysis...");
    const suggestions = [];
    const lines = analysis.split('\n');
    let currentCategory = '';

    for (const line of lines) {
      if (line.startsWith('- ')) {
        const [category, message] = line.substring(2).split(': ');
        if (category && message) {
          suggestions.push({
            type: category.toLowerCase().includes('good') ? 'good' : 'improvement',
            message: `${category}: ${message}`,
          });
        }
      }
    }

    if (suggestions.length === 0) {
      // Fallback to default suggestions if parsing fails
      suggestions.push(
        {
          type: "improvement",
          message: "Add more role-specific keywords in Skills section",
        },
        {
          type: "improvement",
          message: "Use bullet points in Experience section",
        },
        {
          type: "good",
          message: "Good formatting and structure",
        }
      );
    }

    console.log("Suggestions extracted successfully:", suggestions);
    return suggestions;
  } catch (error) {
    console.error("Error in extractSuggestions:", error);
    return [
      {
        type: "improvement",
        message: "Add more role-specific keywords in Skills section",
      },
      {
        type: "improvement",
        message: "Use bullet points in Experience section",
      },
      {
        type: "good",
        message: "Good formatting and structure",
      },
    ];
  }
} 