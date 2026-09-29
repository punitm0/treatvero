import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authenticateAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { LogoMark } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | TreatVero" },
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

/**
 * Coordination-team admin. Protected by Cloudflare Access; each page and
 * action re-checks the Access token (lib/admin/auth.ts) before touching data.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await authenticateAdmin();
  if (!auth.ok && auth.reason === "unauthorized") notFound();

  return (
    <div className="min-h-dvh bg-canvas print:min-h-0 print:bg-white">
      <header className="border-b border-line bg-surface print:hidden">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 md:px-6">
          <Link href={ADMIN_PATH} className="flex items-center gap-2.5 text-ink no-underline">
            <LogoMark className="size-[18px]" dotClassName="top-[3px] right-[3px] size-1.5 bg-white" />
            <span className="text-sm font-medium">TreatVero admin</span>
          </Link>
          {auth.ok ? (
            <nav aria-label="Admin" className="ml-4 flex items-center gap-4 text-[13px] max-sm:ml-1 max-sm:gap-3">
              <Link href={ADMIN_PATH} className="text-ink-muted no-underline hover:text-ink">
                Enquiries
              </Link>
              <Link href={`${ADMIN_PATH}/insights`} className="text-ink-muted no-underline hover:text-ink">
                Insights
              </Link>
              <Link href={`${ADMIN_PATH}/data`} className="text-ink-muted no-underline hover:text-ink">
                Data
              </Link>
            </nav>
          ) : null}
          <div className="flex-1" />
          {auth.ok ? (
            <>
              <span className="truncate text-[13px] text-ink-subtle max-sm:hidden">{auth.user.email}</span>
              {/* Cloudflare Access's own logout endpoint */}
              <a href="/cdn-cgi/access/logout" className="text-[13px] text-ink-muted">
                Sign out
              </a>
            </>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8 print:max-w-none print:p-0">
        {auth.ok ? (
          children
        ) : (
          <div className="max-w-[560px] rounded-2xl border border-line bg-surface p-6">
            <h1 className="mb-2 text-lg font-medium">Admin access isn&apos;t configured</h1>
            <p className="m-0 text-sm text-ink-muted">
              Set <code>CF_ACCESS_TEAM_DOMAIN</code> and <code>CF_ACCESS_AUD</code> in <code>wrangler.jsonc</code> and
              redeploy. Until then the admin stays closed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
