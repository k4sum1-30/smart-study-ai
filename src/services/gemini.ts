import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, UploadedFile, Slide } from "../types";

// ... (existing code)

export const generateCoursePPT = async (
  lectures: { title: string; content: string }[]
): Promise<Slide[]> => {
  try {
    const lectureText = lectures.map(l => `Lecture: ${l.title}\nSummary: ${l.content}`).join("\n\n");

    const prompt = `
      You are an expert professor creating a **comprehensive, self-paced learning course** based on the provided lecture summaries.
      
      Goal: The student must be able to **learn the key concepts** by reading this presentation.
      
      Based on the lecture summaries, generate a detailed slide deck (8-12 slides).
      
      Course Content Summaries:
      ${lectureText}
      
      Requirements:
      1. **Structure**: Cover the most important concepts.
      2. **Content Depth**: 
         - Focus on major definitions and algorithms.
         - **Visuals & Code**: 
           - For **Binary Trees** and **Hash Tables**, include a **Code Snippet** (Python/Pseudocode) AND an **ASCII Art Diagram**.
           - For **key algorithms**, include **code examples** when relevant.
      3. **Slide Content ('bulletPoints')**: 
         - Concise, high-level summary points.
      4. **Detailed Explanation ('explanation')**: 
         - **Formatting**: 
           - Use **numbered lists** (1., 2., 3.) to break down ideas.
           - Add a blank line between each numbered item.
           - **Bold** key terms.
         - **Content**:
           - Provide clear explanations.
           - Include **concrete examples** for major concepts.
           - Include **code snippets** with explanations for algorithms.
         - **Code Blocks (CRITICAL - Follow This Format EXACTLY)**:
           - For Python/code: Use triple backticks with language identifier on the SAME LINE:
             \`\`\`python
             def example():
                 return "code here"
             \`\`\`
           - For ASCII Art/diagrams: Use triple backticks with "text" identifier:
             \`\`\`text
                  A
                 / \\
                B   C
             \`\`\`
           - IMPORTANT: The opening backticks and language must be on ONE LINE with NO SPACE between them.
      5. **Flow**: Ensure a smooth narrative.
    `;

    const pptSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          bulletPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          explanation: { type: Type.STRING }
        },
        required: ["title", "bulletPoints", "explanation"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: [{ text: prompt }]
      },
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: pptSchema
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const cleanJson = jsonText.replace(/```json | ```/g, '').trim();
    return JSON.parse(cleanJson) as Slide[];

  } catch (error: any) {
    console.error("GenAI Error (PPT):", error);
    throw new Error("Failed to generate course presentation.");
  }
};


