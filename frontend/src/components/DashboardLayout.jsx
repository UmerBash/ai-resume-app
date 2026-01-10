import { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex relative">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 w-full overflow-x-hidden">
                {/* Mobile Header Toggle */}
                <div className="md:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center border border-white/10">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <span className="font-display font-bold">Resume-AI</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/5"
                    >
                        <span className="text-xl">☰</span>
                    </button>
                </div>

                {children}
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
