import { StyleSheet, TextInput, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import ScreenContainer from '@/components/ui/ScreenContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface VocabularyItem {
  word: string;
  translation: string;
  learned: boolean;
}

interface VocabCardProps {
  word: string;
  translation: string;
  learned: boolean;
}

// Sample vocabulary data
const vocabulary: VocabularyItem[] = [
  { word: 'hola', translation: 'hello', learned: true },
  { word: 'gracias', translation: 'thank you', learned: true },
  { word: 'por favor', translation: 'please', learned: false },
  { word: 'adiós', translation: 'goodbye', learned: true },
  { word: 'sí', translation: 'yes', learned: false },
  { word: 'no', translation: 'no', learned: true },
  { word: 'agua', translation: 'water', learned: false },
  { word: 'comida', translation: 'food', learned: false },
];

export default function VocabularyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [searchText, setSearchText] = useState('');

  const filteredVocab = vocabulary.filter(item =>
    item.word.toLowerCase().includes(searchText.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchText.toLowerCase())
  );

  const learnedCount = vocabulary.filter(v => v.learned).length;
  const progressPercent = (learnedCount / vocabulary.length) * 100;

  const VocabCard = ({ word, translation, learned }: VocabCardProps) => (
    <View style={[
      styles.vocabCard,
      { 
        backgroundColor: learned ? theme.primary + '10' : theme.surface,
        borderColor: learned ? theme.primary + '30' : theme.border,
      }
    ]}>
      <View style={styles.wordContainer}>
        <View style={styles.wordInfo}>
          <Text style={[styles.foreignWord, { color: theme.text }]}>{word}</Text>
          <Text style={[styles.translation, { color: theme.neutral }]}>{translation}</Text>
        </View>
        <View style={[
          styles.statusIcon,
          { backgroundColor: learned ? theme.primary : theme.surfaceVariant }
        ]}>
          <MaterialIcons 
            name={learned ? "check" : "circle-outline"} 
            size={18} 
            color={learned ? theme.background : theme.neutral} 
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer scrollable hasTabBar>
      {/* Modern Header with Stats */}
      <View style={styles.headerSection}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, { color: theme.text }]}>My Vocabulary</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statBadge, { backgroundColor: theme.primary + '20' }]}>
              <MaterialIcons name="check-circle" size={16} color={theme.primary} />
              <Text style={[styles.statText, { color: theme.primary }]}>{learnedCount} learned</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: theme.secondary + '20' }]}>
              <MaterialIcons name="pending" size={16} color={theme.secondary} />
              <Text style={[styles.statText, { color: theme.secondary }]}>{vocabulary.length - learnedCount} to go</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressCircle, { borderColor: theme.primary + '30' }]}>
            <View style={[
              styles.progressCircleInner,
              { backgroundColor: theme.primary + '20' }
            ]}>
              <Text style={[styles.progressPercentage, { color: theme.primary }]}>
                {Math.round(progressPercent)}%
              </Text>
              <Text style={[styles.progressLabel, { color: theme.neutral }]}>complete</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modern Search */}
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.surface,
        borderColor: theme.border
      }]}>
        <MaterialIcons name="search" size={22} color={theme.neutral} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search words..."
          placeholderTextColor={theme.neutral}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <MaterialIcons 
            name="clear" 
            size={20} 
            color={theme.neutral} 
            onPress={() => setSearchText('')}
          />
        )}
      </View>

      {/* Vocabulary List */}
      <View style={styles.vocabSection}>
        {filteredVocab.length > 0 ? (
          filteredVocab.map((item, index) => (
            <VocabCard 
              key={`${item.word}-${index}`}
              word={item.word}
              translation={item.translation}
              learned={item.learned}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color={theme.neutral} />
            <Text style={[styles.emptyText, { color: theme.neutral }]}>
              {searchText ? `No words found for "${searchText}"` : 'No vocabulary words yet'}
            </Text>
          </View>
        )}
      </View>

      {/* Fixed Practice Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={`Practice ${vocabulary.filter(v => !v.learned).length} Words`}
          variant="primary"
          size="large"
          onPress={() => console.log('Starting vocabulary practice')}
          disabled={vocabulary.filter(v => !v.learned).length === 0}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  titleArea: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  vocabSection: {
    gap: 12,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  vocabCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  wordContainer: {
    backgroundColor: 'transparent',
  },
  wordInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  foreignWord: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  translation: {
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.8,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
});
