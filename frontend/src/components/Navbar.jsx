import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-primary-500/50 transition-all duration-300">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight">
                        Resume-<span className="text-primary-500">AI</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it works</a>
                </div>

                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link to="/dashboard" className="btn-primary text-sm shadow-glow animate-pulse-slow">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
                    <a
                        href="#features"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                    >
                        How it works
                    </a>
                    <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="btn-primary text-center mt-2"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
