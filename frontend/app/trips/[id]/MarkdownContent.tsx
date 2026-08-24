"use client";

import ReactMarkdown from "react-markdown";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div
      className="
        text-slate-200 leading-relaxed
        [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold
        [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold
        [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold
        [&_p]:mb-3
        [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5
        [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5
        [&_li]:mb-1
        [&_strong]:font-semibold [&_strong]:text-white
        [&_a]:text-cyan-300 [&_a]:underline
      "
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}