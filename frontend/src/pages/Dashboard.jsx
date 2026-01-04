import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/resume/list');
                setResumes(res.data.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const avgScore = resumes.length > 0
        ? Math.round(resumes.reduce((acc, r) => acc + (r.aiAnalysis?.score || 0), 0) / resumes.length)
        : 0;

    const totalMatches = resumes.reduce((acc, r) => acc + (r.matchHistory?.length || 0), 0);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
                        <p className="text-slate-400">Welcome back, <span className="text-primary-400 font-bold">{user?.name}</span>.</p>
                    </div>
                    <button className="md:hidden text-2xl">☰</button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-slate-400 font-medium">Total Resumes</h3>
                            <span className="text-2xl">📄</span>
                        </div>
                        <p className="text-3xl font-bold font-display relative z-10">{resumes.length}</p>
                        <p className="text-sm text-primary-400 mt-2">Stored securely in cloud</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-slate-400 font-medium">Avg. ATS Score</h3>
                            <span className="text-2xl">⚡</span>
                        </div>
                        <p className="text-3xl font-bold font-display relative z-10">{avgScore}%</p>
                        <p className="text-sm text-emerald-400 mt-2">Overall profile strength</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-500/20 transition-all"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-slate-400 font-medium">Job Matches</h3>
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-3xl font-bold font-display relative z-10">{totalMatches}</p>
                        <p className="text-sm text-slate-500 mt-2">Historical applications</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Recent Analyses</h2>
                        <Link to="/resumes" className="text-xs text-primary-400 hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
                            </div>
                        ) : resumes.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 border border-dashed border-white/10 rounded-xl">
                                No resumes uploaded yet.
                            </div>
                        ) : (
                            resumes.slice(0, 5).map((resume) => (
                                <div key={resume._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:bg-primary-500/20 transition-colors">
                                            📄
                                        </div>
                                        <div>
                                            <h4 className="font-medium truncate w-48 md:w-auto">{resume.originalName}</h4>
                                            <p className="text-xs text-slate-500">
                                                {new Date(resume.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${(resume.aiAnalysis?.score || 0) >= 70
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {resume.aiAnalysis?.score || 0}/100
                                        </span>
                                        <Link
                                            to="/resumes"
                                            className="text-slate-400 hover:text-white transition-colors text-sm"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