// Initialize the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const generateQuiz = async (
  mode: string,
  textInput: string,
  files: UploadedFile[],
  courseTitle?: string
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

    let prompt = "";

    // Determine if this is a Robotics course
    const isRoboticsCourse = courseTitle?.toLowerCase().includes('robotics');

    if (mode === 'REVIEW') {
      prompt = `
        Analyze the provided learning material and generate a **Review Quiz**.
        Goal: Check if the student has carefully read the slides/material.
        Requirements:
        1. Generate 5-8 multiple choice questions (MCQ).
        2. Focus strictly on **recall of specific details**, definitions, and key facts.
      `;
    } else if (mode === 'PREVIEW') {
      prompt = `
        Analyze the provided learning material and generate a **Preview Quiz**.
        Goal: Prime the student's interest and check prerequisite knowledge.
        Requirements:
        1. Generate 3-5 multiple choice questions (MCQ).
        2. Focus on **introductory concepts, intuition, or prerequisites**.
      `;
    } else if (mode === 'MIDTERM' || mode === 'FINAL') {
      const examType = mode === 'MIDTERM' ? 'Midterm Exam (Lectures 1-5)' : 'Final Exam (All Lectures)';

      if (isRoboticsCourse) {
        prompt = `
          Analyze the provided learning material and generate a **${examType}** for a Robotics course.
          
          Structure Requirements (Strictly Follow This):
          1. **5 True/False Questions** (Type: 'TF').
             - Provide 'options': ["True", "False"].
             - Set 'correctAnswerIndex': 0 for True, 1 for False.
          2. **5 Multiple Choice Questions** (Type: 'MCQ').
             - Provide 4 options.
          3. **3 Mathematical / Analytical Problems** (Type: 'OPEN').
             - These should be robotics-focused mathematical problems such as:
               * Trajectory planning and polynomial interpolation
               * Coordinate frame transformations and homogeneous transformation matrices
               * Rotation matrices and position/orientation calculations
               * D-H parameters and forward kinematics
               * Jacobian matrices and singular configurations
               * Inverse kinematics problems
               * Camera projection models and image plane calculations
             - Format the 'question' field to clearly state the problem with all given information.
             - Use proper mathematical notation with LaTeX syntax (e.g., $ \\theta$, matrices use \\begin{bmatrix}...\\end{bmatrix}).
             - Do NOT include any coding requirements or programming language mentions.
             - Do NOT provide 'codeSnippet' field.
             - Do NOT provide 'options' or 'correctAnswerIndex'.
             - **IMPORTANT: Provide 'diagramPrompt' field** - A detailed description for AI image generation that includes:
               * Robot configuration (e.g., "3-DOF RRR manipulator", "2R planar robot")
               * Link lengths and joint types
               * Coordinate frame positions and orientations (use right-hand rule)
               * Joint angles or positions if specified in the question
               * Any relevant visual elements (arrows for axes, labels for frames, dimensions)
               * Style note: "Technical diagram, clean lines, labeled axes, engineering schematic style"
             - Provide a detailed 'explanation' containing:
               * Step-by-step mathematical solution
               * All intermediate calculations
               * Final answer clearly stated
               * Use LaTeX for all mathematical expressions
             
          Total Questions: 13.
        `;
      } else {
        prompt = `
          Analyze the provided learning material and generate a **${examType}**.
          
          Structure Requirements (Strictly Follow This):
          1. **5 True/False Questions** (Type: 'TF').
             - Provide 'options': ["True", "False"].
             - Set 'correctAnswerIndex': 0 for True, 1 for False.
          2. **5 Multiple Choice Questions** (Type: 'MCQ').
             - Provide 4 options.
          3. **3 Coding / Handwritten Code Questions** (Type: 'OPEN').
             - These should be coding problems or algorithm design questions.
             - Format the 'question' field to start with the point value (e.g., "(20 points)") followed by the problem statement.
             - Provide a code template or starter code in the 'codeSnippet' field.
             - Explicitly state in the question that "Students may answer using any programming language or pseudocode."
             - Do NOT provide 'options' or 'correctAnswerIndex'.
             - Provide a detailed 'explanation' containing the solution code (in Python or pseudocode) and logic.
             
          Total Questions: 13.
        `;
      }
    } else {
      prompt = `
        Analyze the provided learning material and generate a **Comprehensive Test**.
        Goal: Assess deep understanding and application capabilities.
        Requirements:
        1. Generate 5-8 multiple choice questions (MCQ).
        2. Focus on **application, synthesis, and critical thinking**.
      `;
    }

    prompt += `
      IMPORTANT: For all Multiple Choice (MCQ) and True/False (TF) questions, you MUST provide 'optionExplanations'.
      'optionExplanations' should be an array of strings, where each string explains why the corresponding option is correct or incorrect.
      The order must match the 'options' array.
    `;

    parts.push({ text: prompt });

    // Define the JSON schema for the quiz
    const quizSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["MCQ", "TF", "OPEN"], description: "Type of question" },
          question: { type: Type.STRING, description: "The question text" },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of options for MCQ/TF. Null/Empty for OPEN.",
            nullable: true
          },
          correctAnswerIndex: {
            type: Type.INTEGER,
            description: "Index of correct option for MCQ/TF. Null for OPEN.",
            nullable: true
          },
          explanation: { type: Type.STRING, description: "General Explanation or Model Answer" },
          optionExplanations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific explanation for each option (index-matched). Required for MCQ/TF.",
            nullable: true
          },
          codeSnippet: {
            type: Type.STRING,
            description: "Code template or starter code for OPEN questions (not used for Robotics)",
            nullable: true
          },
          diagramPrompt: {
            type: Type.STRING,
            description: "Detailed description for AI to generate a robot arm diagram. Only for Robotics OPEN questions. Should describe: robot configuration (e.g., '3-DOF RRR manipulator'), joint positions, coordinate frames, link lengths, and any relevant visual details.",
            nullable: true
          }
        },
        required: ["type", "question", "explanation"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are a strict quiz generator. Return ONLY valid JSON matching the schema."
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const cleanJson = jsonText.replace(/```json | ```/g, '').trim();
    const quizData = JSON.parse(cleanJson) as QuizQuestion[];
    return quizData;

  } catch (error: any) {
    console.error("GenAI Error (Quiz):", error);
    throw new Error(error.message || "Failed to generate quiz.");
  }
};

