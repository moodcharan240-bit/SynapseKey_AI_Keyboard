import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/50 border-gray-700/30 shadow-lg shadow-black/10'
          : 'bg-white/60 border-gray-200/40 shadow-lg shadow-gray-200/20'
      } ${hover ? 'cursor-pointer' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export function StatCard({ icon, label, value, subtext, color = 'cyan' }: StatCardProps) {
  const { theme } = useTheme();
  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-400 to-cyan-600 shadow-cyan-500/20',
    teal: 'from-teal-400 to-teal-600 shadow-teal-500/20',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-400 to-amber-600 shadow-amber-500/20',
    rose: 'from-rose-400 to-rose-600 shadow-rose-500/20',
    blue: 'from-blue-400 to-blue-600 shadow-blue-500/20',
  };

  const gradient = colorMap[color] || colorMap.cyan;

  return (
    <GlassCard className="p-5" hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {label}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {subtext && (
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {subtext}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
