import OpenAI from 'openai';
import { getApiKeys, withRetry, createApiResponse } from './client';
import { ChatMessage, OpenAIResponse, ApiResponse } from '../../types';
import { logger } from '../utils/logger';

class OpenAIApi {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      const { openai: apiKey } = getApiKeys();
      if (!apiKey) {
        logger.error('OpenAI', 'API key not found');
        throw new Error('OpenAI API key not found. Please check your .env file.');
      }
      logger.info('OpenAI', 'Client initialized');
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  async sendMessage(
    conversationHistory: ChatMessage[]
  ): Promise<ApiResponse<OpenAIResponse>> {
    const startTime = Date.now();
    logger.apiCall('OpenAI', 'sendMessage', undefined, { 
      messageCount: conversationHistory.length,
      model: 'gpt-4.1-mini'
    });
    
    try {
      const response = await withRetry(async () => {
        const client = this.getClient();
        
        // Use Chat Completions with GPT-4.1 for fast, non-reasoning responses
        const chatResponse = await client.chat.completions.create({
          model: 'gpt-4.1',
          messages: conversationHistory.map(msg => ({
            role: msg.role === 'developer' ? 'system' : msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          temperature: 0.1, // Now supported on 4.1 family
          max_tokens: 300, // Use max_tokens for non-reasoning models
          stream: false,
        });
        
        return chatResponse.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
      });

      const duration = Date.now() - startTime;
      logger.apiSuccess('OpenAI', 'sendMessage', duration, { 
        responseLength: response.length 
      });

      return createApiResponse<OpenAIResponse>({ message: response });
      
    } catch (error: any) {
      logger.apiError('OpenAI', 'sendMessage', error, { 
        errorCode: error?.code,
        errorType: error?.type 
      });
      
      // Handle specific OpenAI errors
      const errorMessage = error?.code === 'insufficient_quota' 
        ? 'API quota exceeded. Please check your billing.'
        : error?.code === 'invalid_api_key'
        ? 'Invalid API key. Please check your configuration.'
        : error?.code === 'rate_limit_exceeded'
        ? 'Too many requests. Please wait and try again.'
        : 'Sorry, something went wrong. Please try again.';

      return createApiResponse<OpenAIResponse>(
        undefined, 
        { message: errorMessage, code: error?.code || 'OPENAI_ERROR' }
      );
    }
  }
}

export const openaiApi = new OpenAIApi();
