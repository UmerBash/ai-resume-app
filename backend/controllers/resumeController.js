const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const { parseResume } = require('../utils/resumeParser');
const { analyzeResume, analyzeJobMatch } = require('../services/aiService');

// @desc    Upload and parse resume
// @route   POST /api/resume/upload
// @access  Public
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log(`Received file: ${req.file.originalname}`);

        // 1. Parse Text
        const text = await parseResume(req.file.buffer, req.file.mimetype);
        console.log(`Parsed text length: ${text.length} characters`);

        // 2. AI Analysis
        console.log("Sending to Gemini...");
        const aiAnalysis = await analyzeResume(text);
        console.log("Analysis complete:", aiAnalysis.score);

        // 3. Save to DB (Only if connected)
        let resume = { _id: 'temp_' + Date.now(), originalName: req.file.originalname };

        if (mongoose.connection.readyState === 1) {
            try {
                resume = await Resume.create({
                    user: req.user._id,
                    originalName: req.file.originalname,
                    text: text,
                    aiAnalysis: aiAnalysis
                });
                console.log('Saved to MongoDB associated with user:', req.user._id);
            } catch (dbError) {
                console.warn("Failed to save to DB:", dbError.message);
            }
        } else {
            console.warn("MongoDB not connected. Skipping save.");
        }

        res.status(201).json({
            success: true,
            data: {
                _id: resume._id,
                filename: resume.originalName,
                extractedTextPreview: text.substring(0, 500) + '...',
                fullText: text,
                analysis: aiAnalysis
            },
        });

    } catch (error) {
        console.error("Upload process failed:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const matchJob = async (req, res) => {
    try {
        const { resumeId, resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: 'Resume Text and Job Description are required' });
        }

        console.log("Analyzing Job Match...");
        const matchResults = await analyzeJobMatch(resumeText, jobDescription);

        // Save to History in DB if resumeId is present (ensure it belongs to user)
        if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
            try {
                await Resume.findOneAndUpdate(
                    { _id: resumeId, user: req.user._id },
                    {
                        $push: {
                            matchHistory: {
                                jobDescription,
                                matchScore: matchResults.score,
                                matchSummary: matchResults.summary,
                                missingKeywords: matchResults.missingKeywords,
                                tailoringAdvice: matchResults.tailoringAdvice
                            }
                        }
                    }
                );
                console.log('Match history saved to DB for user:', req.user._id);
            } catch (historyError) {
                console.warn("Failed to save match history:", historyError.message);
            }
        }

        res.status(200).json({
            success: true,
            data: matchResults
        });

    } catch (error) {
        console.error("Job Match failed:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: resumes.length,
            data: resumes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resumes',
            error: error.message
        });
    }
};

module.exports = {
    uploadResume,
    matchJob,
    getResumes
};
