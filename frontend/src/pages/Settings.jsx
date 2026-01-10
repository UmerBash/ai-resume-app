import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();

    return (
        <DashboardLayout>
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold">Settings</h1>
                <p className="text-slate-400">Manage your account and preferences.</p>
            </header>

            <div className="max-w-2xl space-y-8">
                {/* Profile Section */}
                <section className="glass-card p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase font-bold">Full Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={user?.name || ''}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase font-bold">Email Address</label>
                                <input
                                    type="email"
                                    readOnly
                                    value={user?.email || ''}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Profile editing is currently restricted to viewing only.</p>
                    </div>
                </section>

                {/* AI Configuration Section */}
                <section className="glass-card p-8 rounded-3xl border-primary-500/20 bg-primary-500/[0.02]">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        ✨ AI Engine
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                        Your account is currently using the **Llama 3.3 70b** flagship model via Groq for high-performance analysis.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] text-emerald-400 uppercase font-bold">Status</span>
                            <p className="text-sm font-bold">Connected & Operational</p>
                        </div>
                        <div className="flex-1 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] text-primary-400 uppercase font-bold">Model</span>
                            <p className="text-sm font-bold">Llama-3.3-70b</p>
                        </div>
                    </div>
                </section>

                {/* Account Settings */}
                <section className="glass-card p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-2">Account Actions</h3>
                    <p className="text-sm text-slate-400 mb-6">Manage your session and access.</p>
                    <button
                        onClick={logout}
                        className="bg-white/5 border border-white/10 hover:bg-white/20 px-8 py-3 rounded-xl transition-all font-semibold flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out from Account
                    </button>
                </section>

                {/* Danger Zone */}
                <section className="p-8 border border-red-500/20 rounded-3xl bg-red-500/[0.02]">
                    <h3 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h3>
                    <p className="text-sm text-slate-500 mb-6">Once you delete your account or stored data, there is no going back.</p>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 border border-red-500/30 text-red-500 rounded-xl text-sm hover:bg-red-500/10 transition-colors">
                            Clear All History
                        </button>
                        <button className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
