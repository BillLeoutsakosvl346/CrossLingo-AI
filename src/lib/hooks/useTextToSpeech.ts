import { useState } from 'react';
import { createAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { textToSpeechApi } from '../api';
import { logger } from '../utils/logger';

const CACHE_DIR = FileSystem.cacheDirectory + 'tts/';

async function ensureFileFromDataURI(word: string, dataUri: string): Promise<string> {
  try {
    // Create cache directory using legacy API (more stable)
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true }).catch(() => {});
    
    // Stable filename per word
    const filePath = `${CACHE_DIR}${encodeURIComponent(word)}.wav`;

    // If already cached, return it
    const info = await FileSystem.getInfoAsync(filePath);
    if (info.exists) return filePath;

    // Write base64 payload to disk (strip data: prefix if present)
    const base64 = dataUri.startsWith('data:') ? dataUri.split(',')[1] : dataUri;
    await FileSystem.writeAsStringAsync(filePath, base64, { encoding: FileSystem.EncodingType.Base64 });
    return filePath;
  } catch (error) {
    console.error('File caching failed:', error);
    // Fallback to original data URI if file caching fails
    return dataUri;
  }
}

export const useTextToSpeech = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  
  const generateAndPlaySpeech = async (spanishWord: string) => {
    if (isGenerating === spanishWord) return;
    
    logger.userAction('TTS', 'generateAndPlay', { word: spanishWord });
    
    // Check if audio is already cached
    if (textToSpeechApi.isAudioCached(spanishWord)) {
      logger.debug('TTS', 'Playing cached audio', { word: spanishWord });
      await playWord(spanishWord);
      return { success: true };
    }
    
    // If word is stuck in loading state, allow force reset
    if (textToSpeechApi.isGenerating(spanishWord)) {
      textToSpeechApi.forceResetWord(spanishWord);
    }
    
    setIsGenerating(spanishWord);
    
    try {
      const response = await textToSpeechApi.generateSpeech(spanishWord);
      
      if (response.success && response.data?.audioUri) {
        await playWord(spanishWord);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Failed to generate speech' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to generate speech' 
      };
    } finally {
      setIsGenerating(null);
    }
  };
  
  const playWord = async (spanishWord: string) => {
    const audioUri = textToSpeechApi.getCachedAudio(spanishWord);
    if (!audioUri) return;
    
    logger.debug('TTS', 'Starting playback', { word: spanishWord });
    
    try {
      // Convert data URI to file for iOS compatibility
      const source = audioUri.startsWith('data:')
        ? await ensureFileFromDataURI(spanishWord, audioUri)
        : audioUri;

      // Create a new player for fire-and-forget playback
      const player = createAudioPlayer(source);
      
      // Start playing
      await player.seekTo(0);
      await player.play();
      
      logger.info('TTS', 'Audio playback started', { 
        word: spanishWord,
        duration: player.duration || 3 
      });
      
      // Auto-cleanup after playback (fire-and-forget)
      const durationSec = player.duration || 3; // fallback to 3 seconds
      setTimeout(() => {
        try { 
          player.release();
          logger.debug('TTS', 'Audio player released', { word: spanishWord });
        } catch (e) {
          // Ignore errors if already released
        }
      }, Math.ceil(durationSec * 1000) + 200); // small buffer
      
    } catch (error) {
      logger.error('TTS', 'Audio playback failed', error as Error, { word: spanishWord });
    }
  };
  
  return {
    generateAndPlaySpeech,
    playWord,
    isGenerating,
    isAudioCached: (word: string) => textToSpeechApi.isAudioCached(word),
    isApiGenerating: (word: string) => textToSpeechApi.isGenerating(word),
    forceResetWord: (word: string) => textToSpeechApi.forceResetWord(word),
    clearCache: () => textToSpeechApi.clearCache(),
    getCacheSize: () => textToSpeechApi.getCacheSize(),
  };
};
