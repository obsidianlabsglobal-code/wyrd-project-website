import { useState } from "react";
import { systemEdges, systemNodes } from "@/data/brand";
import { useReveal } from "@/hooks/use-environment";

const byId = Object.fromEntries(systemNodes.map((node) => [node.id, node]));

export function SystemMap() {
  const [activeId, setActiveId] = useState(systemNodes[0]!.id);
  const ref = useReveal<HTMLElement>();
  const active = byId[activeId]!;

  return (
    <section
      id="system"
      ref={ref}
      className="reveal relative border-y border-border bg-cream/70 py-[var(--section-space)]"
    >
      <div className="container-wyrd">
        <div className="grid gap-6 md:grid-cols-12">
          <p className="micro md:col-span-3">How it connects</p>
          <h2 className="display-md md:col-span-9 md:max-w-[22ch]">
            Idea, design, technology, people and outcome are one system — not five stages in a
            queue.
          </h2>
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                {systemEdges.map(([from, to]) => {
                  const a = byId[from]!;
                  const b = byId[to]!;
                  const isLive = activeId === from || activeId === to;
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="var(--foreground)"
                      strokeWidth={isLive ? 0.28 : 0.14}
                      opacity={isLive ? 0.55 : 0.18}
                      vectorEffect="non-scaling-stroke"
                      style={{ transition: "opacity 600ms var(--ease-wyrd)" }}
                    />
                  );
                })}
              </svg>

              <ul className="absolute inset-0">
                {systemNodes.map((node) => {
                  const isActive = node.id === activeId;
                  return (
                    <li
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <button
                        type="button"
                        data-cursor="Open"
                        onClick={() => setActiveId(node.id)}
                        onMouseEnter={() => setActiveId(node.id)}
                        onFocus={() => setActiveId(node.id)}
                        aria-pressed={isActive}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className="block rounded-full transition-all duration-700 ease-[var(--ease-wyrd)]"
                          style={{
                            width: isActive ? 26 : 12,
                            height: isActive ? 26 : 12,
                            background: isActive ? node.accent : "var(--foreground)",
                            boxShadow: isActive ? `0 0 0 8px color-mix(in oklab, ${node.accent} 25%, transparent)` : "none",
                          }}
                        />
                        <span
                          className="micro whitespace-nowrap transition-colors duration-500"
                          style={{ color: isActive ? "var(--foreground)" : undefined }}
                        >
                          {node.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5">
            <div
              key={active.id}
              className="rule-line pt-8"
              style={{ animation: "wyrd-fade 700ms var(--ease-wyrd) both" }}
            >
              <p className="micro" style={{ color: "var(--foreground)" }}>
                {active.label}
              </p>
              <p className="mt-5 font-[family-name:var(--font-display)] text-2xl leading-snug md:text-[1.9rem]">
                {active.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
