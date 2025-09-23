import { useMemo } from 'react';
import { useVocabularyStore } from '../stores';
import { textParserUtil } from '../utils/textParser';
import { logger } from '../utils/logger';

export const useVocabulary = () => {
  const words = useVocabularyStore((state) => state.words);
  const addWord = useVocabularyStore((state) => state.addWord);
  const hasWord = useVocabularyStore((state) => state.hasWord);
  const clearVocabulary = useVocabularyStore((state) => state.clearVocabulary);
  
  // Create derived values with proper memoization
  const learnedWords = useMemo(() => {
    return Object.values(words)
      .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
  }, [words]);
  
  const wordCount = useMemo(() => Object.keys(words).length, [words]);
  
  const stats = useMemo(() => ({
    totalWords: learnedWords.length,
    recentWords: learnedWords.slice(0, 5), // Already sorted by dateAdded
  }), [learnedWords]);
  
  const processMessage = (messageText: string) => {
    const vocabulary = textParserUtil.extractVocabulary(messageText);
    
    if (vocabulary.length > 0) {
      logger.debug('Vocabulary', 'Processing message', { 
        wordsFound: vocabulary.length,
        words: vocabulary.map(v => v.word)
      });
    }
    
    vocabulary.forEach(({ word, translation }) => {
      addWord(word, translation, messageText);
    });
  };
  
  return {
    words: learnedWords,
    wordCount,
    stats,
    hasWord,
    clearVocabulary,
    processMessage,
  };
};
