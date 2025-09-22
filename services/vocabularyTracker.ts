import TextParserService from './textParser';

export interface LearnedWord {
  word: string;
  translation: string;
  context: string;
  dateAdded: Date;
  timesEncountered: number;
}

export class VocabularyTrackerService {
  private static instance: VocabularyTrackerService;
  private learnedWords: Map<string, LearnedWord> = new Map();
  private textParser = TextParserService.getInstance();

  public static getInstance(): VocabularyTrackerService {
    if (!VocabularyTrackerService.instance) {
      VocabularyTrackerService.instance = new VocabularyTrackerService();
    }
    return VocabularyTrackerService.instance;
  }

  /**
   * Process a message and extract/track new vocabulary
   */
  public processMessage(messageText: string): void {
    const vocabulary = this.textParser.extractVocabulary(messageText);
    
    vocabulary.forEach(({ word, translation }) => {
      this.addWord(word, translation, messageText);
    });
  }

  /**
   * Add or update a word in the vocabulary tracker
   */
  private addWord(word: string, translation: string, context: string): void {
    const existingWord = this.learnedWords.get(word.toLowerCase());
    
    if (existingWord) {
      // Update existing word
      existingWord.timesEncountered += 1;
      existingWord.context = context; // Update with latest context
    } else {
      // Add new word
      this.learnedWords.set(word.toLowerCase(), {
        word,
        translation,
        context,
        dateAdded: new Date(),
        timesEncountered: 1,
      });
    }
  }

  /**
   * Get all learned words
   */
  public getLearnedWords(): LearnedWord[] {
    return Array.from(this.learnedWords.values())
      .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
  }

  /**
   * Get vocabulary count
   */
  public getVocabularyCount(): number {
    return this.learnedWords.size;
  }

  /**
   * Check if word exists in vocabulary
   */
  public hasWord(word: string): boolean {
    return this.learnedWords.has(word.toLowerCase());
  }

  /**
   * Clear all vocabulary (for reset functionality)
   */
  public clearVocabulary(): void {
    this.learnedWords.clear();
  }
}

export default VocabularyTrackerService;
