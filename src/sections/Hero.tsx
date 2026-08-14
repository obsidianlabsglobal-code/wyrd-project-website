import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import { brand } from "@/data/brand";

export function Hero() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  const step = (i: number) =>
    ({
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translate3d(0, 1.6rem, 0)",
      transition: `opacity 1.1s var(--ease-wyrd) ${i * 120}ms, transform 1.1s var(--ease-wyrd) ${i * 120}ms`,
    }) as const;

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32">
      <div className="container-wyrd">
        <p className="micro" style={step(0)}>
          {brand.type} — {brand.location}
        </p>

        <h1 className="display-xl mt-7 max-w-[16ch]" style={step(1)}>
          Design and technology,
          <span className="block italic text-muted-foreground">made as one thing.</span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="lede md:col-span-6" style={step(2)}>
            {brand.positioning}
          </p>

          <div className="flex flex-wrap items-center gap-4 md:col-span-6 md:justify-end" style={step(3)}>
            <a href="#contact" data-cursor="Talk">
              <MagneticButton type="button">Start a conversation</MagneticButton>
            </a>
            <a
              href="#domains"
              className="micro text-foreground/70 transition-colors hover:text-foreground"
            >
              Scroll to explore
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
