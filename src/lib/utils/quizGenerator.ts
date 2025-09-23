import { LearnedWord, QuizQuestion, QuizResult } from '../../types';

class QuizGeneratorUtil {
  /**
   * Generate a quiz with multiple choice questions
   */
  generateQuiz(vocabulary: LearnedWord[]): QuizQuestion[] {
    if (vocabulary.length < 5) {
      return [];
    }

    // Take up to 10 most recent words
    const wordsForQuiz = vocabulary.slice(0, Math.min(10, vocabulary.length));
    const questions: QuizQuestion[] = [];

    wordsForQuiz.forEach((word, index) => {
      // Randomly choose question type
      const isSpanishToEnglish = Math.random() > 0.5;
      
      const question = this.generateMultipleChoiceQuestion(word, vocabulary, isSpanishToEnglish);
      questions.push({
        ...question,
        id: `q_${index}_${Date.now()}`,
      });
    });

    return this.shuffleArray(questions);
  }

  /**
   * Generate a multiple choice question for a word
   */
  private generateMultipleChoiceQuestion(
    targetWord: LearnedWord, 
    allWords: LearnedWord[], 
    spanishToEnglish: boolean
  ): Omit<QuizQuestion, 'id'> {
    const correctAnswer = spanishToEnglish ? targetWord.translation : targetWord.word;
    const question = spanishToEnglish ? targetWord.word : targetWord.translation;
    
    // Get wrong answers from other vocabulary words
    const otherWords = allWords.filter(w => w.word !== targetWord.word);
    const wrongAnswers = this.shuffleArray(
      otherWords.map(w => spanishToEnglish ? w.translation : w.word)
    ).slice(0, 2); // Take 2 wrong answers

    // Combine and shuffle options
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      type: spanishToEnglish ? 'spanish-to-english' : 'english-to-spanish',
      question,
      correctAnswer,
      options,
      word: targetWord,
    };
  }

  /**
   * Calculate quiz results
   */
  calculateResults(questions: QuizQuestion[], userAnswers: string[]): QuizResult {
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const xpEarned = correctCount * 10; // 10 XP per correct answer

    return {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage,
      completedAt: new Date(),
      xpEarned,
    };
  }

  /**
   * Check if vocabulary has enough words for quiz
   */
  canStartQuiz(vocabularyCount: number): boolean {
    return vocabularyCount >= 5;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const quizGeneratorUtil = new QuizGeneratorUtil();
