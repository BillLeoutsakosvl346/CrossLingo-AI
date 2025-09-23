import { Buffer } from 'buffer';
import { getApiKeys, withRetry, createApiResponse } from './client';
import { TTSResponse, GoogleTTSRequest, GoogleTTSResponse, ApiResponse } from '../../types';
import { logger } from '../utils/logger';

class TextToSpeechApi {
  private audioCache = new Map<string, string>(); // word -> audio URI
  private loadingWords = new Set<string>(); // prevent duplicate requests

  async generateSpeech(spanishWord: string): Promise<ApiResponse<TTSResponse>> {
    const cacheKey = spanishWord.toLowerCase().trim();
    logger.debug('TTS', 'Generate speech requested', { word: spanishWord });
    
    try {
      // Check cache first
      if (this.audioCache.has(cacheKey)) {
        logger.debug('TTS', 'Audio found in cache', { word: spanishWord });
        return createApiResponse<TTSResponse>({ 
          audioUri: this.audioCache.get(cacheKey)! 
        });
      }

      // Clear any stuck loading states
      this.clearStuckLoading();

      // Check if already loading
      if (this.loadingWords.has(cacheKey)) {
        logger.debug('TTS', 'Audio already generating', { word: spanishWord });
        return createApiResponse<TTSResponse>(
          undefined,
          { message: 'Audio is being generated, please wait...', code: 'GENERATING' }
        );
      }

      // Mark as loading with timeout protection
      this.loadingWords.add(cacheKey);
      logger.apiCall('TTS', 'generateSpeech', 'Google TTS API', { word: spanishWord });
      
      // Auto-clear loading state after 30 seconds
      setTimeout(() => {
        this.loadingWords.delete(cacheKey);
      }, 30000);

      const audioUri = await withRetry(async () => {
        const { google: apiKey } = getApiKeys();
        if (!apiKey) {
          throw new Error('Google API key not found. Please add GOOGLE_API_KEY to your .env file.');
        }

        const requestBody: GoogleTTSRequest = {
          contents: [{ 
            parts: [{ 
              text: `Pronounce in Castilian Spanish: ${spanishWord}` 
            }] 
          }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { 
                prebuiltVoiceConfig: { 
                  voiceName: "Kore"
                } 
              }
            }
          }
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`,
          {
            method: 'POST',
            headers: {
              'x-goog-api-key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          }
        );

        if (!response.ok) {
          throw new Error(`Google TTS API error: ${response.status} ${response.statusText}`);
        }

        const data: GoogleTTSResponse = await response.json();
        const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (!audioData) {
          throw new Error('No audio data received from Google TTS');
        }

        // Convert PCM to WAV for playback
        const pcmBuffer = Buffer.from(audioData, 'base64');
        const wavBuffer = this.pcmToWav(pcmBuffer, 24000, 1, 16);
        return `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
      });

      // Cache the result
      this.audioCache.set(cacheKey, audioUri);
      this.loadingWords.delete(cacheKey);
      logger.apiSuccess('TTS', 'generateSpeech', undefined, { 
        word: spanishWord,
        cacheSize: this.audioCache.size 
      });
      
      return createApiResponse<TTSResponse>({ audioUri });

    } catch (error: any) {
      this.loadingWords.delete(spanishWord.toLowerCase().trim());
      logger.apiError('TTS', 'generateSpeech', error, { word: spanishWord });
      
      const errorMessage = error.message?.includes('SERVICE_DISABLED') || error.status === 403
        ? 'Google TTS API not enabled. Check Google Cloud Console.'
        : error.message?.includes('API key')
        ? 'Invalid Google API key. Check your .env file.'
        : 'Failed to generate pronunciation. Please try again.';

      return createApiResponse<TTSResponse>(
        undefined,
        { message: errorMessage, code: 'TTS_ERROR' }
      );
    }
  }

  isAudioCached(spanishWord: string): boolean {
    return this.audioCache.has(spanishWord.toLowerCase().trim());
  }

  isGenerating(spanishWord: string): boolean {
    return this.loadingWords.has(spanishWord.toLowerCase().trim());
  }

  getCachedAudio(spanishWord: string): string | undefined {
    return this.audioCache.get(spanishWord.toLowerCase().trim());
  }

  forceResetWord(spanishWord: string): void {
    const cacheKey = spanishWord.toLowerCase().trim();
    this.loadingWords.delete(cacheKey);
  }

  clearCache(): void {
    this.audioCache.clear();
    this.loadingWords.clear();
  }

  getCacheSize(): number {
    return this.audioCache.size;
  }

  private clearStuckLoading(): void {
    // This could be enhanced with timestamps if needed, but the timeout approach is simpler
  }

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
}

export const textToSpeechApi = new TextToSpeechApi();
