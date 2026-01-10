import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

const MyResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resume/list');
            setResumes(response.data.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to load resumes. Is the backend and database connected?');
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold">My Saved Resumes</h1>
                <p className="text-slate-400">View and manage your optimized CVs.</p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
                </div>
            ) : resumes.length === 0 ? (
                <div className="text-center py-20 glass-card p-12 rounded-3xl">
                    <span className="text-6xl mb-4 block">📄</span>
                    <h3 className="text-xl font-bold mb-2">No Resumes Found</h3>
                    <p className="text-slate-400 mb-8">You haven't uploaded any resumes yet.</p>
                    <Link to="/resume/upload" className="btn-primary px-8 py-3">
                        Upload Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {resumes.map((resume) => (
                        <div key={resume._id} className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-xl">
                                        📄
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary-400 transition-colors">
                                            {resume.originalName}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-display font-bold text-primary-500">
                                        {resume.aiAnalysis?.score || 'N/A'}
                                    </span>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">ATS Score</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 italic">
                                        "{resume.aiAnalysis?.summary?.substring(0, 150)}..."
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {resume.aiAnalysis?.skills?.slice(0, 5).map((skill, i) => (
                                        <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-slate-300 border border-white/10">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Link
                                        to="/job-match"
                                        onClick={() => localStorage.setItem('lastResumeText', resume.text)}
                                        className="text-xs text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1"
                                    >
                                        🎯 Match Job
                                    </Link>
                                    <Link
                                        to="/export"
                                        onClick={() => localStorage.setItem('lastResumeText', resume.text)}
                                        className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1"
                                    >
                                        📤 Finalize & Export
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default MyResumes;
