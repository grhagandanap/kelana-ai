"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getConversations,
  createConversation,
  sendMessage,
  getMessages, // <-- new import
} from "@/services/chatService";
import type { Conversation, Message } from "@/types/chat";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false); // <-- new
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- new chat title modal (unchanged) ---
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => setError("Failed to load conversations."));
  }, []);

  // NEW: fetch messages whenever the active conversation changes
  useEffect(() => {
    if (activeId === null) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setMessagesLoading(true);
    setError(null);

    getMessages(activeId)
      .then((msgs) => {
        if (!cancelled) setMessages(msgs);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load messages.");
      })
      .finally(() => {
        if (!cancelled) setMessagesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function openTitleModal(pending?: string) {
    setTitleInput("");
    setPendingMessage(pending ?? null);
    setTitleModalOpen(true);
  }

  function closeTitleModal() {
    setTitleModalOpen(false);
    setPendingMessage(null);
    setTitleInput("");
  }

  async function confirmCreateConversation() {
    const title = titleInput.trim() || "New Conversation";

    try {
      const conversation = await createConversation({ title });
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(conversation.id);
      setMessages([]);
      setTitleModalOpen(false);

      // if this was triggered by "Send" with no active chat, deliver the message now
      if (pendingMessage) {
        await deliverMessage(conversation.id, pendingMessage);
        setPendingMessage(null);
      }
    } catch {
      setError("Failed to start a new conversation.");
    }
  }

  async function deliverMessage(conversationId: number, content: string) {
    const optimisticUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);
    setLoading(true);
    setError(null);

    try {
      const assistantMessage = await sendMessage(conversationId, { content });
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim()) return;
    const content = input;
    setInput("");

    if (!activeId) {
      // need a title first — stash the message and open the modal
      openTitleModal(content);
      return;
    }

    await deliverMessage(activeId, content);
  }

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-slate-950/60 p-4 flex flex-col gap-2">
        <button
          onClick={() => openTitleModal()}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition"
        >
          + New Chat
        </button>

        <div className="mt-4 flex flex-col gap-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`text-left rounded-lg px-3 py-2 text-sm truncate transition ${
                activeId === c.id
                  ? "bg-cyan-400/10 text-cyan-400"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {c.title || `Conversation #${c.id}`}
            </button>
          ))}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-slate-500 text-sm">
              Start the conversation — ask about a destination, budget, or
              itinerary.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "user" ? (
                <div className="max-w-lg rounded-2xl px-4 py-2 text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-medium">
                  {m.content}
                </div>
              ) : (
                <div className="max-w-lg rounded-2xl px-4 py-2 text-sm bg-white/5 text-slate-200 prose prose-invert prose-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-400">
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && <p className="px-6 pb-2 text-sm text-red-400">{error}</p>}

        <div className="border-t border-white/10 p-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-900 border border-white/10 px-4 py-2 text-slate-200 outline-none focus:border-cyan-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </main>

      {/* New chat title modal */}
      {titleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-slate-100">
              Name this chat
            </h2>
            <input
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && confirmCreateConversation()
              }
              placeholder="e.g. Japan trip ideas"
              className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-2 text-slate-200 outline-none focus:border-cyan-400"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeTitleModal}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 hover:text-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreateConversation}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
