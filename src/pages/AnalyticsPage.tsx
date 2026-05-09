import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Type,
  Target,
  Zap,
  Clock,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GlassCard, StatCard } from '../components/GlassCard';
import type { DailyStats } from '../types';

function generateDemoData(days: number): DailyStats[] {
  const data: DailyStats[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      avg_wpm: Math.round((45 + Math.random() * 35) * 10) / 10,
      avg_accuracy: Math.round((88 + Math.random() * 10) * 10) / 10,
      total_words: Math.round(100 + Math.random() * 400),
      total_sessions: Math.round(1 + Math.random() * 5),
      predictions_accepted: Math.round(20 + Math.random() * 80),
      corrections_made: Math.round(5 + Math.random() * 25),
    });
  }
  return data;
}

function MiniChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return <circle key={i} cx={x} cy={y} r="1.5" fill={color} />;
      })}
    </svg>
  );
}

function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const { theme } = useTheme();
  const max = Math.max(...data) || 1;

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="w-full rounded-t-md"
            style={{ backgroundColor: color, minHeight: 4 }}
          />
          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<'7' | '14' | '30'>('7');
  const [stats, setStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    setStats(generateDemoData(parseInt(period)));
  }, [period]);

  const avgWpm = stats.length ? Math.round(stats.reduce((s, d) => s + d.avg_wpm, 0) / stats.length * 10) / 10 : 0;
  const avgAccuracy = stats.length ? Math.round(stats.reduce((s, d) => s + d.avg_accuracy, 0) / stats.length * 10) / 10 : 0;
  const totalWords = stats.reduce((s, d) => s + d.total_words, 0);
  const totalPredictions = stats.reduce((s, d) => s + d.predictions_accepted, 0);
  const totalCorrections = stats.reduce((s, d) => s + d.corrections_made, 0);
  const totalSessions = stats.reduce((s, d) => s + d.total_sessions, 0);

  const wpmTrend = stats.length >= 2 ? stats[stats.length - 1].avg_wpm - stats[stats.length - 2].avg_wpm : 0;
  const accTrend = stats.length >= 2 ? stats[stats.length - 1].avg_accuracy - stats[stats.length - 2].avg_accuracy : 0;

  const wpmData = stats.map((s) => s.avg_wpm);
  const accData = stats.map((s) => s.avg_accuracy);
  const wordsData = stats.map((s) => s.total_words);
  const dateLabels = stats.map((s) => s.date.slice(5));

  return (
    <div className="space-y-6 pb-16 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Analytics Dashboard
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your typing performance and AI prediction accuracy
          </p>
        </div>
        <div className={`flex rounded-lg border p-1 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-100'
        }`}>
          {(['7', '14', '30'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                period === p
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          label="Avg WPM"
          value={avgWpm}
          subtext={wpmTrend >= 0 ? `+${wpmTrend.toFixed(1)} vs yesterday` : `${wpmTrend.toFixed(1)} vs yesterday`}
          color="cyan"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-white" />}
          label="Avg Accuracy"
          value={`${avgAccuracy}%`}
          subtext={accTrend >= 0 ? `+${accTrend.toFixed(1)}% vs yesterday` : `${accTrend.toFixed(1)}% vs yesterday`}
          color="teal"
        />
        <StatCard
          icon={<Type className="w-5 h-5 text-white" />}
          label="Total Words"
          value={totalWords.toLocaleString()}
          subtext={`${totalSessions} sessions`}
          color="emerald"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-white" />}
          label="Predictions Used"
          value={totalPredictions.toLocaleString()}
          subtext={`${totalCorrections} corrections`}
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                WPM Trend
              </h3>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              wpmTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {wpmTrend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(wpmTrend).toFixed(1)}
            </div>
          </div>
          <MiniChart data={wpmData} color={theme === 'dark' ? '#22d3ee' : '#0891b2'} height={80} />
        </GlassCard>

        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className={`w-4 h-4 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
              <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Accuracy Trend
              </h3>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              accTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {accTrend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(accTrend).toFixed(1)}%
            </div>
          </div>
          <MiniChart data={accData} color={theme === 'dark' ? '#2dd4bf' : '#0d9488'} height={80} />
        </GlassCard>
      </div>

      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Daily Words Typed
          </h3>
        </div>
        <BarChart
          data={wordsData}
          labels={dateLabels}
          color={theme === 'dark' ? '#34d399' : '#059669'}
        />
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="p-5 border-b border-gray-700/30">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Daily Breakdown
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-right px-5 py-3 font-medium">WPM</th>
                <th className="text-right px-5 py-3 font-medium">Accuracy</th>
                <th className="text-right px-5 py-3 font-medium">Words</th>
                <th className="text-right px-5 py-3 font-medium">Predictions</th>
              </tr>
            </thead>
            <tbody>
              {stats.slice().reverse().map((s) => (
                <tr
                  key={s.date}
                  className={`border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-100'}`}
                >
                  <td className={`px-5 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {s.date}
                  </td>
                  <td className="px-5 py-3 text-right text-cyan-400 font-mono">{s.avg_wpm}</td>
                  <td className="px-5 py-3 text-right text-teal-400 font-mono">{s.avg_accuracy}%</td>
                  <td className="px-5 py-3 text-right font-mono">{s.total_words}</td>
                  <td className="px-5 py-3 text-right text-amber-400 font-mono">{s.predictions_accepted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
