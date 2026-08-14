import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { assistantKnowledge } from "@/data/brand";

const Input = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(24),
});

const SYSTEM = `You are the assistant on the WYRD Designs website.

You may ONLY use the facts below. If a visitor asks anything not covered — clients, pricing, team members, case studies, timelines, awards, history — say plainly that you don't have that information, and point them to ${"hello@wyrddesigns.in"}.

Never invent facts. Never speculate. Keep answers to two or three short sentences, calm and precise, no marketing language, no emoji, no markdown headings.

FACTS:
${assistantKnowledge}`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Assistant is not configured.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway("google/gemini-3.5-flash"),
        system: SYSTEM,
        messages: data.messages,
        temperature: 0.2,
      });
      return { reply: (await result.text).trim() };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("429")) {
        return { reply: "", error: "The assistant is busy right now — please try again shortly." };
      }
      if (message.includes("402")) {
        return { reply: "", error: "The assistant is temporarily unavailable." };
      }
      return { reply: "", error: "Something went wrong. Please email hello@wyrddesigns.in." };
    }
  });
