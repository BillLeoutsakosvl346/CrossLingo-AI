import { StyleSheet, TextInput, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { useVocabulary, useTextToSpeech } from '../../src/lib/hooks';
import { LearnedWord } from '../../src/types';

interface VocabCardProps {
  word: LearnedWord;
  onPlayAudio: (word: string) => void;
  isGeneratingAudio: string | null;
}

export default function VocabularyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const tabBarHeight = useBottomTabBarHeight();
  const [searchText, setSearchText] = useState('');
  const [footerHeight, setFooterHeight] = useState(0);
  
  const { words: vocabulary } = useVocabulary();
  const { generateAndPlaySpeech, isGenerating } = useTextToSpeech();

  // Filter vocabulary based on search
  const filteredVocab = vocabulary.filter(item =>
    item.word.toLowerCase().includes(searchText.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchText.toLowerCase())
  );

  const progressPercent = vocabulary.length > 0 ? 100 : 0; // All words from chat are "learned"

  const handlePlayAudio = async (word: string) => {
    if (isGenerating === word) return;

    const result = await generateAndPlaySpeech(word);
    if (!result?.success) {
      console.error('TTS Error:', result?.error);
    }
  };

  const VocabCard = ({ word, onPlayAudio, isGeneratingAudio }: VocabCardProps) => (
    <View style={[styles.vocabCard, { 
      backgroundColor: theme.surface,
      borderColor: theme.border
    }]}>
      <View style={styles.vocabContent}>
        <View style={styles.wordInfo}>
          <Text style={[styles.foreignWord, { color: '#e53e3e' }]}>{word.word}</Text>
          <Text style={[styles.translation, { color: theme.neutral }]}>{word.translation}</Text>
        </View>
        
        <Pressable
          style={[styles.audioButton, { 
            backgroundColor: theme.primary + '15',
            borderColor: theme.primary + '25'
          }]}
          onPress={() => onPlayAudio(word.word)}
          disabled={isGeneratingAudio === word.word}
        >
          {isGeneratingAudio === word.word ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <MaterialIcons 
              name="volume-up"
              size={18} 
              color={theme.primary} 
            />
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Vocabulary</Text>
        <Text style={[styles.subtitle, { color: theme.neutral }]}>
          {vocabulary.length} words learned from conversations
        </Text>
      </View>

      {/* Enhanced Search */}
      {vocabulary.length > 0 && (
        <View style={[styles.searchContainer, { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.text
        }]}>
          <View style={[styles.searchIconContainer, { backgroundColor: theme.primary + '10' }]}>
            <MaterialIcons name="search" size={18} color={theme.primary} />
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search vocabulary..."
            placeholderTextColor={theme.neutral}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <Pressable 
              style={[styles.clearButton, { backgroundColor: theme.neutral + '15' }]}
              onPress={() => setSearchText('')}
            >
              <MaterialIcons name="clear" size={16} color={theme.neutral} />
            </Pressable>
          )}
        </View>
      )}

      {/* Vocabulary Words */}
      <ScrollView 
        style={styles.vocabList} 
        contentContainerStyle={[
          styles.vocabListContent,
          { paddingBottom: footerHeight || 16 } // Dynamic padding based on footer height
        ]}
        showsVerticalScrollIndicator={false}
      >
        {vocabulary.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="chat" size={64} color={theme.neutral} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No vocabulary yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.neutral }]}>
              Start chatting with your AI teacher to discover new Spanish words. 
              Every Spanish word you encounter will appear here!
            </Text>
          </View>
        ) : filteredVocab.length === 0 ? (
          <View style={styles.emptySearchState}>
            <MaterialIcons name="search-off" size={48} color={theme.neutral} />
            <Text style={[styles.emptyText, { color: theme.neutral }]}>
              No words found for "{searchText}"
            </Text>
          </View>
        ) : (
          <View style={styles.wordsContainer}>
            {filteredVocab.map((item, index) => (
              <VocabCard 
                key={`${item.word}-${item.dateAdded.getTime()}`}
                word={item}
                onPlayAudio={handlePlayAudio}
                isGeneratingAudio={isGenerating}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Section with separator and practice button */}
      {vocabulary.length > 0 && (
        <View 
          style={styles.bottomSection}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
          pointerEvents="box-none"
        >
          {/* Green separator line */}
          <View style={[styles.separator, { backgroundColor: theme.primary }]} />
          
          {/* Black section with two buttons */}
          <View style={styles.practiceSection}>
            <View style={styles.buttonsRow}>
              <View style={styles.buttonWrapper}>
                <Pressable
                  style={[styles.chatButton, {
                    borderColor: theme.primary,
                    backgroundColor: 'transparent'
                  }]}
                  onPress={() => router.push('/(drawer)/chat')}
                >
                  <Text style={[styles.chatButtonText, { color: theme.primary }]}>
                    Chat Further
                  </Text>
                </Pressable>
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Practice Words"
                  variant="primary"
                  size="medium"
                  onPress={() => router.push('/(drawer)/practice')}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  vocabList: {
    flex: 1,
  },
  vocabListContent: {
    // Dynamic paddingBottom added in component
  },
  wordsContainer: {
    gap: 16,
    backgroundColor: 'transparent',
  },
  vocabCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  vocabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  wordInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  foreignWord: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  translation: {
    fontSize: 15,
    lineHeight: 18,
  },
  audioButton: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0, // Flush with content area bottom (React Navigation handles tab bar space)
    left: 0,
    right: 0,
  },
  separator: {
    height: 2,
    marginHorizontal: 0, // Full width - edge to edge
    borderRadius: 0,
  },
  practiceSection: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonWrapper: {
    flex: 1, // Equal width for both buttons
    backgroundColor: 'transparent',
  },
  chatButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySearchState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
