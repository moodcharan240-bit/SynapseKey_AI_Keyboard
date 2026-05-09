export interface Prediction {
  word: string;
  confidence: number;
}

export interface AutocorrectResult {
  original: string;
  corrected: string;
  confidence: number;
  suggestions: string[];
}

export interface TypingSession {
  id: string;
  words_typed: number;
  characters_typed: number;
  corrections_made: number;
  predictions_accepted: number;
  wpm: number;
  accuracy: number;
  duration_seconds: number;
  created_at: string;
}

export interface DailyStats {
  date: string;
  avg_wpm: number;
  avg_accuracy: number;
  total_words: number;
  total_sessions: number;
  predictions_accepted: number;
  corrections_made: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  auto_correct: boolean;
  next_word_prediction: boolean;
  voice_input: boolean;
  suggestion_count: number;
  confidence_threshold: number;
  personalized_learning: boolean;
  offline_mode: boolean;
  keyboard_layout: 'qwerty' | 'dvorak';
}

export interface VocabularyEntry {
  word: string;
  frequency: number;
  last_used: string;
  user_added: boolean;
}

export interface ModelStatus {
  status: 'idle' | 'training' | 'trained' | 'error';
  progress: number;
  vocabulary_size: number;
  ngram_count: number;
  last_trained: string | null;
  accuracy: number;
  epochs_completed: number;
  total_epochs: number;
}
