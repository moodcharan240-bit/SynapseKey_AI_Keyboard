import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  RotateCcw,
  Mic,
  MicOff,
  Sparkles,
  Check,
  AlertCircle,
  Type,
  Hash,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useKeyboard } from '../hooks/useKeyboard';
import { GlassCard } from '../components/GlassCard';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['space', '.', ',', '!', '?', "'"],
];

export function KeyboardPage() {
  const { theme } = useTheme();
  const {
    text,
    predictions,
    autocorrectResult,
    wpm,
    accuracy,
    charCount,
    wordCount,
    correctionsCount,
    predictionsAcceptedCount,
    acceptPrediction,
    applyAutocorrect,
    resetSession,
    handleInputChange,
  } = useKeyboard();

  const [isListening, setIsListening] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleVirtualKey = useCallback((key: string) => {
    if (key === '⌫') {
      handleInputChange(text.slice(0, -1));
    } else if (key === 'space') {
      handleInputChange(text + ' ');
    } else {
      handleInputChange(text + key);
    }
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 120);
  }, [text, handleInputChange]);

  const toggleVoice = useCallback(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript)
        .join(' ');
      handleInputChange(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, handleInputChange]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            AI Keyboard
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Type with intelligent predictions and autocorrect
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">{isListening ? 'Stop' : 'Voice'}</span>
          </button>
          <button
            onClick={resetSession}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <TrendingUp className="w-4 h-4" />, label: 'WPM', value: wpm, color: 'text-cyan-400' },
          { icon: <Type className="w-4 h-4" />, label: 'Words', value: wordCount, color: 'text-teal-400' },
          { icon: <Hash className="w-4 h-4" />, label: 'Chars', value: charCount, color: 'text-emerald-400' },
          { icon: <Clock className="w-4 h-4" />, label: 'Accuracy', value: `${accuracy}%`, color: 'text-amber-400' },
        ].map((stat) => (
          <GlassCard key={stat.label} className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={stat.color}>{stat.icon}</span>
              <div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Start typing to see AI predictions..."
          className={`w-full h-40 sm:h-48 p-5 rounded-xl resize-none text-base leading-relaxed focus:outline-none transition-colors ${
            theme === 'dark'
              ? 'bg-transparent text-white placeholder-gray-600'
              : 'bg-transparent text-gray-900 placeholder-gray-400'
          }`}
        />
      </GlassCard>

      <AnimatePresence>
        {autocorrectResult && autocorrectResult.corrected !== autocorrectResult.original && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                Did you mean <strong>{autocorrectResult.corrected}</strong>?
              </span>
              <span className="text-xs opacity-60">
                ({Math.round(autocorrectResult.confidence * 100)}% confidence)
              </span>
              <button
                onClick={applyAutocorrect}
                className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
              >
                <Check className="w-3 h-3" />
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Next Word Predictions
          </span>
        </div>
        <div className="flex gap-3">
          <AnimatePresence mode="popLayout">
            {predictions.map((pred, i) => (
              <motion.button
                key={pred.word}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                onClick={() => acceptPrediction(pred.word)}
                className={`group relative flex-1 px-4 py-3 rounded-xl border text-left transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                    : 'bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {pred.word}
                  </span>
                  <span className={`text-xs font-mono ${
                    theme === 'dark' ? 'text-cyan-400/70' : 'text-cyan-600/70'
                  }`}>
                    {Math.round(pred.confidence * 100)}%
                  </span>
                </div>
                <div className={`mt-2 h-1 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pred.confidence * 100}%` }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
                  />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Predictions Accepted</p>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{predictionsAcceptedCount}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Corrections Made</p>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{correctionsCount}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Type className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Virtual Keyboard
          </span>
        </div>
        <GlassCard className="p-3 space-y-2">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1.5">
              {ri === 1 && <div className="w-3" />}
              {ri === 2 && <div className="w-6" />}
              {row.map((key) => {
                const isActive = activeKey === key;
                const isSpecial = key === '⌫' || key === 'space';
                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleVirtualKey(key)}
                    className={`flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-100 select-none ${
                      key === 'space'
                        ? 'flex-[3] h-10'
                        : isSpecial
                          ? 'w-12 h-10'
                          : 'w-8 sm:w-9 h-10'
                    } ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : theme === 'dark'
                          ? 'bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {key === 'space' ? 'Space' : key}
                  </motion.button>
                );
              })}
              {ri === 2 && <div className="w-6" />}
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}
