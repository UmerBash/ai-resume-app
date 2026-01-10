const Groq = require("groq-sdk");
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeResume = async (resumeText) => {
    try {
        const prompt = `
        You are an expert ATS (Applicant Tracking System) and Resume Coach. 
        Analyze the following resume text and provide a structured JSON response.
        Do NOT return markdown formatting (no \`\`\`json blocks). Just return the raw JSON object.

        Resume Text:
        "${resumeText.substring(0, 20000)}" // Truncate to avoid token limits if necessary

        Output Schema:
        {
            "score": number (0-100),
            "summary": "Professional summary of the candidate (max 2 sentences)",
            "skills": ["List", "of", "extracted", "skills"],
            "improvements": ["Specific bullet point", "improvement suggestions"],
            "formatting_issues": ["List of potential formatting issues"]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            "messages": [{ "role": "user", "content": prompt }],
            "model": "llama-3.3-70b-versatile",
            "temperature": 0.5,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "response_format": { "type": "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        console.log("Groq Response received");

        return JSON.parse(content);

    } catch (error) {
        console.error("Groq Analysis Error:", error.message);

        // Return RICH MOCK DATA if API fails so user can still see UI
        return {
            score: 0,
            summary: "AI Analysis failed. Connectivity issue with Groq API.",
            skills: [],
            improvements: [error.message],
            formatting_issues: []
        };
    }
};


const analyzeJobMatch = async (resumeText, jobDescription) => {
    try {
        const prompt = `
        You are an expert Recruitement Manager.
        Compare the following Resume against the Job Description (JD) and provide a structured JSON response.
        Do NOT return markdown formatting. Just return the raw JSON object.

        Resume Text: "${resumeText.substring(0, 15000)}"
        
        Job Description: "${jobDescription.substring(0, 10000)}"

        Output Schema:
        {
            "matchScore": number (0-100),
            "matchSummary": "Brief explanation of why the candidate fits or does not fit (max 2 sentences)",
            "missingKeywords": ["List", "of", "critical", "skills/keywords", "missing", "from", "resume"],
            "profileGaps": ["List of specific gaps (e.g., 'Missing 3 years React experience')"],
            "tailoringAdvice": ["Specific actionalable advice to tailor the resume for this specific job"]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            "messages": [{ "role": "user", "content": prompt }],
            "model": "llama-3.3-70b-versatile",
            "temperature": 0.5,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "response_format": { "type": "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        return JSON.parse(content);

    } catch (error) {
        console.error("Groq Job Match Error:", error.message);
        return {
            matchScore: 0,
            matchSummary: "Failed to analyze job match.",
            missingKeywords: [],
            profileGaps: ["Analysis failed."],
            tailoringAdvice: []
        };
    }
};

const rewriteContent = async (currentText, jobDescription) => {
    try {
        const prompt = `
        Act as an expert resume writer and career coach.
        
        TASK: Rewrite the following resume bullet point or summary to make it more impactful and relevant to the target Job Description.
        
        TARGET JOB DESCRIPTION:
        "${jobDescription.substring(0, 1000)}..."
        
        CURRENT CONTENT:
        "${currentText}"
        
        INSTRUCTIONS:
        1. Generate 3 different options.
        2. Option 1: "Action-Oriented" (Focus on strong verbs and achievements).
        3. Option 2: "Keyword-Optimized" (Focus on integrating keywords from the JD).
        4. Option 3: "Metric-Driven" (Focus on quantifying results, adding placeholders like [X]% or $[Y] if needed).
        5. Return ONLY a valid JSON object. Do not include markdown formatting or backticks.
        
        JSON SCHEMA:
        {
            "options": [
                { "type": "Action-Oriented", "text": "..." },
                { "type": "Keyword-Optimized", "text": "..." },
                { "type": "Metric-Driven", "text": "..." }
            ]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            "messages": [{ "role": "user", "content": prompt }],
            "model": "llama-3.3-70b-versatile",
            "temperature": 0.5,
            "response_format": { "type": "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        return JSON.parse(content);
    } catch (error) {
        console.error('Groq Rewrite Error:', error);
        throw new Error('Failed to rewrite content');
    }
};

const processChat = async (message, history = [], context = {}) => {
    try {
        const { resumeText, jobDescription, matchResult } = context;

        const systemPrompt = `
        You are "ResumeAI Assistant", a super friendly and enthusiastic AI Career Coach. 🚀
        Your goal is to help users land their dream job with positive vibes and expert advice!

        CONTEXT:
        - Candidate Resume: "${resumeText?.substring(0, 10000) || 'Not provided'}"
        - Target Job: "${jobDescription?.substring(0, 5000) || 'Not provided'}"
        - Match Analysis: ${JSON.stringify(matchResult || {})}

        INSTRUCTIONS:
        1. **Tone**: Be warm, human, and encouraging. Use emojis to make it engaging! 😊
        2. **Greetings**: If the user says "hey", "hi", or "hello", reply back normally like a friend. (e.g., "Hey there! How can I help with your career today?").
        3. **Formatting**: Use **bold** text for key points and bullet points for lists. Make it easy to read.
        4. **Advice**: Use the provided context to give specific, actionable tips.
        5. **Fallbacks**: If context is missing, ask the user specifically for what you need (e.g., "I'd love to help! Could you upload your resume first?").
        `;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-6), // Keep last 3 exchanges (6 messages)
            { role: 'user', content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error('Groq Chat Error:', error);
        throw new Error('Failed to process chat message');
    }
};

module.exports = { analyzeResume, analyzeJobMatch, rewriteContent, processChat };
