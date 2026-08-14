import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MagneticButton } from "@/components/MagneticButton";
import { brand } from "@/data/brand";
import { useReveal } from "@/hooks/use-environment";
import { submitEnquiry } from "@/lib/enquiries.functions";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const send = useServerFn(submitEnquiry);
  const ref = useReveal<HTMLElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const result = await send({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          message: String(form.get("message") ?? ""),
        },
      });
      if (result.ok) {
        setStatus("sent");
        event.currentTarget.reset();
      } else {
        setStatus("error");
        setError(result.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError(`Something went wrong. Please email ${brand.email}.`);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="reveal relative border-t border-border bg-cream/70 py-[var(--section-space)]"
    >
      <div className="container-wyrd grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="micro">Contact</p>
          <h2 className="display-lg mt-6 max-w-[12ch]">Tell us what you&apos;re making.</h2>
          <div className="mt-12 space-y-6">
            <div className="rule-line pt-5">
              <p className="micro">Email</p>
              <a
                href={`mailto:${brand.email}`}
                className="mt-2 inline-block text-lg underline-offset-4 hover:underline"
              >
                {brand.email}
              </a>
            </div>
            <div className="rule-line pt-5">
              <p className="micro">Phone</p>
              <a
                href={`tel:${brand.phoneHref}`}
                className="mt-2 inline-block text-lg underline-offset-4 hover:underline"
              >
                {brand.phone}
              </a>
            </div>
            <div className="rule-line pt-5">
              <p className="micro">Studio</p>
              <p className="mt-2 text-lg">{brand.location}</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-6 md:col-start-7">
          <div className="space-y-8">
            <Field label="Your name" name="name" autoComplete="name" />
            <Field label="Email" name="email" type="email" autoComplete="email" />
            <div>
              <label htmlFor="message" className="micro">
                What would you like to make?
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                minLength={4}
                className="mt-3 w-full resize-none border-0 border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors duration-300 focus:border-foreground"
              />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <MagneticButton type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending" : "Send message"}
            </MagneticButton>
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {status === "sent" && "Thank you — we'll be in touch."}
              {status === "error" && error}
            </p>
          </div>
        </form>
      </div>

      <footer className="container-wyrd mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <p className="micro">
          © {new Date().getFullYear()} {brand.name}
        </p>
        <p className="micro">{brand.location}</p>
      </footer>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="micro">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-3 w-full border-0 border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors duration-300 focus:border-foreground"
      />
    </div>
  );
}
