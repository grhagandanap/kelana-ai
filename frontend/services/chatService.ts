import {
  Conversation,
  Message,
  CreateConversationPayload,
  CreateMessagePayload,
} from "@/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/conversation`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch conversations: ${res.status}`);
  }
  return res.json();
}

export async function createConversation(
  payload: CreateConversationPayload,
): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversation`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create conversation: ${res.status}`);
  }
  return res.json();
}

export async function sendMessage(
  conversationId: number,
  payload: CreateMessagePayload,
): Promise<Message> {
  const res = await fetch(
    `${API_URL}/conversation/${conversationId}/message`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status}`);
  }
  return res.json();
}

export async function getMessages(conversationId: number): Promise<Message[]> {
    const res = await fetch(
      `${API_URL}/conversation/${conversationId}/message`,
      {
        method: "GET",
        headers: authHeaders(),
      }
    );
  
    if (!res.ok) {
      throw new Error(`Failed to fetch messages: ${res.status}`);
    }
    return res.json();
  }