import Constants from 'expo-constants';
import { ApiResponse, ApiError } from '../../types';

// Get API keys helper
export const getApiKeys = () => ({
  openai: Constants.expoConfig?.extra?.openaiApiKey || 
          process.env.OPENAI_API_KEY || 
          Constants.manifest?.extra?.openaiApiKey,
  google: Constants.expoConfig?.extra?.googleApiKey || 
          Constants.manifest?.extra?.googleApiKey || 
          process.env.GOOGLE_API_KEY,
});

// Simple retry wrapper
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

// API response wrapper
export const createApiResponse = <T>(data?: T, error?: ApiError): ApiResponse<T> => ({
  data,
  error,
  success: !error,
});
