import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { uploadResume } from '../hooks/useResume';

const UploadZone = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={`relative w-full h-80 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 group
        ${isDragging
                    ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                    : 'border-white/20 hover:border-primary-500/50 hover:bg-white/5'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleChange}
                accept=".pdf,.docx"
            />

            {/* Decorative Glow */}
            <div className={`absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl poiner-events-none ${isDragging ? 'opacity-10' : ''}`} />

            <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center relative z-10 border border-white/10 group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                    <span className="text-4xl">📄</span>
                </div>
            </div>

            <h3 className="text-2xl font-display font-bold mb-2 relative z-10">Upload your Resume</h3>
            <p className="text-slate-400 mb-6 text-center max-w-sm relative z-10">
                Drag and drop your PDF or DOCX file here. We'll analyze it for ATS compatibility and Job matching.
            </p>

            <button className="btn-primary relative z-10 pointer-events-none">
                Select File
            </button>
        </div>
    );
};

const ScanningAnimation = () => (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="relative w-80 h-[450px] bg-white text-slate-900 rounded-md shadow-2xl overflow-hidden flex flex-col p-8 opacity-90">
            {/* Fake Resume Content */}
            <div className="space-y-4 filter blur-[1px]">
                <div className="h-8 w-2/3 bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="space-y-2 mt-8">
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                    <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-2 mt-8">
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-scan"></div>
        </div>
        <h2 className="text-2xl font-bold mt-8 animate-pulse text-white">Analyzing Resume...</h2>
        <p className="text-slate-400 mt-2">Extracting skills and experience</p>
    </div>
);

const ResumeUpload = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFile = async (file) => {
        setIsScanning(true);
        setError('');
        try {
            const data = await uploadResume(file);
            // Artificial delay for better UX scanning effect if response is too fast
            setTimeout(() => {
                setResult(data);

                // Store full text for Job Matcher
                if (data.data.fullText) {
                    localStorage.setItem('lastResumeText', data.data.fullText);
                }

                setIsScanning(false);
            }, 2000);
        } catch (err) {
            setIsScanning(false);
            setError(err.message || 'Failed to upload');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {isScanning && <ScanningAnimation />}
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-display font-bold">New Analysis</h1>
                    <p className="text-slate-400">Upload a resume to get started</p>
                </header>

                <div className="max-w-4xl mx-auto mt-12">
                    {!result ? (
                        <>
                            <UploadZone onFileSelect={handleFile} />
                            {error && <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{error}</div>}

                            <div className="mt-12 grid md:grid-cols-2 gap-8 opacity-50 pointer-events-none">
                                <div className="p-6 border border-white/5 rounded-2xl bg-white/5">
                                    <h3 className="font-bold mb-2">Match with Job Description</h3>
                                    <p className="text-sm text-slate-400">Paste a JD url or text to see how well you fit.</p>
                                </div>
                                <div className="p-6 border border-white/5 rounded-2xl bg-white/5">
                                    <h3 className="font-bold mb-2">Compare Profiles</h3>
                                    <p className="text-sm text-slate-400">Compare multiple resumes against one job.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-card p-8 rounded-2xl animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-emerald-400">Analysis Complete</h2>
                                <button onClick={() => setResult(null)} className="text-sm text-slate-400 hover:text-white">Upload Another</button>
                            </div>
                            <div className="space-y-6">
                                {/* Score and Summary */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="col-span-1 bg-slate-900/50 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                                        <div className="relative w-32 h-32 mb-4">
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
                                                    stroke="#6366f1"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${result.data.analysis.score}, 100`}
                                                    className="animate-[spin_1s_ease-out_reverse]"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-3xl font-bold">{result.data.analysis.score}</span>
                                                <span className="text-xs text-slate-400">SCORE</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg">Resume Score</h3>
                                    </div>
                                    <div className="col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-white/10">
                                        <h3 className="text-lg font-bold mb-3 text-purple-400">Professional Summary</h3>
                                        <p className="text-slate-300 leading-relaxed text-sm">
                                            {result.data.analysis.summary}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-lg font-bold mb-4 text-cyan-400">Detected Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.data.analysis.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 transition-colors">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Improvements */}
                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-lg font-bold mb-4 text-rose-400">Recommended Improvements</h3>
                                    <ul className="space-y-3">
                                        {result.data.analysis.improvements.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                                                <span className="text-rose-400 mt-1">⚠️</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-center pt-4">
                                    <p className="text-xs text-slate-500 mb-4">Analysis powered by Google Gemini 1.5 Flash</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResumeUpload;
