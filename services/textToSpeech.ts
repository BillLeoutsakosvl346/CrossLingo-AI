import { GoogleGenerativeAI } from '@google/generative-ai';
import { Audio } from 'expo-av';
import { Buffer } from 'buffer';
import Constants from 'expo-constants';

const getGoogleApiKey = () => {
  return Constants.expoConfig?.extra?.googleApiKey || 
         Constants.manifest?.extra?.googleApiKey || 
         process.env.GOOGLE_API_KEY;
};

// Lazy initialize Google AI client
let googleAI: GoogleGenerativeAI | null = null;

const getGoogleClient = () => {
  if (!googleAI) {
    const apiKey = getGoogleApiKey();
    
    if (!apiKey) {
      throw new Error('Google API key not found for TTS. Please add GOOGLE_API_KEY to your .env file.');
    }
    googleAI = new GoogleGenerativeAI(apiKey);
  }
  return googleAI;
};


export interface TTSResponse {
  audioUri?: string;
  error?: string;
}

export class TextToSpeechService {
  private static instance: TextToSpeechService;
  private audioCache = new Map<string, string>(); // word -> audio URI
  private loadingWords = new Set<string>(); // prevent duplicate requests

  public static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  /**
   * Generate speech for a Spanish word with caching
   */
  public async generateSpeech(spanishWord: string): Promise<TTSResponse> {
    try {
      const cacheKey = spanishWord.toLowerCase().trim();

      // Check cache first
      if (this.audioCache.has(cacheKey)) {
        return { audioUri: this.audioCache.get(cacheKey)! };
      }

      // Check if already loading
      if (this.loadingWords.has(cacheKey)) {
        return { error: 'Audio is being generated, please wait...' };
      }

      // Mark as loading
      this.loadingWords.add(cacheKey);

      const googleClient = getGoogleClient();
      const model = googleClient.getGenerativeModel({ model: 'gemini-2.5-flash-preview-tts' });

      // Generate audio using Google Gemini TTS
      const result = await model.generateContent({
        contents: [{ 
          parts: [{ 
            text: `Pronounce in Castilian Spanish with clear pronunciation: ${spanishWord}` 
          }] 
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { 
                voiceName: "Kore" // Good voice for Spanish pronunciation
              } 
            }
          }
        }
      });

      // Extract base64 PCM data
      const audioData = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) {
        throw new Error('No audio data received from Google TTS');
      }

      // Convert PCM to WAV format for React Native playback
      const pcmBuffer = Buffer.from(audioData, 'base64');
      const wavBuffer = this.pcmToWav(pcmBuffer, 24000, 1, 16);
      const base64Wav = wavBuffer.toString('base64');
      
      // Create data URI for React Native audio playback  
      const audioUri = `data:audio/wav;base64,${base64Wav}`;

      // Cache the result
      this.audioCache.set(cacheKey, audioUri);
      this.loadingWords.delete(cacheKey);
      return { audioUri };

    } catch (error: any) {
      this.loadingWords.delete(spanishWord.toLowerCase().trim());
      
      const errorMessage = error?.message?.includes('SERVICE_DISABLED')
        ? 'Google TTS API not enabled. Check Google Cloud Console.'
        : error?.status === 429
        ? 'Too many requests. Please wait and try again.'
        : 'Failed to generate pronunciation. Please try again.';

      return { error: errorMessage };
    }
  }

  /**
   * Play cached audio for a word
   */
  public async playWord(spanishWord: string): Promise<void> {
    const audioUri = this.audioCache.get(spanishWord.toLowerCase().trim());
    if (!audioUri) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume: 1.0 }
      );
      
      // Auto-cleanup after playback
      setTimeout(() => sound.unloadAsync().catch(() => {}), 3000);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }

  /**
   * Check if audio is cached for a word
   */
  public isAudioCached(spanishWord: string): boolean {
    return this.audioCache.has(spanishWord.toLowerCase().trim());
  }

  /**
   * Check if audio is currently being generated
   */
  public isGenerating(spanishWord: string): boolean {
    return this.loadingWords.has(spanishWord.toLowerCase().trim());
  }


  /**
   * Convert PCM to WAV format for React Native playback
   */
  private pcmToWav(pcmBuffer: Buffer, sampleRate: number, channels: number, bitDepth: number): Buffer {
    const headerLength = 44;
    const totalLength = headerLength + pcmBuffer.length;
    const wavBuffer = Buffer.alloc(totalLength);

    // WAV header
    wavBuffer.write('RIFF', 0);
    wavBuffer.writeUInt32LE(totalLength - 8, 4);
    wavBuffer.write('WAVE', 8);
    wavBuffer.write('fmt ', 12);
    wavBuffer.writeUInt32LE(16, 16); // Subchunk1Size
    wavBuffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
    wavBuffer.writeUInt16LE(channels, 22);
    wavBuffer.writeUInt32LE(sampleRate, 24);
    wavBuffer.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28); // ByteRate
    wavBuffer.writeUInt16LE(channels * bitDepth / 8, 32); // BlockAlign
    wavBuffer.writeUInt16LE(bitDepth, 34);
    wavBuffer.write('data', 36);
    wavBuffer.writeUInt32LE(pcmBuffer.length, 40);

    // Copy PCM data
    pcmBuffer.copy(wavBuffer, headerLength);

    return wavBuffer;
  }

  /**
   * Clear cache (for reset functionality)
   */
  public clearCache(): void {
    this.audioCache.clear();
    this.loadingWords.clear();
  }

  /**
   * Get cache size
   */
  public getCacheSize(): number {
    return this.audioCache.size;
  }
}

export default TextToSpeechService;
