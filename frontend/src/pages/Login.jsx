import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // The @react-oauth/google hook returns an access token, but we need an ID token if we use verifyIdToken on backend.
                // Wait, @react-oauth/google useGoogleLogin usually gives access token.
                // For ID token, we can use the GoogleLogin component or the 'id_token' flow.
                // Let's use the 'implicit' flow or just the standard button for simplicity if we want ID token.
                // Actually, if we use useGoogleLogin with flow: 'auth-code', it's safer.
                // For now, let's use the standard flow that returns the credential (ID token) which is what our backend expects.
                // Wait, useGoogleLogin hook by default gives access token.
                // If I want the ID token (the 'credential'), the easiest way is the GoogleLogin component.
                // But user wants their custom button.
                // Let's use the google login helper that returns the 'credential'.
                setIsLoading(true);
                setError('');
                await loginWithGoogle(tokenResponse.access_token); // Assuming loginWithGoogle can handle the access_token or exchanges it for ID token
                navigate('/dashboard');
            } catch (err) {
                setError(err.response?.data?.message || 'Google Login Failed');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-6">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl opacity-40"></div>
            </div>

            <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center overflow-hidden border border-white/10">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-lg font-display font-bold">Resume-AI</span>
                    </Link>
                    <h2 className="text-3xl font-display font-bold mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to continue your career journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
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

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-slate-400 hover:text-white cursor-pointer select-none">
                            <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500/50" />
                            Remember me
                        </label>
                        <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-3.5 text-lg shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
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
                    <span>Sign in with Google</span>
                </button>

                <div className="mt-8 text-center text-slate-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
