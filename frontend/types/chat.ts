export type MessageRole = "user" | "assistant";

export interface Message {
  id: number;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string | null;
  created_at: string;
}

export interface CreateConversationPayload {
  title: string;
}

export interface CreateMessagePayload {
  content: string;
}