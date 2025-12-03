// Vercel Serverless Function - Gemini API Proxy
// File: api/gemini.js

import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify token (simple validation)
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { action, payload } = req.body;

        // Initialize Gemini AI with API key from environment
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const MODEL_NAME = 'gemini-2.0-flash-exp';

        switch (action) {
            case 'generateQuiz':
                return await handleGenerateQuiz(ai, MODEL_NAME, payload, res);

            case 'generatePPT':
                return await handleGeneratePPT(ai, MODEL_NAME, payload, res);

            case 'chat':
                return await handleChat(ai, MODEL_NAME, payload, res);

            case 'explainCode':
                return await handleExplainCode(ai, MODEL_NAME, payload, res);

            case 'generatePerformanceReport':
                return await handleGeneratePerformanceReport(ai, MODEL_NAME, payload, res);

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({
            error: 'Failed to process request',
            message: error.message
        });
    }
}

// Handler functions
async function handleGenerateQuiz(ai, model, payload, res) {
    const { mode, textInput, files, courseTitle } = payload;

    // Build parts array
    const parts = [];

    if (files && files.length > 0) {
        files.forEach(f => {
            parts.push({
                inlineData: {
                    mimeType: f.mimeType,
                    data: f.base64
                }
            });
        });
    }

    if (textInput) {
        parts.push({ text: textInput });
    }

    // Build prompt based on mode and course
    const isRoboticsCourse = courseTitle?.toLowerCase().includes('robotics');
    let prompt = buildQuizPrompt(mode, isRoboticsCourse);
    parts.push({ text: prompt });

    // Generate content
    const response = await ai.models.generateContent({
        model,
        contents: {
            role: 'user',
            parts: parts
        },
        config: {
            responseMimeType: "application/json",
            temperature: 0.7
        }
    });

    const jsonText = response.text;
    const quizData = JSON.parse(jsonText.replace(/```json|```/g, '').trim());

    return res.status(200).json({ success: true, data: quizData });
}

async function handleGeneratePPT(ai, model, payload, res) {
    const { lectures } = payload;

    const lectureText = lectures.map(l => `Lecture: ${l.title}\nSummary: ${l.content}`).join('\n\n');

    const prompt = `Generate a comprehensive course presentation based on these lectures:\n\n${lectureText}\n\nCreate 8-12 slides with titles, bullet points, and detailed explanations.`;

    const response = await ai.models.generateContent({
        model,
        contents: { role: 'user', parts: [{ text: prompt }] },
        config: {
            responseMimeType: "application/json",
            temperature: 0.7
        }
    });

    const slides = JSON.parse(response.text.replace(/```json|```/g, '').trim());

    return res.status(200).json({ success: true, data: slides });
}

async function handleChat(ai, model, payload, res) {
    const { context, userMessage, history } = payload;

    const contents = [
        { role: 'user', parts: [{ text: context }] },
        { role: 'model', parts: [{ text: "Understood. I'm ready to help." }] }
    ];

    if (history) {
        history.forEach(msg => {
            contents.push({
                role: msg.role,
                parts: [{ text: msg.content }]
            });
        });
    }

    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
        model,
        contents: contents
    });

    return res.status(200).json({ success: true, data: response.text });
}

async function handleExplainCode(ai, model, payload, res) {
    const { code, imageBase64 } = payload;

    const parts = [];

    if (imageBase64) {
        parts.push({
            inlineData: {
                mimeType: "image/png",
                data: imageBase64
            }
        });
    }

    if (code) {
        parts.push({ text: `Explain this code:\n\`\`\`\n${code}\n\`\`\`` });
    }

    const response = await ai.models.generateContent({
        model,
        contents: { role: 'user', parts }
    });

    return res.status(200).json({ success: true, data: response.text });
}

async function handleGeneratePerformanceReport(ai, model, payload, res) {
    const { questions, userAnswers } = payload;

    const prompt = `
    Analyze the student's performance on this quiz:
    
    Questions: ${JSON.stringify(questions)}
    User Answers: ${JSON.stringify(userAnswers)}
    
    Provide a detailed performance report including:
    1. Overall Score
    2. Strengths and Weaknesses
    3. Specific topics to review
    4. Recommendations for improvement
    `;

    const response = await ai.models.generateContent({
        model,
        contents: { role: 'user', parts: [{ text: prompt }] }
    });

    return res.status(200).json({ success: true, data: response.text });
}

function buildQuizPrompt(mode, isRobotics) {
    // Simplified version - full implementation should match gemini.ts logic
    if (mode === 'MIDTERM' || mode === 'FINAL') {
        if (isRobotics) {
            return 'Generate a robotics exam with mathematical problems...';
        }
        return 'Generate a coding exam...';
    }
    return 'Generate quiz questions...';
}
