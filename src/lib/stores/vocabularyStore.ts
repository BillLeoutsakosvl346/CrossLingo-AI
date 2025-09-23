import { create } from 'zustand';
import { LearnedWord } from '../../types';
import { logger } from '../utils/logger';

interface VocabularyState {
  words: Record<string, LearnedWord>;
  
  // Actions
  addWord: (word: string, translation: string, context: string) => void;
  hasWord: (word: string) => boolean;
  clearVocabulary: () => void;
}

export const useVocabularyStore = create<VocabularyState>()((set, get) => ({
      words: {},
      
      addWord: (word: string, translation: string, context: string) => {
        const key = word.toLowerCase();
        const existingWord = get().words[key];
        
        if (existingWord) {
          // Update existing word
          logger.stateChange('Vocabulary', 'updateWord', { 
            word, 
            previousCount: existingWord.timesEncountered,
            newCount: existingWord.timesEncountered + 1 
          });
          set(state => ({
            words: {
              ...state.words,
              [key]: {
                ...existingWord,
                timesEncountered: existingWord.timesEncountered + 1,
                context: context, // Update with latest context
              }
            }
          }));
        } else {
          // Add new word
          logger.stateChange('Vocabulary', 'addWord', { 
            word, 
            translation, 
            totalWords: Object.keys(get().words).length + 1 
          });
          set(state => ({
            words: {
              ...state.words,
              [key]: {
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                word,
                translation,
                context,
                dateAdded: new Date(),
                timesEncountered: 1,
              }
            }
          }));
        }
      },
      
      hasWord: (word: string) => {
        return word.toLowerCase() in get().words;
      },
      
      clearVocabulary: () => {
        const wordCount = Object.keys(get().words).length;
        logger.stateChange('Vocabulary', 'clearAll', { clearedWords: wordCount });
        set({ words: {} });
      },
    }));
