import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/use-environment";

/**
 * Desktop-only cursor. A small ink dot with a trailing ring that grows over
 * interactive elements and can carry a short contextual label.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [data-cursor]",
      );
      const ringEl = ring.current;
      const labelEl = label.current;
      if (!ringEl || !labelEl) return;
      const text = target?.dataset["cursor"];
      ringEl.dataset["active"] = target ? "true" : "false";
      labelEl.textContent = text ?? "";
      labelEl.style.opacity = text ? "1" : "0";
    };

    const loop = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={dot}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-foreground"
      />
      <div
        ref={ring}
        data-active="false"
        className="absolute -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 transition-[width,height,margin,background-color,border-color] duration-300 ease-[var(--ease-wyrd)] data-[active=true]:-ml-8 data-[active=true]:-mt-8 data-[active=true]:h-16 data-[active=true]:w-16 data-[active=true]:border-foreground/60 data-[active=true]:bg-foreground/5"
      >
        <span
          ref={label}
          className="micro text-[9px] text-foreground opacity-0 transition-opacity duration-200"
        />
      </div>
    </div>
  );
}
