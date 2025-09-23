import { create } from 'zustand';
import { ChatMessage, Message } from '../../types';

interface ChatState {
  conversationHistory: ChatMessage[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearConversation: () => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
      conversationHistory: [
        {
          role: 'developer',
          content: `You are a Spanish teacher. Chat in English but include Spanish words naturally.

CRITICAL: Format EVERY Spanish word as: <foreign>[spanish_word]==[english_translation]</foreign>

Examples:
User: "Hello"
You: "<foreign>[¡Hola!]==[Hello!]</foreign> How can I help you learn <foreign>[español]==[Spanish]</foreign>?"

User: "How is the dog?"
You: "You say <foreign>[¿cómo]==[how]</foreign> <foreign>[está]==[is]</foreign> <foreign>[el]==[the]</foreign> <foreign>[perro?]==[dog?]</foreign>"

RULES:
- Each Spanish word gets its own tag
- Include ALL Spanish words (articles, verbs, nouns)
- Keep responses 1-2 sentences
- Use 1-3 Spanish words maximum`
        }
      ],
      messages: [
        {
          id: '1',
          text: '<foreign>[¡Hola!]==[Hello!]</foreign> I\'m your AI <foreign>[profesor]==[teacher]</foreign>. I\'m here to help you learn <foreign>[español]==[Spanish]</foreign> through natural conversation. What would you like to work on today?',
          timestamp: new Date(),
          isUser: false,
          status: 'sent'
        }
      ],
      isLoading: false,
      error: null,
      
      addMessage: (message: Message) => {
        set(state => ({
          messages: [...state.messages, message]
        }));
      },
      
      updateMessage: (id: string, updates: Partial<Message>) => {
        set(state => ({
          messages: state.messages.map(msg => 
            msg.id === id ? { ...msg, ...updates } : msg
          )
        }));
      },
      
      addChatMessage: (message: ChatMessage) => {
        set(state => {
          const newHistory = [...state.conversationHistory, message];
          
          // Manage conversation length (keep last 20 messages + system message)
          if (newHistory.length > 21) {
            return {
              conversationHistory: [
                newHistory[0], // Keep system message
                ...newHistory.slice(-20)
              ]
            };
          }
          
          return { conversationHistory: newHistory };
        });
      },
      
      clearConversation: () => {
        const systemMessage = get().conversationHistory[0];
        set({
          conversationHistory: [systemMessage],
          messages: [get().messages[0]] // Keep initial AI message
        });
      },
      
      clearMessages: () => {
        set({
          messages: [get().messages[0]] // Keep initial AI message
        });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
    }));
