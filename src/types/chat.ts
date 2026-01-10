export interface Message {
  id: string;
  text?: string;
  content?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'general' | 'task' | 'idea' | 'strategy';
}

export interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
}
