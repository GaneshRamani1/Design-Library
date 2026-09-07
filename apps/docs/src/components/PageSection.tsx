import type { ReactNode } from "react";

export function PageSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/10 py-14">
      <h2 className="mb-7 text-3xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
