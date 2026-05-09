import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Keyboard,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Cpu,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
  Mic,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GlassCard, StatCard } from '../components/GlassCard';

const features = [
  {
    icon: <Brain className="w-5 h-5 text-white" />,
    title: 'Hybrid N-gram + LSTM Engine',
    desc: 'Context-aware predictions combining statistical N-gram models with deep learning for superior accuracy.',
    color: 'cyan',
  },
  {
    icon: <Zap className="w-5 h-5 text-white" />,
    title: 'Real-Time Next-Word Prediction',
    desc: 'Instant top-3 suggestions with confidence scores as you type, reducing keystrokes by up to 40%.',
    color: 'teal',
  },
  {
    icon: <Shield className="w-5 h-5 text-white" />,
    title: 'AI Autocorrect',
    desc: 'Intelligent spelling and grammar correction using Levenshtein distance and contextual analysis.',
    color: 'emerald',
  },
  {
    icon: <Target className="w-5 h-5 text-white" />,
    title: 'Adaptive Learning',
    desc: 'Personalized vocabulary that evolves with your writing style and frequently used words.',
    color: 'amber',
  },
  {
    icon: <Mic className="w-5 h-5 text-white" />,
    title: 'Voice-to-Text',
    desc: 'Built-in speech recognition for hands-free typing with real-time transcription.',
    color: 'blue',
  },
  {
    icon: <Globe className="w-5 h-5 text-white" />,
    title: 'Offline Mode',
    desc: 'Lightweight local inference ensures predictions work even without internet connectivity.',
    color: 'rose',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="space-y-16 pb-16">
      <section className="relative pt-12 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-200/30'
          }`} />
          <div className={`absolute bottom-10 right-1/4 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-teal-500/8' : 'bg-teal-200/25'
          }`} />
        </div>

        <div className="relative text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Intelligent Keyboard
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Type Smarter
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              With AI Power
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            SynapseKey AI uses a hybrid N-gram + LSTM prediction engine to deliver
            real-time next-word suggestions, intelligent autocorrect, and adaptive
            learning that evolves with your writing style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/keyboard"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
            >
              <Keyboard className="w-5 h-5" />
              Try the Keyboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/analytics"
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800/50'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </Link>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Zap className="w-5 h-5 text-white" />}
            label="Prediction Speed"
            value="<50ms"
            subtext="Real-time inference"
            color="cyan"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-white" />}
            label="Accuracy"
            value="94.2%"
            subtext="Top-3 predictions"
            color="teal"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-white" />}
            label="Vocabulary"
            value="10K+"
            subtext="Words in model"
            color="emerald"
          />
          <StatCard
            icon={<Cpu className="w-5 h-5 text-white" />}
            label="Keystrokes Saved"
            value="~40%"
            subtext="Average reduction"
            color="amber"
          />
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Intelligent Features
          </h2>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced AI capabilities designed to transform your typing experience
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <GlassCard className="p-6 h-full" hover>
                <div className="space-y-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                    f.color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
                    f.color === 'teal' ? 'from-teal-400 to-teal-600' :
                    f.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                    f.color === 'amber' ? 'from-amber-400 to-amber-600' :
                    f.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    'from-rose-400 to-rose-600'
                  } flex items-center justify-center shadow-lg`}>
                    {f.icon}
                  </div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {f.desc}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <GlassCard className="p-8 sm:p-12 text-center space-y-6">
          <div className="space-y-3">
            <h2 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Ready to Type Smarter?
            </h2>
            <p className={`text-base max-w-lg mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Experience the future of intelligent typing. Start using SynapseKey AI
              and watch your productivity soar.
            </p>
          </div>
          <Link
            to="/keyboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
          >
            <Keyboard className="w-5 h-5" />
            Launch Keyboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
