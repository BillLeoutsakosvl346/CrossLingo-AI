import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ScreenContainer from '@/components/ui/ScreenContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useVocabulary } from '../../src/lib/hooks';
import { useUserStatsStore } from '../../src/lib/stores';
import { router } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { wordCount } = useVocabulary();
  
  // Use simple selectors to avoid infinite loops
  const streak = useUserStatsStore((state) => state.streak);
  const xp = useUserStatsStore((state) => state.xp);
  const level = useUserStatsStore((state) => state.level);

  return (
    <ScreenContainer scrollable>
      <Text style={[styles.greeting, { color: theme.text }]}>
        Welcome to <Text style={{ color: theme.primary }}>CrossLingo!</Text>
      </Text>
      
      {/* Statistics Cards */}
      <View style={styles.statsSection}>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statContent}>
            <MaterialIcons name="local-fire-department" size={28} color={theme.accent} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: theme.neutral }]}>Day Streak</Text>
          </View>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statContent}>
            <MaterialIcons name="emoji-events" size={28} color={theme.primary} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{xp}</Text>
            <Text style={[styles.statLabel, { color: theme.neutral }]}>Total XP</Text>
          </View>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statContent}>
            <MaterialIcons name="trending-up" size={28} color={theme.secondary} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{level}</Text>
            <Text style={[styles.statLabel, { color: theme.neutral }]}>Level</Text>
          </View>
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.instructionsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          How CrossLingo Works
        </Text>
        
        <View style={styles.instructionsContainer}>
          <Card>
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                <Text style={[styles.stepText, { color: theme.background }]}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Chat & Learn</Text>
                <Text style={[styles.stepDescription, { color: theme.neutral }]}>
                  Start chatting with your AI teacher to learn Spanish words naturally through conversation.
                </Text>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.stepText, { color: theme.background }]}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Build Vocabulary</Text>
                <Text style={[styles.stepDescription, { color: theme.neutral }]}>
                  Every Spanish word you encounter is automatically saved to your vocabulary with pronunciation.
                </Text>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.accent }]}>
                <Text style={[styles.stepText, { color: theme.background }]}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Practice & Test</Text>
                <Text style={[styles.stepDescription, { color: theme.neutral }]}>
                  Once you have 5+ words, take quizzes to test your knowledge and reinforce learning.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressIndicator}>
          <Text style={[styles.progressText, { color: theme.neutral }]}>
            Vocabulary Progress: {wordCount} words collected
          </Text>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <Button
          title="Start Chatting"
          size="large"
          onPress={() => router.push('/(drawer)/chat')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 70, // Much shorter like profile section
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  instructionsSection: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsContainer: {
    gap: 16,
    backgroundColor: 'transparent',
  },
  instructionStep: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressIndicator: {
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'transparent',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonSection: {
    paddingBottom: 20, // Minimal bottom padding
    backgroundColor: 'transparent',
  },
});
