"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getConversations,
  createConversation,
  sendMessage,
  getMessages,
} from "@/services/chatService";
import type { Conversation, Message } from "@/types/chat";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // tracks whether the next scroll should be instant (first open) or smooth (new message)
  const isFirstLoadRef = useRef(true);

  // --- new chat title modal ---
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => setError("Failed to load conversations."));
  }, []);

  // fetch messages whenever the active conversation changes
  useEffect(() => {
    if (activeId === null) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setMessagesLoading(true);
    setError(null);
    isFirstLoadRef.current = true; // next scroll for this conversation should be instant

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

  // auto-scroll: instant on first open of a conversation, smooth for new messages after that
  useEffect(() => {
    if (messages.length === 0) return;

    bottomRef.current?.scrollIntoView({
      behavior: isFirstLoadRef.current ? "auto" : "smooth",
    });
    isFirstLoadRef.current = false;
  }, [messages]);

  // also scroll while the assistant is "typing"
  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

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
      setTitleModalOpen(false);

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
      <main className="flex-1 flex flex-col min-w-0">
        {/* Conversation title header */}
        <div className="border-b border-white/10 px-6 py-3">
          <h1 className="truncate text-sm font-bold text-slate-100">
            {activeConversation
              ? activeConversation.title || `Conversation #${activeConversation.id}`
              : "Select or start a conversation"}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messagesLoading && (
            <p className="text-slate-500 text-sm">Loading conversation...</p>
          )}

          {!messagesLoading && messages.length === 0 && (
            <p className="text-slate-500 text-sm">
              Start the conversation — ask about a destination, budget, or
              itinerary.
            </p>
          )}

          {!messagesLoading &&
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "user" ? (
                  <div className="flex max-w-lg flex-col items-end gap-1">
                    <div className="rounded-2xl px-4 py-2.5 text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-medium">
                      {m.content}
                    </div>
                    <span className="px-1 text-[11px] text-slate-500">
                      {formatTimestamp(m.created_at)}
                    </span>
                  </div>
                ) : (
                  <div className="flex max-w-2xl gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-xs font-bold text-slate-950">
                      K
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-slate-200">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="mb-2 mt-4 text-base font-bold text-cyan-400 first:mt-0">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mb-2 mt-4 text-base font-bold text-cyan-400 first:mt-0">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-1.5 mt-3 text-sm font-bold text-cyan-300 first:mt-0">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">{children}</p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-slate-50">
                                {children}
                              </strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-3 ml-4 list-disc space-y-1.5 last:mb-0">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-3 ml-4 list-decimal space-y-1.5 last:mb-0">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="pl-1 marker:text-cyan-400">
                                {children}
                              </li>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-300">
                                {children}
                              </code>
                            ),
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                              >
                                {children}
                              </a>
                            ),
                            hr: () => <hr className="my-4 border-white/10" />,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                      <span className="px-1 text-[11px] text-slate-500">
                        {formatTimestamp(m.created_at)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-2xl gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-xs font-bold text-slate-950">
                  K
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
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
