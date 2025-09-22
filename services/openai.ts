import OpenAI from 'openai';
import Constants from 'expo-constants';

// Get API key helper
const getApiKey = () => {
  return Constants.expoConfig?.extra?.openaiApiKey || 
         process.env.OPENAI_API_KEY || 
         Constants.manifest?.extra?.openaiApiKey;
};

// Lazy initialize client
let client: OpenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please check your .env file.');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'developer';
  content: string;
}

export interface OpenAIResponse {
  message: string;
  error?: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private conversationHistory: ChatMessage[] = [];

  private constructor() {
    // Initialize with system prompt for language learning
    this.conversationHistory = [
      {
        role: 'developer',
        content: `You are a friendly Spanish language learning teacher. Your role is to help users learn Spanish by blending Spanish words into English conversations.

        CRITICAL FORMATTING RULES:
        - Write primarily in English but mix in Spanish words naturally
        - EVERY SINGLE SPANISH WORD must be formatted as: <foreign>[spanish_word]==[english_translation]</foreign>
        - This includes greetings, exclamations, and ANY word in Spanish - NO EXCEPTIONS
        - Keep responses SHORT (1-3 sentences max)
        - Use 1-3 Spanish words per response maximum
        - Choose common, useful Spanish words that fit the context naturally

        EXAMPLES:
        User: "Hello, I want to learn Spanish"
        You: "<foreign>[¡Hola!]==[Hello!]</foreign> Welcome! I'm excited to help you learn <foreign>[español]==[Spanish]</foreign>. What would you like to start with?"

        User: "How do I say hello?"
        You: "Great question! You say <foreign>[hola]==[hello]</foreign>. Try using it in our <foreign>[conversación]==[conversation]</foreign>!"

        User: "I'm hungry"
        You: "Oh! You could say 'Tengo <foreign>[hambre]==[hunger]</foreign>' in Spanish. What do you like to <foreign>[comer]==[eat]</foreign>?"

        User: "Good morning"
        You: "Perfect! In Spanish that's <foreign>[buenos]==[good]</foreign> <foreign>[días]==[days]</foreign>. How did you <foreign>[dormir]==[sleep]</foreign>?"

        REMEMBER: Mark up EVERY Spanish word without exception, including ¡Hola!, ¿Cómo?, etc. Always be encouraging and focus on practical, everyday Spanish words!`
      }
    ];
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async sendMessage(userMessage: string): Promise<OpenAIResponse> {
    try {
      const openaiClient = getClient();

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage.trim()
      });

      // Generate response
      const chatResponse = await openaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: this.conversationHistory.map(msg => ({
          role: msg.role === 'developer' ? 'system' : msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        max_tokens: 300,
        temperature: 0.7,
      });
      
      const assistantMessage = chatResponse.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';


      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Manage conversation length (keep last 20 messages to prevent token overflow)
      if (this.conversationHistory.length > 21) { // 20 messages + 1 system message
        // Keep system message and last 20 messages
        this.conversationHistory = [
          this.conversationHistory[0], // System message
          ...this.conversationHistory.slice(-20)
        ];
      }

      return {
        message: assistantMessage
      };

    } catch (error: any) {
      console.error('OpenAI API Error:', error);

      // Simple error handling
      const errorMessage = error?.code === 'insufficient_quota' 
        ? 'API quota exceeded. Please check your billing.'
        : error?.code === 'invalid_api_key'
        ? 'Invalid API key. Please check your configuration.'
        : error?.code === 'rate_limit_exceeded'
        ? 'Too many requests. Please wait and try again.'
        : 'Sorry, something went wrong. Please try again.';

      return { message: '', error: errorMessage };
    }
  }

  public clearConversation(): void {
    // Reset to just the system message
    this.conversationHistory = [this.conversationHistory[0]];
  }

  public getConversationLength(): number {
    return this.conversationHistory.length - 1; // Exclude system message
  }
}

export default OpenAIService;
