import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-primary-500/50 transition-all duration-300">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight">
                        AI <span className="text-primary-500">Resume</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it works</a>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link to="/dashboard" className="btn-primary text-sm shadow-glow animate-pulse-slow">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
