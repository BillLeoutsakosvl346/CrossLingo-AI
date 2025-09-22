import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import QuizService, { QuizQuestion, QuizResult } from '../../services/quizService';
import { router } from 'expo-router';

export default function QuizScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  const quizService = QuizService.getInstance();

  // Initialize quiz
  useEffect(() => {
    const generatedQuestions = quizService.generateQuiz();
    setQuestions(generatedQuestions);
    setUserAnswers(new Array(generatedQuestions.length).fill(''));
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrectAnswer = selectedAnswer === currentQuestion?.correctAnswer;

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!hasAnswered) return;

    // Save answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer!;
    setUserAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate and show results
      const result = quizService.calculateResults(questions, [...newAnswers]);
      setQuizResult(result);
      setShowResult(true);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  };

  const handleRetakeQuiz = () => {
    const newQuestions = quizService.generateQuiz();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(newQuestions.length).fill(''));
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResult(false);
    setQuizResult(null);
  };

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <MaterialIcons name="error" size={64} color={theme.neutral} />
          <Text style={[styles.title, { color: theme.text }]}>Quiz Not Available</Text>
          <Text style={[styles.subtitle, { color: theme.neutral }]}>
            You need at least 5 words in your vocabulary to take a quiz.
          </Text>
          <Button
            title="Go to Chat"
            variant="primary"
            size="large"
            onPress={() => router.push('/(drawer)/chat')}
          />
        </View>
      </View>
    );
  }

  if (showResult && quizResult) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <MaterialIcons 
            name={quizResult.percentage >= 70 ? "celebration" : "psychology"} 
            size={80} 
            color={quizResult.percentage >= 70 ? theme.primary : theme.secondary} 
          />
          <Text style={[styles.title, { color: theme.text }]}>Quiz Complete!</Text>
          <Text style={[styles.scoreText, { color: theme.primary }]}>
            {quizResult.correctAnswers} / {quizResult.totalQuestions}
          </Text>
          <Text style={[styles.percentageText, { color: theme.text }]}>
            {quizResult.percentage}% Correct
          </Text>
          
          <View style={styles.resultActions}>
            <Button
              title="Retake Quiz"
              variant="outline"
              size="medium"
              onPress={handleRetakeQuiz}
            />
            <Button
              title="Back to Practice"
              variant="primary"
              size="medium"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Progress Header */}
      <View style={styles.header}>
        <Text style={[styles.progressText, { color: theme.neutral }]}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.surfaceVariant }]}>
          <View 
            style={[styles.progressFill, { 
              backgroundColor: theme.primary,
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
            }]} 
          />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionSection}>
        <Text style={[styles.questionType, { color: theme.neutral }]}>
          {currentQuestion.type === 'spanish-to-english' 
            ? 'What does this Spanish word mean?' 
            : 'How do you say this in Spanish?'}
        </Text>
        <Text style={[styles.questionText, { color: theme.text }]}>
          {currentQuestion.question}
        </Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const isWrong = hasAnswered && isSelected && !isCorrect;
          const shouldShowCorrect = hasAnswered && isCorrect;
          
          return (
            <View
              key={index}
              style={[
                styles.optionCard,
                { 
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
                // Selection state (before answering)
                isSelected && !hasAnswered && { 
                  borderColor: theme.primary,
                  borderWidth: 2,
                  backgroundColor: theme.primary + '08',
                },
                // Correct answer styling
                shouldShowCorrect && { 
                  backgroundColor: theme.primary + '20',
                  borderColor: '#28a745',
                  borderWidth: 2,
                  shadowColor: '#28a745',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                },
                // Wrong answer styling
                isWrong && { 
                  backgroundColor: '#dc3545' + '20',
                  borderColor: '#dc3545',
                  borderWidth: 2,
                  shadowColor: '#dc3545',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }
              ]}
            >
              <Card onPress={() => handleAnswerSelect(option)}>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText, 
                    { 
                      color: shouldShowCorrect 
                        ? '#28a745' 
                        : isWrong 
                          ? '#dc3545'
                          : isSelected && !hasAnswered
                            ? theme.primary
                            : theme.text,
                      fontWeight: (isSelected || shouldShowCorrect) ? '700' : '500'
                    }
                  ]}>
                    {option}
                  </Text>
                  
                  {/* Single indicator logic - no duplicates */}
                  {isSelected && isCorrect && hasAnswered && (
                    <MaterialIcons name="check-circle" size={24} color="#28a745" />
                  )}
                  {isSelected && !isCorrect && hasAnswered && (
                    <MaterialIcons name="highlight-off" size={24} color="#dc3545" />
                  )}
                  {!isSelected && isCorrect && hasAnswered && (
                    <MaterialIcons name="check-circle" size={24} color="#28a745" />
                  )}
                </View>
              </Card>
            </View>
          );
        })}
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <Button
          title={isLastQuestion ? "Finish Quiz" : "Next Question"}
          variant="primary"
          size="medium"
          onPress={handleNextQuestion}
          disabled={!hasAnswered}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20, // Add bottom padding to prevent overlap
  },
  header: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionSection: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  questionType: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: 12, // Smaller gaps
    backgroundColor: 'transparent',
    marginBottom: 20, // Space before footer
  },
  optionCard: {
    borderRadius: 12, // Smaller radius for more compact look
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    minHeight: 48, // Much smaller height
    paddingVertical: 4, // Less padding
  },
  optionText: {
    fontSize: 16, // Smaller text
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '800',
    marginVertical: 16,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
