import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const Input = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(4).max(4000),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("enquiries").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (error) return { ok: false as const, error: "We couldn't send that. Please email us directly." };
    return { ok: true as const };
  });
