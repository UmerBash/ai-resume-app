import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-50 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-300">Powered by Gemini 1.5 Flash</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight mb-8">
                        Craft Your Perfect <br />
                        <span className="text-gradient">Career Story</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop guessing what recruiters want. Our AI analyzes your resume against job descriptions to give you specific, actionable advice to land more interviews.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/resume/upload" className="w-full sm:w-auto btn-primary text-lg px-8 py-4">
                            Analyze My Resume Free
                        </Link>
                        <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white">
                            View Sample Report
                        </a>
                    </div>

                    {/* Stats / Social Proof */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos if needed */}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Choose ResumeAI?</h2>
                        <p className="text-slate-400">Advanced analysis that goes beyond simple keyword matching.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🎯"
                            title="Tailored Matching"
                            desc="Upload a job description and see exactly how well you fit, with a breakdown of missing skills."
                        />
                        <FeatureCard
                            icon="✍️"
                            title="Smart Rewriter"
                            desc="Get instant suggestions to rewrite bullet points for maximum impact and clarity."
                        />
                        <FeatureCard
                            icon="🤖"
                            title="ATS Optimization"
                            desc="Ensure your resume passes the automated Applicant Tracking Systems used by 99% of companies."
                        />
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-24 px-6 bg-slate-900/30" id="how-it-works">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">How it Works</h2>
                        <p className="text-slate-400">Your path to a better career in three simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent -translate-y-1/2 z-0" />

                        <StepCard
                            number="1"
                            title="Upload Resume"
                            desc="Simply drag and drop your current resume. Our AI extracts your experience, skills, and accomplishments instantly."
                            icon="📤"
                        />
                        <StepCard
                            number="2"
                            title="Match with Job"
                            desc="Enter a job description to see how well you fit. AI identifies keyword gaps and provides a compatibility score."
                            icon="🎯"
                        />
                        <StepCard
                            number="3"
                            title="Optimize & Export"
                            desc="Follow AI suggestions to rewrite sections, chat with your career assistant, and export a polished PDF."
                            icon="✨"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card p-8 rounded-2xl hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1 group">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

const StepCard = ({ number, title, desc, icon }) => (
    <div className="relative z-10 text-center space-y-4 group">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-2xl shadow-glow-sm group-hover:border-primary-500/50 transition-all duration-500">
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                {number}
            </span>
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            {desc}
        </p>
    </div>
);

export default LandingPage;
