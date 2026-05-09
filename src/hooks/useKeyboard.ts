import { useState, useCallback, useRef, useEffect } from 'react';
import { predictNextWords, autocorrect, calculateWPM, calculateAccuracy } from '../engine/predictor';
import type { Prediction, AutocorrectResult } from '../types';

interface UseKeyboardReturn {
  text: string;
  setText: (t: string) => void;
  predictions: Prediction[];
  autocorrectResult: AutocorrectResult | null;
  wpm: number;
  accuracy: number;
  charCount: number;
  wordCount: number;
  correctionsCount: number;
  predictionsAcceptedCount: number;
  acceptPrediction: (word: string) => void;
  applyAutocorrect: () => void;
  resetSession: () => void;
  handleInputChange: (value: string) => void;
}

export function useKeyboard(): UseKeyboardReturn {
  const [text, setTextState] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [autocorrectResult, setAutocorrectResult] = useState<AutocorrectResult | null>(null);
  const [correctionsCount, setCorrectionsCount] = useState(0);
  const [predictionsAcceptedCount, setPredictionsAcceptedCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const charCountRef = useRef(0);
  const wordCountRef = useRef(0);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);

  const wpm = startTimeRef.current
    ? calculateWPM(charCountRef.current, Date.now() - startTimeRef.current)
    : 0;
  const accuracy = calculateAccuracy(correctCharsRef.current, totalCharsRef.current || 1);

  const updatePredictions = useCallback((inputText: string) => {
    if (!inputText.trim()) {
      setPredictions(predictNextWords('', 3));
      return;
    }
    const preds = predictNextWords(inputText, 3);
    setPredictions(preds);

    const words = inputText.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord && !inputText.endsWith(' ')) {
      const result = autocorrect(lastWord);
      if (result.corrected !== result.original && result.confidence > 0.5) {
        setAutocorrectResult(result);
      } else {
        setAutocorrectResult(null);
      }
    } else {
      setAutocorrectResult(null);
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    if (!startTimeRef.current && value.length > 0) {
      startTimeRef.current = Date.now();
    }

    const addedChars = value.length - charCountRef.current;
    if (addedChars > 0) {
      totalCharsRef.current += addedChars;
      correctCharsRef.current += addedChars;
    }
    charCountRef.current = value.length;
    wordCountRef.current = value.trim().split(/\s+/).filter(Boolean).length;

    setTextState(value);
    updatePredictions(value);
  }, [updatePredictions]);

  const acceptPrediction = useCallback((word: string) => {
    const newText = text.trim() + ' ' + word + ' ';
    setTextState(newText);
    setPredictionsAcceptedCount((c) => c + 1);
    charCountRef.current = newText.length;
    wordCountRef.current = newText.trim().split(/\s+/).filter(Boolean).length;
    updatePredictions(newText);
  }, [text, updatePredictions]);

  const applyAutocorrect = useCallback(() => {
    if (!autocorrectResult) return;
    const words = text.trim().split(/\s+/);
    words[words.length - 1] = autocorrectResult.corrected;
    const newText = words.join(' ') + ' ';
    setTextState(newText);
    setCorrectionsCount((c) => c + 1);
    setAutocorrectResult(null);
    charCountRef.current = newText.length;
    updatePredictions(newText);
  }, [text, autocorrectResult, updatePredictions]);

  const resetSession = useCallback(() => {
    setTextState('');
    setPredictions(predictNextWords('', 3));
    setAutocorrectResult(null);
    setCorrectionsCount(0);
    setPredictionsAcceptedCount(0);
    startTimeRef.current = null;
    charCountRef.current = 0;
    wordCountRef.current = 0;
    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
  }, []);

  useEffect(() => {
    setPredictions(predictNextWords('', 3));
  }, []);

  return {
    text,
    setText: setTextState,
    predictions,
    autocorrectResult,
    wpm,
    accuracy,
    charCount: charCountRef.current,
    wordCount: wordCountRef.current,
    correctionsCount,
    predictionsAcceptedCount,
    acceptPrediction,
    applyAutocorrect,
    resetSession,
    handleInputChange,
  };
}
