import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, StudyMode, UploadedFile } from "../types";

// Initialize the client.
// Note: In a real app, ensure the key is managed securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for speed, but with Thinking enabled for depth.
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates unstructured markdown content for Review or Preview modes.
 */
export const generateStudyGuide = async (
  mode: StudyMode.REVIEW | StudyMode.PREVIEW,
  textInput: string,
  files: UploadedFile[]
): Promise<string> => {
  try {
    const parts: any[] = [];

    // Add uploaded files (images or pdfs)
    files.forEach(f => {
      parts.push({
        inlineData: {
          mimeType: f.mimeType,
          data: f.base64
        }
      });
    });

    // Add text input
    if (textInput) {
      parts.push({ text: textInput });
    }

    // Add system prompt based on mode
    let prompt = "";
    if (mode === StudyMode.REVIEW) {
      prompt = `
        You are an expert academic tutor. The user has provided this week's lecture slides or notes.
        
        Task: Create a comprehensive **Weekly Review Guide**.
        
        Structure your response as follows:
        1. **Executive Summary**: A 2-sentence overview of this week's core theme.
        2. **Key Concepts & Definitions**: detailed explanations of the most important terms introduced.
        3. **Critical Formulas/Theories**: If applicable, list them with usage context.
        4. **Exam Highlights**: Point out specific topics that are highly likely to be tested based on the emphasis in the materials.
        5. **Common Pitfalls**: What do students usually misunderstand about this week's topic?
        
        Format with clean Markdown (headers, bullet points, bold text).
      `;
    } else {
      prompt = `
        You are an expert academic tutor. The user has provided materials for the *upcoming* week's lectures.
        
        Task: Create a **Preview Strategy Guide** to help the student prepare efficiently.
        
        Structure your response as follows:
        1. **The Big Picture**: How does this connect to typical previous topics?
        2. **Core Objectives**: What are the 3 main things the student should aim to understand by the end of the week?
        3. **Prerequisite Check**: What concepts should they briefly review *before* walking into class?
        4. **Curiosity Questions**: List 3 thought-provoking questions to keep in mind during the lecture.
        
        Keep the tone encouraging and preparatory.
      `;
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        // Enable thinking for deeper analysis of the study materials
        thinkingConfig: { thinkingBudget: 2048 },
        systemInstruction: "You are a helpful, intelligent, and structured academic AI tutor. Your goal is to maximize the student's learning efficiency."
      }
    });

    return response.text || "No content generated.";

  } catch (error: any) {
    console.error("GenAI Error (Study Guide):", error);
    throw new Error(error.message || "Failed to generate study guide.");
  }
};

/**
 * Generates a structured Quiz using JSON schema.
 */
export const generateQuiz = async (
  textInput: string,
  files: UploadedFile[]
): Promise<QuizQuestion[]> => {
  try {
    const parts: any[] = [];

    files.forEach(f => {
      parts.push({
        inlineData: {
          mimeType: f.mimeType,
          data: f.base64
        }
      });
    });

    if (textInput) {
      parts.push({ text: textInput });
    }

    const prompt = `
      Analyze the provided weekly learning material and generate a challenging quiz.
      
      Requirements:
      1. Generate 5-8 multiple choice questions.
      2. Focus on *application* of knowledge, not just definition recall.
      3. The 'explanation' field must teach the student *why* the answer is correct and why the others are wrong.
      4. Ensure the difficulty varies (some easy, some hard).
    `;
    parts.push({ text: prompt });

    // Define the JSON schema for the quiz
    const quizSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text" },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 4 possible answers"
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct option" },
          explanation: { type: Type.STRING, description: "A comprehensive explanation of the answer" }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        // Thinking helps generate better "distractor" (wrong) answers for the quiz
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are a strict quiz generator. Return ONLY valid JSON matching the schema."
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    // Sometimes models might wrap JSON in markdown blocks despite the mimeType setting
    const cleanJson = jsonText.replace(/```json|```/g, '').trim();

    const quizData = JSON.parse(cleanJson) as QuizQuestion[];
    return quizData;

  } catch (error: any) {
    console.error("GenAI Error (Quiz):", error);
    throw new Error(error.message || "Failed to generate quiz.");
  }
};