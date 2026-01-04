import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showExistsNotify, setShowExistsNotify] = useState(false);

    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);
                setError('');
                const data = await loginWithGoogle(tokenResponse.access_token);

                if (data?.alreadyExists) {
                    setShowExistsNotify(true);
                    // Wait 3 seconds to show the beautiful notification, then redirect
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3500);
                } else {
                    navigate('/dashboard');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Google signup failed');
                setIsLoading(false);
            }
        },
        onError: () => setError('Google signup failed'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-6">
            <AnimatePresence>
                {showExistsNotify && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 30, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm"
                    >
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-primary-500/30 p-6 rounded-2xl shadow-2xl shadow-primary-500/20 flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center text-3xl">
                                ✨
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-white mb-2">Welcome Back!</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    You already have an account with this Google email. We're logging you in now...
                                </p>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent-500/20 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-40"></div>
            </div>

            <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary p-0.5 overflow-hidden">
                            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                            </div>
                        </div>
                        <span className="text-lg font-display font-bold">AI Resume</span>
                    </Link>
                    <h2 className="text-3xl font-display font-bold mb-2">Get Started</h2>
                    <p className="text-slate-400">Create your account to start analyzing</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-3.5 text-lg shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">or continue with</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <button
                    onClick={() => handleGoogleLogin()}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-semibold group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span>Sign up with Google</span>
                </button>

                <div className="mt-8 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
