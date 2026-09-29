import { LogoMark } from "@/components/ui/logo";
import { siteConfig } from "@/lib/config";

/** Letterhead for documents printed from the admin (comparison, case summary). */
export function PrintHeader({ title, meta }: { title: string; meta: string[] }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4 print:mb-4">
      <div className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[19px] font-semibold tracking-[-0.035em]">{siteConfig.name}</span>
      </div>
      <div className="text-right">
        <h1 className="m-0 font-serif text-[26px] leading-tight font-normal">{title}</h1>
        <p className="m-0 text-xs text-ink-subtle">{meta.join(" · ")}</p>
      </div>
    </header>
  );
}

export function PrintFooter() {
  const contact = [siteConfig.url.replace(/^https?:\/\//, ""), siteConfig.contactEmail].filter(Boolean).join(" · ");
  return <footer className="mt-6 border-t border-line pt-3 text-center text-[11px] text-ink-subtle print:mt-4">{contact}</footer>;
}
