import React, { useState } from 'react';
import { StyleSheet, Pressable, Modal, View as RNView, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { textParserUtil } from '../../src/lib/utils/textParser';
import { useTextToSpeech } from '../../src/lib/hooks';
import { TextSegment } from '../../src/types';

interface InteractiveTextProps {
  text: string;
  style?: any;
  messageId: string;
}

interface TranslationPopupProps {
  visible: boolean;
  word: string;
  translation: string;
  onClose: () => void;
}

const TranslationPopup = ({ visible, word, translation, onClose }: TranslationPopupProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { generateAndPlaySpeech, isGenerating, isAudioCached, isApiGenerating, forceResetWord } = useTextToSpeech();

  const handlePlayPronunciation = async () => {
    if (isGenerating === word) return;

    // If word is stuck in loading state, allow force reset on double-tap
    if (isApiGenerating(word)) {
      forceResetWord(word);
    }

    // Generate and play audio (handles caching internally)
    const result = await generateAndPlaySpeech(word);
    if (!result?.success) {
      console.error('TTS Error:', result?.error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.translationCard, { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.text
        }]}>
          {/* Close Button - Top Right Corner */}
          <Pressable style={[styles.closeButton, { backgroundColor: theme.background + '90' }]} onPress={onClose}>
            <MaterialIcons name="close" size={18} color={theme.neutral} />
          </Pressable>

          <View style={styles.translationHeader}>
            <MaterialIcons name="translate" size={24} color={theme.primary} />
            <Text style={[styles.foreignWordPopup, { color: theme.primary }]}>
              {word}
            </Text>
          </View>
          
          <Text style={[styles.translationText, { color: theme.text }]}>
            {translation}
          </Text>
          
          {/* TTS Button - Centered */}
          <View style={styles.audioSection}>
            <Pressable 
              style={[styles.ttsButton, { 
                backgroundColor: theme.primary + '15',
                borderColor: theme.primary + '30',
                opacity: isGenerating === word ? 0.6 : 1 
              }]}
              onPress={handlePlayPronunciation}
              disabled={isGenerating === word}
            >
              {isGenerating === word ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <MaterialIcons 
                  name={isAudioCached(word) ? "volume-up" : "record-voice-over"} 
                  size={24} 
                  color={theme.primary} 
                />
              )}
            </Pressable>
            
            <Text style={[styles.pronunciationHint, { color: theme.neutral }]}>
              {isGenerating === word 
                ? 'Generating pronunciation...' 
                : isAudioCached(word) 
                  ? 'Tap to hear again'
                  : isApiGenerating(word)
                    ? 'Tap again to retry (stuck?)'
                    : 'Tap to hear pronunciation'
              }
            </Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default function InteractiveText({ text, style, messageId }: InteractiveTextProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [selectedTranslation, setSelectedTranslation] = useState<{word: string, translation: string} | null>(null);

  // Parse the text into segments with memoization to prevent re-parsing
  const parsedText = React.useMemo(() => 
    textParserUtil.parseText(text, messageId), 
    [text, messageId]
  );

  const handleForeignWordPress = (word: string, translation: string) => {
    setSelectedTranslation({ word, translation });
  };

  const handleCloseTranslation = () => {
    setSelectedTranslation(null);
  };

  const getForeignWordColor = () => {
    // Always use red for Spanish words
    return '#e53e3e'; // Nice red color that works on both light and dark themes
  };

  return (
    <>
      <Text style={style}>
        {parsedText.segments.map((segment, index) => {
          const key = `${messageId}_segment_${index}`;
          
          if (segment.type === 'text') {
            return (
              <Text key={key}>
                {segment.text}
              </Text>
            );
          } else {
            // Foreign word segment - use nested Text with onPress
            return (
              <Text
                key={key}
                style={[
                  styles.foreignWord,
                  { 
                    color: getForeignWordColor(),
                    textDecorationColor: getForeignWordColor(),
                  }
                ]}
                onPress={() => handleForeignWordPress(segment.text, segment.translation!)}
              >
                {segment.text}
              </Text>
            );
          }
        })}
      </Text>
      
      {/* Translation Popup */}
      {selectedTranslation && (
        <TranslationPopup
          visible={!!selectedTranslation}
          word={selectedTranslation.word}
          translation={selectedTranslation.translation}
          onClose={handleCloseTranslation}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  foreignWord: {
    fontWeight: '600',
    // No underline or highlighting, just red color
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  translationCard: {
    borderRadius: 20,
    padding: 24,
    paddingTop: 32,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 280,
    maxWidth: 320,
    position: 'relative',
  },
  translationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
    backgroundColor: 'transparent',
  },
  foreignWordPopup: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  translationText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  audioSection: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ttsButton: {
    padding: 16,
    borderRadius: 50,
    borderWidth: 2,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pronunciationHint: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});
