import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Brain,
  Layers,
  BarChart3,
  Clock,
  Zap,
  Activity,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GlassCard, StatCard } from '../components/GlassCard';
import type { ModelStatus } from '../types';

export function TrainingPage() {
  const { theme } = useTheme();
  const [status, setStatus] = useState<ModelStatus>({
    status: 'idle',
    progress: 0,
    vocabulary_size: 10247,
    ngram_count: 45832,
    last_trained: new Date(Date.now() - 86400000).toISOString(),
    accuracy: 94.2,
    epochs_completed: 0,
    total_epochs: 10,
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const startTraining = useCallback(() => {
    if (status.status === 'training') return;

    setStatus((s) => ({ ...s, status: 'training', progress: 0, epochs_completed: 0 }));
    setLogs([]);
    addLog('Initializing training pipeline...');
    addLog('Loading dataset (10,247 words, 45,832 N-grams)...');
    addLog('Building vocabulary index...');

    let epoch = 0;
    const interval = setInterval(() => {
      epoch++;
      const progress = (epoch / 10) * 100;
      const acc = 85 + Math.random() * 10;

      addLog(`Epoch ${epoch}/10 complete - Loss: ${(0.5 - epoch * 0.04 + Math.random() * 0.02).toFixed(4)} - Accuracy: ${acc.toFixed(1)}%`);

      setStatus((s) => ({
        ...s,
        progress,
        epochs_completed: epoch,
        accuracy: acc,
      }));

      if (epoch >= 10) {
        clearInterval(interval);
        setStatus((s) => ({
          ...s,
          status: 'trained',
          progress: 100,
          last_trained: new Date().toISOString(),
          accuracy: 94.2,
        }));
        addLog('Training complete! Model checkpoint saved.');
        addLog('Final accuracy: 94.2%');
      }
    }, 1500);
  }, [status.status, addLog]);

  const resetTraining = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0,
      vocabulary_size: 10247,
      ngram_count: 45832,
      last_trained: null,
      accuracy: 0,
      epochs_completed: 0,
      total_epochs: 10,
    });
    setLogs([]);
  }, []);

  const statusLabel = status.status === 'trained' ? 'Trained' : status.status === 'training' ? 'Training' : status.status === 'error' ? 'Error' : 'Idle';

  return (
    <div className="space-y-6 pb-16 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Model Training
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor and manage the AI prediction model training pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={status.status === 'training' ? undefined : startTraining}
            disabled={status.status === 'training'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              status.status === 'training'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105'
            }`}
          >
            {status.status === 'training' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {status.status === 'training' ? 'Training...' : 'Start Training'}
          </button>
          <button
            onClick={resetTraining}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            status.status === 'trained'
              ? 'bg-emerald-500/20'
              : status.status === 'training'
                ? 'bg-cyan-500/20 animate-pulse'
                : status.status === 'error'
                  ? 'bg-rose-500/20'
                  : 'bg-blue-500/20'
          }`}>
            {status.status === 'trained' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : status.status === 'training' ? (
              <Cpu className="w-6 h-6 text-cyan-400" />
            ) : status.status === 'error' ? (
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            ) : (
              <Cpu className="w-6 h-6 text-blue-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Model Status: {statusLabel}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                status.status === 'trained'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : status.status === 'training'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : status.status === 'error'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-blue-500/20 text-blue-400'
              }`}>
                {statusLabel}
              </span>
            </div>
            {status.status === 'training' && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Epoch {status.epochs_completed}/{status.total_epochs}
                  </span>
                  <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>
                    {Math.round(status.progress)}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${status.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            {status.last_trained && (
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Last trained: {new Date(status.last_trained).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Database className="w-5 h-5 text-white" />}
          label="Vocabulary Size"
          value={status.vocabulary_size.toLocaleString()}
          subtext="Unique words"
          color="cyan"
        />
        <StatCard
          icon={<Layers className="w-5 h-5 text-white" />}
          label="N-gram Count"
          value={status.ngram_count.toLocaleString()}
          subtext="Bigrams + Trigrams"
          color="teal"
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-white" />}
          label="Model Accuracy"
          value={`${status.accuracy.toFixed(1)}%`}
          subtext="Top-3 predictions"
          color="emerald"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-white" />}
          label="Epochs"
          value={`${status.epochs_completed}/${status.total_epochs}`}
          subtext="Training cycles"
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Model Architecture
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Prediction Engine', value: 'Hybrid N-gram + LSTM' },
              { label: 'N-gram Order', value: '2-gram + 3-gram' },
              { label: 'Beam Search Width', value: '5' },
              { label: 'Embedding Dim', value: '128' },
              { label: 'Hidden Units', value: '256 LSTM' },
              { label: 'Dropout Rate', value: '0.3' },
              { label: 'Optimizer', value: 'Adam (lr=0.001)' },
              { label: 'Loss Function', value: 'Categorical Cross-Entropy' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
                <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Training Log
            </h3>
          </div>
          <div className={`h-64 overflow-y-auto rounded-lg p-3 font-mono text-xs space-y-1 ${
            theme === 'dark' ? 'bg-gray-950 text-gray-400' : 'bg-gray-50 text-gray-600'
          }`}>
            {logs.length === 0 ? (
              <p className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>
                No training logs yet. Click "Start Training" to begin.
              </p>
            ) : (
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${log.includes('complete') ? 'text-cyan-400' : log.includes('Error') ? 'text-rose-400' : ''}`}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Model Checkpoints
          </h3>
        </div>
        <div className="space-y-2">
          {[
            { name: 'ngram_model.json', size: '2.4 MB', date: '2026-05-09', status: 'active' },
            { name: 'lstm_weights.h5', size: '8.1 MB', date: '2026-05-09', status: 'active' },
            { name: 'vocab_index.json', size: '156 KB', date: '2026-05-09', status: 'active' },
            { name: 'checkpoint_epoch5.h5', size: '8.1 MB', date: '2026-05-08', status: 'backup' },
          ].map((cp) => (
            <div
              key={cp.name}
              className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                <div>
                  <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {cp.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {cp.size} - {cp.date}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                cp.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {cp.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
