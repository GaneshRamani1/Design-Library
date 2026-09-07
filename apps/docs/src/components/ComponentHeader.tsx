interface Props {
  category: string;
  title: string;
  description: string;
  selector: string;
}

export function ComponentHeader({
  category,
  title,
  description,
  selector,
}: Props) {
  return (
    <header className="py-14 sm:py-16 md:py-24">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-zinc-500">
        {category} / {title}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl md:text-7xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
        {description}
      </p>
      <code className="mt-6 inline-block max-w-full overflow-x-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-emerald-300">
        {selector}
      </code>
    </header>
  );
}
