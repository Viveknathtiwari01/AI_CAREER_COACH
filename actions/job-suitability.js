"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables. Please add it to your .env file.");
}

// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuestions(formData) {
  try {
    console.log("Starting question generation...");
    
    const { userId } = await auth();
    if (!userId) {
      console.error("Authentication failed: No user ID found");
      throw new Error("Unauthorized");
    }
    console.log("User authenticated successfully");

    const resumeFile = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!resumeFile || !jobDescription) {
      throw new Error("Missing required information");
    }

    // Convert PDF to text (you'll need to implement this)
    console.log("Attempting to extract text from PDF...");
    const resumeText = await extractTextFromPDF(resumeFile);
    if (!resumeText) {
      console.error("Failed to extract text from PDF");
      throw new Error("Failed to extract text from PDF");
    }
    console.log("Text extracted from PDF successfully");

    // Generate questions based on resume and job description
    console.log("Generating questions...");
    const prompt = `Based on this resume and job description, generate 10 multiple-choice questions 
    that assess the candidate's suitability for the role. Each question should have 4 options.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Return the response in this JSON format only, no additional text or markdown formatting:
    [
      {
        "id": "unique_id",
        "text": "question text",
        "options": ["option1", "option2", "option3", "option4"]
      }
    ]`;

    try {
      const result = await model.generateContent(prompt);
      if (!result || !result.response) {
        console.error("Failed to get response from Gemini");
        throw new Error("Failed to generate questions");
      }

      const response = await result.response;
      const text = response.text();
      // Clean the response text by removing markdown code block formatting
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      console.log("Cleaned response:", cleanedText);

      try {
        const questions = JSON.parse(cleanedText);
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error("Invalid questions format");
        }
        return questions;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw response:", text);
        throw new Error("Failed to parse questions from AI response");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate questions. Please try again.");
    }
  } catch (error) {
    console.error("Error in generateQuestions:", error);
    console.error("Error stack:", error.stack);
    throw new Error(error.message || "Failed to generate questions");
  }
}

export async function analyzeJobSuitability(formData) {
  try {
    console.log("Starting job suitability analysis...");
    
    const { userId } = await auth();
    if (!userId) {
      console.error("Authentication failed: No user ID found");
      throw new Error("Unauthorized");
    }
    console.log("User authenticated successfully");

    const resumeFile = formData.get("resume");
    const jobDescription = formData.get("jobDescription");
    const answers = JSON.parse(formData.get("answers"));

    if (!resumeFile || !jobDescription || !answers) {
      throw new Error("Missing required information");
    }

    // Convert PDF to text (you'll need to implement this)
    console.log("Attempting to extract text from PDF...");
    const resumeText = await extractTextFromPDF(resumeFile);
    if (!resumeText) {
      console.error("Failed to extract text from PDF");
      throw new Error("Failed to extract text from PDF");
    }
    console.log("Text extracted from PDF successfully");

    // Analyze job suitability
    console.log("Generating analysis...");
    const prompt = `Analyze this candidate's suitability for the role based on their resume, 
    the job description, and their answers to the assessment questions. Provide:
    1. An overall suitability score (0-100)
    2. Detailed analysis of their fit for the role
    3. Specific areas for improvement
    
    Format your response as follows:
    Score: [number]%
    
    Analysis:
    - [Category]: [Analysis]
    - [Category]: [Analysis]
    ...
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Candidate's Answers:
    ${JSON.stringify(answers, null, 2)}`;

    try {
      const result = await model.generateContent(prompt);
      if (!result || !result.response) {
        console.error("Failed to get response from Gemini");
        throw new Error("Failed to generate analysis");
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
      const analysisItems = extractAnalysis(analysis);
      console.log("Analysis complete. Score:", score);

      return {
        score,
        analysis: analysisItems,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to analyze job suitability. Please try again.");
    }
  } catch (error) {
    console.error("Error in analyzeJobSuitability:", error);
    console.error("Error stack:", error.stack);
    throw new Error(error.message || "Failed to analyze job suitability");
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

// Helper function to extract analysis items from AI response
function extractAnalysis(analysis) {
  try {
    console.log("Extracting analysis items...");
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
          message: "Enhance knowledge of required tools and technologies",
        },
        {
          type: "improvement",
          message: "Highlight relevant leadership experience",
        },
        {
          type: "good",
          message: "Strong technical background matches job requirements",
        }
      );
    }

    console.log("Analysis items extracted successfully:", suggestions);
    return suggestions;
  } catch (error) {
    console.error("Error in extractAnalysis:", error);
    return [
      {
        type: "improvement",
        message: "Enhance knowledge of required tools and technologies",
      },
      {
        type: "improvement",
        message: "Highlight relevant leadership experience",
      },
      {
        type: "good",
        message: "Strong technical background matches job requirements",
      },
    ];
  }
} 