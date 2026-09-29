import { isRequestStatus, isView, type RequestFilters } from "@/lib/admin/requests";
import { isDate } from "@/components/admin/format";
import { TREATMENT_OPTIONS } from "@/lib/validation/enquiry";

/** Enquiry list filters ⇄ URL search params (list page and CSV export share them). */

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

function get(sp: Params, key: string): string | undefined {
  const v = sp instanceof URLSearchParams ? sp.get(key) : sp[key];
  return typeof v === "string" && v ? v : undefined;
}

export function parseFilters(sp: Params, currentUser: string): RequestFilters {
  const status = get(sp, "status");
  const view = get(sp, "view");
  const plan = get(sp, "plan");
  const treatment = get(sp, "treatment");
  const from = get(sp, "from");
  const to = get(sp, "to");
  const owner = get(sp, "owner")?.toLowerCase();
  return {
    status: isRequestStatus(status) ? status : undefined,
    view: isView(view) ? view : undefined,
    query: get(sp, "q")?.slice(0, 100),
    treatment: treatment && (TREATMENT_OPTIONS as readonly string[]).includes(treatment) ? treatment : undefined,
    plan: plan === "basic" || plan === "concierge" ? plan : undefined,
    from: isDate(from) ? from : undefined,
    to: isDate(to) ? to : undefined,
    assignee: owner === "me" ? currentUser : owner && (owner === "none" || /^[^\s@]+@[^\s@]+$/.test(owner)) ? owner.slice(0, 200) : undefined,
  };
}

export function filtersToParams(f: RequestFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.status) sp.set("status", f.status);
  if (f.view) sp.set("view", f.view);
  if (f.query) sp.set("q", f.query);
  if (f.treatment) sp.set("treatment", f.treatment);
  if (f.plan) sp.set("plan", f.plan);
  if (f.from) sp.set("from", f.from);
  if (f.to) sp.set("to", f.to);
  if (f.assignee) sp.set("owner", f.assignee);
  return sp;
}
