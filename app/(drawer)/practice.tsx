import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '@/components/ui/Button';
import { useVocabulary } from '../../src/lib/hooks';
import { router } from 'expo-router';

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { wordCount } = useVocabulary();

  const hasEnoughWords = wordCount >= 5;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <MaterialIcons 
          name={hasEnoughWords ? "quiz" : "fitness-center"} 
          size={64} 
          color={hasEnoughWords ? theme.primary : theme.neutral} 
        />
        
        <Text style={[styles.title, { color: theme.text }]}>
          Practice Mode
        </Text>
        
        {hasEnoughWords ? (
          <>
            <Text style={[styles.subtitle, { color: theme.neutral }]}>
              Ready to test your knowledge! You have {wordCount} words to practice with.
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Start Quiz"
                variant="primary"
                size="large"
                onPress={() => router.push('/(drawer)/quiz')}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.subtitle, { color: theme.neutral }]}>
              You need at least 5 words in your vocabulary to start practicing.
            </Text>
            
            <Text style={[styles.statusText, { color: theme.text }]}>
              Current: {wordCount} / 5 words
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Chat to Learn More Words"
                variant="outline"
                size="large"
                onPress={() => router.push('/(drawer)/chat')}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  content: {
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
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
