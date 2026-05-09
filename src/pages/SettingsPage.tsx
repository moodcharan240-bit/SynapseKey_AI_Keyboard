import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Zap,
  Type,
  Mic,
  Brain,
  Wifi,
  WifiOff,
  Keyboard,
  Sliders,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GlassCard } from '../components/GlassCard';
import type { UserSettings } from '../types';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  auto_correct: true,
  next_word_prediction: true,
  voice_input: false,
  suggestion_count: 3,
  confidence_threshold: 0.3,
  personalized_learning: true,
  offline_mode: false,
  keyboard_layout: 'qwerty',
};

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('synapsekey-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('synapsekey-settings', JSON.stringify(settings));
  }, [settings]);

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('synapsekey-settings');
  };

  function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-cyan-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`}
      >
        <motion.div
          layout
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: enabled ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    );
  }

  function SettingRow({
    icon,
    label,
    description,
    children,
  }: {
    icon: React.ReactNode;
    label: string;
    description: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-between py-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {icon}
          </div>
          <div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {label}
            </p>
            <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {description}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 sm:pb-8 max-w-2xl mx-auto">
      <div className="space-y-1">
        <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure your AI keyboard experience
        </p>
      </div>

      <GlassCard className="divide-y divide-gray-700/30">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h2 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Appearance
            </h2>
          </div>
        </div>
        <div className="px-5">
          <SettingRow
            icon={theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            label="Dark Mode"
            description="Switch between dark and light themes"
          >
            <Toggle enabled={settings.theme === 'dark'} onToggle={() => {
              update('theme', settings.theme === 'dark' ? 'light' : 'dark');
              toggleTheme();
            }} />
          </SettingRow>
        </div>
      </GlassCard>

      <GlassCard className="divide-y divide-gray-700/30">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Brain className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h2 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              AI Features
            </h2>
          </div>
        </div>
        <div className="px-5 divide-y divide-gray-700/30">
          <SettingRow
            icon={<Zap className="w-4 h-4" />}
            label="Next-Word Prediction"
            description="Show AI-powered word suggestions as you type"
          >
            <Toggle enabled={settings.next_word_prediction} onToggle={() => update('next_word_prediction', !settings.next_word_prediction)} />
          </SettingRow>
          <SettingRow
            icon={<Shield className="w-4 h-4" />}
            label="Auto-Correct"
            description="Automatically correct spelling mistakes"
          >
            <Toggle enabled={settings.auto_correct} onToggle={() => update('auto_correct', !settings.auto_correct)} />
          </SettingRow>
          <SettingRow
            icon={<Brain className="w-4 h-4" />}
            label="Personalized Learning"
            description="Learn from your typing patterns and vocabulary"
          >
            <Toggle enabled={settings.personalized_learning} onToggle={() => update('personalized_learning', !settings.personalized_learning)} />
          </SettingRow>
        </div>
      </GlassCard>

      <GlassCard className="divide-y divide-gray-700/30">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Keyboard className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h2 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Input
            </h2>
          </div>
        </div>
        <div className="px-5 divide-y divide-gray-700/30">
          <SettingRow
            icon={<Mic className="w-4 h-4" />}
            label="Voice Input"
            description="Enable speech-to-text for hands-free typing"
          >
            <Toggle enabled={settings.voice_input} onToggle={() => update('voice_input', !settings.voice_input)} />
          </SettingRow>
          <SettingRow
            icon={settings.offline_mode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            label="Offline Mode"
            description="Use lightweight local model without network"
          >
            <Toggle enabled={settings.offline_mode} onToggle={() => update('offline_mode', !settings.offline_mode)} />
          </SettingRow>
          <SettingRow
            icon={<Type className="w-4 h-4" />}
            label="Keyboard Layout"
            description="Choose your preferred keyboard layout"
          >
            <select
              value={settings.keyboard_layout}
              onChange={(e) => update('keyboard_layout', e.target.value as 'qwerty' | 'dvorak')}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="qwerty">QWERTY</option>
              <option value="dvorak">Dvorak</option>
            </select>
          </SettingRow>
        </div>
      </GlassCard>

      <GlassCard className="divide-y divide-gray-700/30">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h2 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Prediction Tuning
            </h2>
          </div>
        </div>
        <div className="px-5 divide-y divide-gray-700/30">
          <div className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Suggestion Count
                </p>
                <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Number of word suggestions to display
                </p>
              </div>
              <span className={`text-sm font-mono ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {settings.suggestion_count}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.suggestion_count}
              onChange={(e) => update('suggestion_count', parseInt(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
          <div className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Confidence Threshold
                </p>
                <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Minimum confidence to show suggestions
                </p>
              </div>
              <span className={`text-sm font-mono ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {Math.round(settings.confidence_threshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={Math.round(settings.confidence_threshold * 100)}
              onChange={(e) => update('confidence_threshold', parseInt(e.target.value) / 100)}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      </GlassCard>

      <button
        onClick={resetSettings}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          theme === 'dark'
            ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20'
            : 'text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100'
        }`}
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Defaults
      </button>
    </div>
  );
}
