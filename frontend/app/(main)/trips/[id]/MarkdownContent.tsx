function inlineFormat(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-cyan-300">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// A line like **Day 1: Arrival in Paris**
const DAY_RE = /^\*\*Day\s+\d+.*\*\*$/i;
// Short bold labels like **Morning:** / **Afternoon:** / **Evening:**
const TIME_LABEL_RE = /^\*\*(Morning|Afternoon|Evening|Night)[:.]?\*\*$/i;
// Stat lines like **Budget:** USD 10,000  or  **Total for Day 1:** USD 1,740
const STAT_RE = /^\*\*(Budget|Total(?: for Day \d+)?)\s*:?\*\*\s*:?\s*(.*)$/i;
// A whole line wrapped in bold, used as a fallback heading
const FULL_BOLD_RE = /^\*\*(.+)\*\*$/;

export default function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let sawTitle = false;

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={key} className="space-y-2">
          {listBuffer.map((item, i) => {
            const boldMatch = item.match(FULL_BOLD_RE);
            return (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-slate-900/40 px-4 py-2.5"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span
                  className={
                    boldMatch
                      ? "font-semibold text-white"
                      : "text-slate-300"
                  }
                >
                  {inlineFormat(boldMatch ? boldMatch[1] : item)}
                </span>
              </li>
            );
          })}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (line.length === 0) {
      flushList(`ul-${idx}`);
      return;
    }

    if (line.startsWith("### ")) {
      flushList(`ul-${idx}`);
      blocks.push(
        <h4 key={idx} className="mt-4 text-base font-semibold text-white">
          {inlineFormat(line.slice(4))}
        </h4>
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushList(`ul-${idx}`);
      blocks.push(
        <h3 key={idx} className="mt-6 text-lg font-semibold text-white">
          {inlineFormat(line.slice(3))}
        </h3>
      );
      return;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
      return;
    }

    // Day divider: **Day 1: Arrival in Paris**
    if (DAY_RE.test(line)) {
      flushList(`ul-${idx}`);
      const label = line.replace(/^\*\*|\*\*$/g, "");
      blocks.push(
        <div key={idx} className="mt-8 flex items-center gap-3 first:mt-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10">
            <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">{label}</h3>
        </div>
      );
      return;
    }

    // Time-of-day label: **Morning:**
    if (TIME_LABEL_RE.test(line)) {
      flushList(`ul-${idx}`);
      const label = line.replace(/^\*\*|\*\*$/g, "").replace(/:$/, "");
      blocks.push(
        <span
          key={idx}
          className="mt-4 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300"
        >
          {label}
        </span>
      );
      return;
    }

    // Stat line: **Budget:** USD 10,000 / **Total for Day 1:** USD 1,740
    const statMatch = line.match(STAT_RE);
    if (statMatch) {
      flushList(`ul-${idx}`);
      const [, label, value] = statMatch;
      blocks.push(
        <div
          key={idx}
          className="mt-3 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2.5"
        >
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-sm font-semibold text-cyan-300">{value}</span>
        </div>
      );
      return;
    }

    // Fallback: a whole line wrapped in bold — treat first one as the title, rest as sub-headings
    const fullBold = line.match(FULL_BOLD_RE);
    if (fullBold) {
      flushList(`ul-${idx}`);
      if (!sawTitle) {
        sawTitle = true;
        blocks.push(
          <h2 key={idx} className="text-xl font-semibold text-white">
            {fullBold[1]}
          </h2>
        );
      } else {
        blocks.push(
          <h4 key={idx} className="mt-5 text-base font-semibold text-white">
            {fullBold[1]}
          </h4>
        );
      }
      return;
    }

    // Plain paragraph
    flushList(`ul-${idx}`);
    blocks.push(
      <p key={idx} className="text-slate-300">
        {inlineFormat(line)}
      </p>
    );
  });
  flushList("ul-final");

  return <div className="space-y-2.5 leading-relaxed">{blocks}</div>;
}