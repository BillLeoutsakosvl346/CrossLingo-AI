export interface ChatMessage {
  role: 'user' | 'assistant' | 'developer';
  content: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  status?: 'sending' | 'sent' | 'failed';
  isError?: boolean;
}

export interface OpenAIResponse {
  message: string;
  error?: string;
}
