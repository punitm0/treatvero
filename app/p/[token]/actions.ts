"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { clientKey, getRateLimiter } from "@/lib/rate-limit";
import { recordPatientReply, recordPatientView, resolvePatientLink } from "@/lib/patient-links";
import { listOptions } from "@/lib/admin/options";
import { notifyPatientActivity } from "@/lib/notifications/patient-activity";

type Result = { ok: boolean; message: string } | null;

/** Called once the page has rendered in a real browser (link-preview bots don't run scripts). */
export async function markViewed(token: string): Promise<void> {
  const link = await resolvePatientLink(token);
  if (link) await recordPatientView(link);
}

export async function submitReply(token: string, _prev: Result, formData: FormData): Promise<Result> {
  const limited = await getRateLimiter("enquiry").limit(clientKey(await headers()));
  if (!limited.success) return { ok: false, message: "Please wait a minute and try again." };
  const link = await resolvePatientLink(token);
  if (!link) return { ok: false, message: "This link has expired. Please ask your coordinator for a new one." };

  const choice = String(formData.get("choice") ?? "");
  const message = String(formData.get("message") ?? "").trim().slice(0, 1000);
  const options = await listOptions(link.reference);
  const index = options.findIndex((o) => o.id === choice);
  let summary: string;
  if (choice === "call") summary = "Patient would like a call";
  else if (index !== -1) summary = `Patient chose Option ${String.fromCharCode(65 + index)} — ${options[index].hospital_name}`;
  else if (message) summary = "Patient sent a message";
  else return { ok: false, message: "Choose an option or write a message." };

  await recordPatientReply(link, index !== -1 || choice === "call" ? choice : "", message, summary);
  notifyPatientActivity(link.reference, "replied on their options page", `patient-reply/${link.id}/${Date.now()}`);
  revalidatePath(`/p/${token}`);
  return { ok: true, message: "Thank you — your coordinator has been notified and will be in touch shortly." };
}
