import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/use-environment";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "ink" | "outline";
};

/** Button with a tightly bounded magnetic pull (max 8px). */
export function MagneticButton({ children, className, variant = "ink", ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  const onMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!fine || reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const max = 8;
    ref.current.style.transform = `translate(${Math.max(-max, Math.min(max, dx * 0.25))}px, ${Math.max(-max, Math.min(max, dy * 0.25))}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-[background-color,color,transform,border-color] duration-500 ease-[var(--ease-wyrd)]",
        variant === "ink"
          ? "bg-foreground text-porcelain hover:bg-foreground/85"
          : "border border-border bg-transparent text-foreground hover:border-foreground",
        className,
      )}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-500 ease-[var(--ease-wyrd)] group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}
