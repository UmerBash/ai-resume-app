const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    originalName: { type: String, required: true },
    text: { type: String, required: true },
    aiAnalysis: {
        score: Number,
        summary: String,
        skills: [String],
        improvements: [String],
        formatting_issues: [String]
    },
    matchHistory: [{
        jobDescription: String,
        matchScore: Number,
        matchSummary: String,
        missingKeywords: [String],
        tailoringAdvice: [String],
        date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
