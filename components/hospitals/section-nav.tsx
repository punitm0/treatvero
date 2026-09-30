/** Sticky in-page links for long pages; sections need a matching id and scroll margin. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  if (items.length < 3) return null;
  return (
    <nav
      aria-label="On this page"
      className="sticky top-[68px] z-30 mb-[clamp(32px,4vw,48px)] border-y border-line bg-canvas/95 backdrop-blur-[14px]"
    >
      <ul className="container-site m-0 flex list-none gap-1 overflow-x-auto py-2">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="block rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap text-ink-muted no-underline transition-colors hover:bg-hover hover:text-ink"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
