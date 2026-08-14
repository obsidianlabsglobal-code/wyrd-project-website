import { useState } from "react";
import { domains } from "@/data/brand";
import { useReveal } from "@/hooks/use-environment";

export function Domains() {
  const [active, setActive] = useState(0);
  const ref = useReveal<HTMLElement>();

  return (
    <section id="domains" ref={ref} className="reveal relative py-[var(--section-space)]">
      <div className="container-wyrd">
        <div className="grid gap-6 md:grid-cols-12">
          <p className="micro md:col-span-3">Where the work sits</p>
          <h2 className="display-md md:col-span-9 md:max-w-[24ch]">
            WYRD is not simply a design agency, and not simply a software company. Four things are
            held in the same hand.
          </h2>
        </div>

        <ul className="mt-16 md:mt-24">
          {domains.map((domain, index) => {
            const isActive = active === index;
            return (
              <li key={domain.index}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-expanded={isActive}
                  className="rule-line group grid w-full grid-cols-12 items-start gap-4 py-7 text-left transition-colors duration-500 md:py-10"
                >
                  <span className="micro col-span-2 pt-2 md:col-span-1">{domain.index}</span>
                  <span
                    className="display-lg col-span-10 md:col-span-6"
                    style={{
                      color: isActive ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 42%, transparent)",
                      transition: "color 600ms var(--ease-wyrd)",
                    }}
                  >
                    {domain.title}
                  </span>
                  <span className="col-span-12 md:col-span-5">
                    <span
                      className="block text-[0.95rem] leading-relaxed text-muted-foreground transition-all duration-700 ease-[var(--ease-wyrd)] md:pt-3"
                      style={{ opacity: isActive ? 1 : 0.35 }}
                    >
                      {domain.note}
                    </span>
                    <span
                      aria-hidden
                      className="mt-5 block h-px origin-left transition-transform duration-700 ease-[var(--ease-wyrd)]"
                      style={{
                        background: domain.accent,
                        transform: `scaleX(${isActive ? 1 : 0})`,
                      }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
