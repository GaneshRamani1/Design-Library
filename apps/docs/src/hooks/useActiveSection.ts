import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const update = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 160
      ) {
        setActiveId(elements.at(-1)?.id ?? "");
        return;
      }
      const readingLine = window.innerHeight * 0.3;
      const current = elements
        .filter((element) => element.getBoundingClientRect().top <= readingLine)
        .at(-1);
      setActiveId(current?.id ?? elements[0]?.id ?? "");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids.join("|")]);

  return activeId;
}
