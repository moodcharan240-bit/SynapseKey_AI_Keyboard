import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Keyboard,
  BarChart3,
  Settings,
  Cpu,
  Home,
  Zap,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/keyboard', icon: Keyboard, label: 'Keyboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/training', icon: Cpu, label: 'Training' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900'
    }`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
        theme === 'dark'
          ? 'bg-gray-950/70 border-gray-800/50'
          : 'bg-white/70 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  SynapseKey
                </span>
                <span className="ml-1 text-xs font-medium text-cyan-400/70">AI</span>
              </div>
            </NavLink>

            <div className="flex items-center gap-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? theme === 'dark'
                          ? 'text-cyan-400 bg-cyan-400/10'
                          : 'text-cyan-600 bg-cyan-50'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>

      <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t ${
        theme === 'dark'
          ? 'bg-gray-950/80 border-gray-800/50'
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'text-cyan-400'
                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
