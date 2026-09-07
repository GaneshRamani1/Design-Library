import { useEffect, useRef, useState, type ReactNode } from "react";

export function ProgressiveSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const marker = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!marker.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(marker.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={marker}
      id={id}
      className="scroll-mt-24 border-t border-white/10 py-20"
    >
      {ready ? (
        children
      ) : (
        <div
          className="h-64 animate-pulse rounded-3xl bg-white/[.035]"
          aria-label="Loading section"
        />
      )}
    </section>
  );
}