export const chatWithAI = async (
  question: string,
  explanation: string,
  userQuery: string,
  history: { role: 'user' | 'model'; content: string }[]
): Promise<string> => {
  try {
    // Context setup
    const systemPrompt = `
      You are an AI tutor helping a student understand a quiz question.
      
      The Question was: "${question}"
      The Correct Answer / Explanation provided was: "${explanation}"
      
      The student has a follow - up question.Answer it clearly and concisely. 
      If they are confused, try to explain it in simpler terms or provide an example.
      Do not give away answers to * other * questions if you know them(you shouldn't, but just in case).
      Focus on teaching.
    `;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: "Understood. I am ready to help the student with their question about this specific problem." }]
      }
    ];

    history.forEach(msg => {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.content }]
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Lower budget for chat
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";

  } catch (error: any) {
    console.error("GenAI Error (Chat):", error);
    return "Sorry, I'm having trouble connecting to the AI tutor right now.";
  }
};

export const chatAboutSlide = async (
  slideTitle: string,
  slideContent: string,
  slideExplanation: string,
  userQuery: string,
  history: { role: 'user' | 'model'; content: string }[]
): Promise<string> => {
  try {
    const systemPrompt = `
      You are an expert AI professor and tutor.
      The student is currently viewing a slide titled: "${slideTitle}".
      
      Slide Bullet Points:
      ${slideContent}
      
      Detailed Explanation Provided to Student:
      ${slideExplanation}
      
      The student has a question. Answer it clearly and concisely.
      - If they ask for clarification, explain in simpler terms.
      - If they ask for code, provide Python or Pseudocode examples if relevant.
      - Connect your answer back to the slide's topic.
    `;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: "Understood. I am ready to help the student with their question about this slide." }]
      }
    ];

    history.forEach(msg => {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.content }]
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";

  } catch (error: any) {
    console.error("GenAI Error (Slide Chat):", error);
    return "Sorry, I'm having trouble connecting to the AI tutor right now.";
  }
};

export const generatePerformanceReport = async (
  questions: QuizQuestion[],
  userAnswers: Record<number, { selectedOption: number | null }>
): Promise<string> => {
  try {
    const incorrectItems: string[] = [];

    questions.forEach((q, idx) => {
      if (q.type === 'OPEN') return; // Skip open-ended for auto-grading analysis

      const ans = userAnswers[idx];
      const selected = ans?.selectedOption;

      if (selected !== q.correctAnswerIndex) {
        incorrectItems.push(`- Question: "${q.question}"\n  Correct Answer: "${q.options?.[q.correctAnswerIndex || 0]}"`);
      }
    });

    if (incorrectItems.length === 0) {
      return "Great job! You answered all objective questions correctly. Keep up the excellent work!";
    }

    const prompt = `
      The student just finished a quiz and got the following questions WRONG:

        ${incorrectItems.join('\n\n')}
      
      Based on these mistakes, identify the specific topics or concepts the student is struggling with.
      Provide a constructive, encouraging report(3 - 5 sentences) on what they should review.
      Address the student directly as "you".
      `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: [{ text: prompt }]
      },
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });

    return response.text || "Could not generate report.";

  } catch (error: any) {
    console.error("GenAI Error (Report):", error);
    return "Unable to generate performance report at this time.";
  }
};

export const explainCode = async (code: string, imageBase64?: string): Promise<string> => {
  try {
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/png", // Assuming PNG for simplicity, or detect from input
          data: imageBase64
        }
      });
      parts.push({ text: "Analyze the code in this image." });
    }

    if (code) {
      parts.push({
        text: `
          Analyze the following code snippet:
          \`\`\`
          ${code}
          \`\`\`
        `
      });
    }

    parts.push({
      text: `
        You are an expert code interpreter and tutor.
        Provide a detailed explanation.
        
        Requirements:
        1. Explain what the code does overall.
        2. Break down key logic or syntax block-by-block.
        3. Point out any potential issues, optimizations, or best practices.
        4. Use Markdown formatting for clarity.
      `
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
      }
    });

    return response.text || "Could not generate explanation.";

  } catch (error: any) {
    console.error("GenAI Error (Explain Code):", error);
    return "Unable to explain code at this time.";
  }
};
