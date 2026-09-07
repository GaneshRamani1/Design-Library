import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { componentCatalog } from "../pages/catalog";
import { GlobalSearch } from "../components";

const rootOrder = [
  "Layout",
  "Inputs",
  "Navigation",
  "Overlays",
  "Actions",
  "Data display",
  "Feedback",
];
const componentGroups = componentCatalog.reduce<
  Record<string, typeof componentCatalog>
>((groups, component) => {
  (groups[component.category] ??= []).push(component);
  return groups;
}, {});
const navigation = [
  { label: "Welcome", items: [{ slug: "", title: "Overview", path: "/" }] },
  {
    label: "Foundations",
    items: [
      {
        slug: "installation",
        title: "Installation",
        path: "/foundations/installation",
      },
      { slug: "tokens", title: "Tokens", path: "/foundations/tokens" },
      {
        slug: "status",
        title: "Component status",
        path: "/foundations/status",
      },
    ],
  },
  ...rootOrder.map((label) => ({
    label,
    items: (componentGroups[label] ?? [])
      .sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { numeric: true }),
      )
      .map((item) => ({ ...item, path: `/components/${item.slug}` })),
  })),
];

export function DocsLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="docs-shell min-h-screen text-zinc-300">
      <header className="docs-chrome fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b px-4 backdrop-blur-xl md:px-6">
        <button
          className="mr-3 rounded-lg p-2 text-zinc-400 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <NavLink
          to="/"
          className="flex items-center gap-3 font-semibold text-white"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-white text-black">
            A
          </span>
          Arcwell UI
        </NavLink>
        <span className="ml-3 hidden rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-500 sm:inline">
          Documentation
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <a
            className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black"
            href="https://github.com/"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {menuOpen && (
        <button
          className="fixed inset-0 top-16 z-30 bg-black/60 md:hidden"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} docs-sidebar fixed bottom-0 left-0 top-16 z-40 w-72 overflow-y-auto border-r p-5 transition-transform md:translate-x-0`}
      >
        <GlobalSearch />
        <nav className="mt-8 space-y-7">
          {navigation.map((group) => (
            <section key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[.18em] text-zinc-600">
                {group.label}
              </p>
              {group.label === "Foundations" && (
                <p className="mb-1 mt-3 px-3 text-xs font-medium text-zinc-500">
                  Getting started
                </p>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={`${group.label}-${item.slug}`}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `mt-1 block rounded-xl px-3 py-2.5 text-sm transition ${group.label === "Foundations" ? "ml-2" : ""} ${isActive ? "bg-white/10 font-medium text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 overflow-x-clip pt-16 md:pl-72">
        <Outlet />
      </main>
    </div>
  );
}
