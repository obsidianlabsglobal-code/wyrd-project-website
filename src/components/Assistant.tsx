import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/assistant.functions";

type Message = { role: "user" | "assistant"; content: string };

const OPENING: Message = {
  role: "assistant",
  content:
    "Ask me about WYRD Designs — what the studio is, how it thinks, or how to get in touch. I only answer from the studio's own material.",
};

export function Assistant() {
  const ask = useServerFn(askAssistant);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([OPENING]);
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setValue("");
    setBusy(true);
    try {
      const result = await ask({
        data: { messages: next.filter((m) => m !== OPENING).slice(-12) },
      });
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            result.reply ||
            result.error ||
            "I don't have that information — please email hello@wyrddesigns.in.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "I couldn't reach the studio's assistant just now." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="wyrd-assistant"
        className="fixed bottom-5 right-5 z-[70] rounded-full border border-border bg-porcelain px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase shadow-[0_10px_40px_-20px_rgba(23,23,20,0.6)] transition-colors duration-300 hover:border-foreground md:bottom-8 md:right-8"
      >
        {open ? "Close" : "Ask WYRD"}
      </button>

      {open && (
      <div
        id="wyrd-assistant"
        ref={panelRef}
        role="dialog"
        aria-label="Ask WYRD"
        className="fixed bottom-20 right-4 z-[70] flex h-[min(70vh,32rem)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-porcelain shadow-[0_30px_80px_-40px_rgba(23,23,20,0.55)] md:bottom-24 md:right-8"
      >

        <div className="border-b border-border px-5 py-4">
          <p className="micro">Ask WYRD</p>
        </div>

        <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message, index) => (
            <p
              key={index}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[85%] rounded-lg bg-foreground px-4 py-2.5 text-sm leading-relaxed text-porcelain"
                  : "max-w-[92%] text-sm leading-relaxed text-muted-foreground"
              }
            >
              {message.content}
            </p>
          ))}
          {busy && <p className="micro">Thinking…</p>}
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-3 border-t border-border px-5 py-4">
          <label htmlFor="assistant-input" className="sr-only">
            Your question
          </label>
          <input
            id="assistant-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="What does WYRD do?"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <button type="submit" disabled={busy} className="micro text-foreground disabled:opacity-40">
            Send
          </button>
        </form>
      </div>
      )}

    </>
  );
}
