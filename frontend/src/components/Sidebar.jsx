import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Analyze Resume', path: '/resume/upload', icon: '📄' },
    { name: 'Job Match', path: '/job-match', icon: '🎯' },
    { name: 'Export Resume', path: '/export', icon: '📤' },
    { name: 'My Resumes', path: '/resumes', icon: '📂' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
];

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900 border-r border-white/5 flex flex-col z-40 hidden md:flex">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2 mb-8 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-primary-500/50 transition-all duration-300">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-lg font-display font-bold text-white">Resume-AI</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4 px-2">
                    <Link to="/settings" className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors flex-1 overflow-hidden group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate w-24 group-hover:text-primary-400 transition-colors">{user?.name}</p>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors ml-1"
                        title="Logout"
                    >
                        <span className="text-lg">🚪</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
