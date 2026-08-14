import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/use-environment";

const WyrdScene = lazy(() => import("@/three/WyrdScene"));

/**
 * Fixed environment behind the narrative. Scroll drives the structure's
 * assembly and dispersal; the cursor gently displaces the camera.
 */
export function SceneStage() {
  const progress = useRef(0);
  const pointer = useRef<[number, number]>([0, 0]);
  const wrap = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / (max * 0.62)) : 0;
      progress.current = p;
      if (wrap.current) wrap.current.style.opacity = String(Math.max(0, 1 - p * 1.15));
    };
    const onMove = (event: PointerEvent) => {
      if (!fine) return;
      pointer.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      ];
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [fine]);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
    >
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <WyrdScene progress={progress} pointer={pointer} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
