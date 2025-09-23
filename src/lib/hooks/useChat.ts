import { useChatStore } from '../stores';
import { openaiApi } from '../api';
import { useVocabulary } from './useVocabulary';
import { logger } from '../utils/logger';

export const useChat = () => {
  const messages = useChatStore((state) => state.messages);
  const conversationHistory = useChatStore((state) => state.conversationHistory);
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const clearConversation = useChatStore((state) => state.clearConversation);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const setLoading = useChatStore((state) => state.setLoading);
  const setError = useChatStore((state) => state.setError);
  
  const { processMessage } = useVocabulary();
  
  const sendMessage = async (userMessage: string) => {
    logger.userAction('Chat', 'sendMessage', { 
      messageLength: userMessage.length,
      conversationLength: conversationHistory.length 
    });
    
    setLoading(true);
    setError(null);
    
    try {
      // Create updated conversation history with the new user message
      const updatedHistory = [
        ...conversationHistory,
        {
          role: 'user' as const,
          content: userMessage.trim()
        }
      ];
      
      // Send message to OpenAI with updated history
      const response = await openaiApi.sendMessage(updatedHistory);
      
      if (response.success && response.data) {
        // Add user message to conversation history
        addChatMessage({
          role: 'user',
          content: userMessage.trim()
        });
        
        // Add assistant response to conversation history
        addChatMessage({
          role: 'assistant',
          content: response.data.message
        });
        
        // Process vocabulary from the response
        processMessage(response.data.message);
        
        logger.info('Chat', 'Message sent successfully', {
          responseLength: response.data.message.length
        });
        
        return response.data;
      } else {
        logger.warn('Chat', 'Message failed', { error: response.error?.message });
        setError(response.error?.message || 'Failed to send message');
        return { message: '', error: response.error?.message };
      }
    } catch (error: any) {
      const errorMessage = 'Sorry, something went wrong. Please try again.';
      logger.error('Chat', 'Unexpected error in sendMessage', error as Error);
      setError(errorMessage);
      return { message: '', error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    messages,
    conversationHistory,
    isLoading,
    error,
    sendMessage,
    addMessage,
    updateMessage,
    clearConversation,
    clearMessages,
  };
};
