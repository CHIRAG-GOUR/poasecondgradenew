import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { characters, traitDefinitions } from '../data/activityData';

const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [studentInfo, setStudentInfo] = useState({ name: '', className: '', section: 'Aura' });
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: { optionIds: [...], traits: {...} } }
  const [dynamicQuestions, setDynamicQuestions] = useState(null); // { characterId: [...questions] }
  const [dynamicReport, setDynamicReport] = useState(null);

  // Record an answer for a question
  const recordAnswer = useCallback((questionId, optionIds, traits) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { optionIds, traits },
    }));
  }, []);

  // Calculate total trait scores from all answers
  const traitScores = useMemo(() => {
    const totals = { brave: 0, funny: 0, helpful: 0, curious: 0, smart: 0, adventurous: 0 };
    Object.values(answers).forEach(({ traits }) => {
      if (traits) {
        Object.entries(traits).forEach(([key, val]) => {
          if (totals[key] !== undefined) totals[key] += val;
        });
      }
    });
    return totals;
  }, [answers]);

  // Calculate similarity % between user traits and a character
  const calculateSimilarity = useCallback((characterScores, userScores) => {
    const traitKeys = Object.keys(traitDefinitions);
    // Normalize both vectors
    const charMax = Math.max(...traitKeys.map(k => characterScores[k] || 0), 1);
    const userMax = Math.max(...traitKeys.map(k => userScores[k] || 0), 1);

    let dotProduct = 0;
    let charMagnitude = 0;
    let userMagnitude = 0;

    traitKeys.forEach(key => {
      const c = (characterScores[key] || 0) / charMax;
      const u = (userScores[key] || 0) / userMax;
      dotProduct += c * u;
      charMagnitude += c * c;
      userMagnitude += u * u;
    });

    charMagnitude = Math.sqrt(charMagnitude);
    userMagnitude = Math.sqrt(userMagnitude);

    if (charMagnitude === 0 || userMagnitude === 0) return 50; // default

    const cosine = dotProduct / (charMagnitude * userMagnitude);
    // Map cosine (0-1) to percentage (40-98) for kid-friendly results
    return Math.round(40 + cosine * 58);
  }, []);

  // Selected character similarity
  const similarityPercent = useMemo(() => {
    if (!selectedCharacter) return 0;
    return calculateSimilarity(selectedCharacter.scores, traitScores);
  }, [selectedCharacter, traitScores, calculateSimilarity]);

  // Find the best matching character from all 20
  const bestMatch = useMemo(() => {
    if (Object.keys(answers).length === 0) return null;

    let best = null;
    let bestScore = -1;

    characters.forEach(char => {
      const score = calculateSimilarity(char.scores, traitScores);
      if (score > bestScore) {
        bestScore = score;
        best = { character: char, percent: score };
      }
    });

    return best;
  }, [answers, traitScores, calculateSimilarity]);

  // Top traits of the user (sorted by score, top 3)
  const topTraits = useMemo(() => {
    return Object.entries(traitScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .filter(([, score]) => score > 0)
      .map(([key, score]) => ({
        key,
        score,
        ...traitDefinitions[key],
      }));
  }, [traitScores]);

  // Reset everything for "Try Again"
  const reset = useCallback(() => {
    setSelectedCharacter(null);
    setAnswers({});
    setDynamicQuestions(null);
    setDynamicReport(null);
  }, []);

  return (
    <CharacterContext.Provider value={{
      studentInfo,
      setStudentInfo,
      selectedCharacter,
      setSelectedCharacter,
      answers,
      recordAnswer,
      dynamicQuestions,
      setDynamicQuestions,
      dynamicReport,
      setDynamicReport,
      traitScores,
      similarityPercent,
      bestMatch,
      topTraits,
      reset,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
}
