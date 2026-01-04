import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

// Move to a separate service file in real app
const matchResumeToJob = async (resumeText, jobDescription) => {
    const response = await api.post('/resume/match', {
        resumeText,
        jobDescription
    });
    return response.data.data;
};

const JobMatch = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewrittenOptions, setRewrittenOptions] = useState(null);
    const [showRewriteModal, setShowRewriteModal] = useState(false);

    // In a real app, this would come from a Global Context or previous upload
    // For MVP, we will paste resume text or assume it's stored in localStorage
    const [resumeText, setResumeText] = useState(localStorage.getItem('lastResumeText') || '');

    const handleAnalyze = async () => {
        if (!jobDescription) {
            setError('Please enter a Job Description');
            return;
        }
        if (!resumeText) {
            setError('No resume found. Please upload a resume first.');
            return;
        }

        setIsAnalyzing(true);
        setError('');
        try {
            const data = await matchResumeToJob(resumeText, jobDescription);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Matching failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRewrite = async (textToRewrite) => {
        setIsRewriting(true);
        try {
            const response = await api.post('/resume/rewrite', {
                currentText: textToRewrite || resumeText,
                jobDescription: jobDescription
            });
            setRewrittenOptions(response.data.data.options);
            setShowRewriteModal(true);
        } catch (err) {
            setError('Rewrite failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsRewriting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-display font-bold">Job Matcher</h1>
                    <p className="text-slate-400">See how well your resume fits a specific job.</p>
                </header>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <label className="block text-sm font-bold mb-2 text-slate-300">Your Resume Content</label>
                            <textarea
                                className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-primary-500 transition-colors resize-none mb-2"
                                placeholder="Paste your resume text here..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            ></textarea>
                            <p className="text-xs text-slate-500">
                                Tip: Start here or upload a PDF in "Analyze Resume" to auto-fill this.
                            </p>

                            <div className="mt-4 flex items-center gap-4">
                                <label className="btn-secondary text-sm cursor-pointer flex items-center gap-2">
                                    <span>📂</span> Upload PDF/DOCX
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx"
                                        onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                                const file = e.target.files[0];
                                                setResumeText('Parsing document...');
                                                try {
                                                    const { uploadResume } = await import('../hooks/useResume');
                                                    const data = await uploadResume(file);
                                                    if (data.data.fullText) {
                                                        setResumeText(data.data.fullText);
                                                        localStorage.setItem('lastResumeText', data.data.fullText);
                                                    } else {
                                                        setResumeText('Error: Could not extract text from file.');
                                                    }
                                                } catch (err) {
                                                    setResumeText('Failed to parse file: ' + (err.message || 'Unknown error'));
                                                }
                                            }
                                        }}
                                    />
                                </label>
                                <span className="text-xs text-slate-500">Auto-fills the box above</span>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl">
                            <label className="block text-sm font-bold mb-2 text-slate-300">Target Job Description</label>
                            <textarea
                                className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !resumeText}
                            className={`btn-primary w-full ${isAnalyzing || !resumeText ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAnalyzing ? 'Analyzing Match...' : 'Analyze Compatibility'}
                        </button>

                        {error && <div className="text-rose-400 text-center">{error}</div>}
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {result ? (
                            <div className="animate-fade-in-up space-y-6">
                                {/* Score Card */}
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                                    <div className={`absolute inset-0 opacity-10 ${result.matchScore >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    <div className="relative w-40 h-40 mb-4">
                                        <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <path
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="#1e293b"
                                                strokeWidth="3"
                                            />
                                            <path
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke={result.matchScore >= 70 ? '#10b981' : '#f43f5e'}
                                                strokeWidth="3"
                                                strokeDasharray={`${result.matchScore}, 100`}
                                                className="animate-[spin_1s_ease-out_reverse]"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-4xl font-bold">{result.matchScore}%</span>
                                            <span className="text-xs text-slate-400">MATCH</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Compatibility Report</h3>
                                    <p className="text-slate-300 text-sm">{result.matchSummary}</p>
                                </div>

                                {/* Missing Keywords */}
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="font-bold text-rose-400 mb-4">⚠️ Missing Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.length > 0 ? (
                                            result.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-sm">
                                                    {kw}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-emerald-400 text-sm">No critical keywords missing!</span>
                                        )}
                                    </div>
                                </div>

                                {/* Tailoring Advice */}
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="font-bold text-sky-400 mb-4">💡 Tailoring Advice</h3>
                                    <ul className="space-y-3">
                                        {result.tailoringAdvice.map((tip, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-300 group/tip">
                                                <span className="text-sky-400">•</span>
                                                <div className="flex-1">
                                                    {tip}
                                                    <button
                                                        onClick={() => handleRewrite(tip)}
                                                        className="ml-2 text-xs text-sky-400 opacity-0 group-hover/tip:opacity-100 hover:underline transition-opacity"
                                                    >
                                                        ✨ Optimize this
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleRewrite(resumeText)}
                                        disabled={isRewriting}
                                        className="mt-6 w-full py-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl text-sm font-bold hover:bg-sky-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isRewriting ? '🪄 Casting Magic...' : '✨ Rewrite My Full Resume Summary'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-white/10 rounded-2xl p-8">
                                <span className="text-4xl mb-4">🎯</span>
                                <p className="text-center">Results will appear here after analysis</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rewrite Modal */}
                {showRewriteModal && rewrittenOptions && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                        <div className="glass-card w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto relative border border-white/10 shadow-2xl">
                            <button
                                onClick={() => setShowRewriteModal(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>

                            <div className="mb-6">
                                <h3 className="text-2xl font-display font-bold text-sky-400 mb-2">Rewriter Assistant</h3>
                                <p className="text-slate-400 text-sm">Choose the best version to add to your resume.</p>
                            </div>

                            <div className="space-y-6">
                                {rewrittenOptions.map((opt, i) => (
                                    <div key={i} className="group relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{opt.type}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(opt.text);
                                                    alert('Copied to clipboard!');
                                                }}
                                                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-lg transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-200 text-sm leading-relaxed group-hover:border-sky-500/30 transition-colors">
                                            {opt.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowRewriteModal(false)}
                                className="btn-primary w-full mt-8"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobMatch;
