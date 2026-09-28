"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import {
  EDITABLE_FIELDS,
  addNote,
  advanceStatus,
  assignRequest,
  editRequest,
  getRequestDetail,
  isRequestStatus,
  recordEvent,
  setFollowUp,
  setPayment,
  updateStatus,
  type RequestEdits,
} from "@/lib/admin/requests";
import { OPTION_CURRENCIES, createOption, deleteOption, moveOption, updateOption, type OptionInput } from "@/lib/admin/options";
import { deleteHospitalSend, isSendStatus, logHospitalSend, updateHospitalSend } from "@/lib/admin/hospital-sends";
import { deleteRequest } from "@/lib/admin/data";
import { MESSAGE_TEMPLATES } from "@/lib/admin/messages";
import { createPatientLink, revokePatientLinks } from "@/lib/patient-links";
import { sendEmail, textToHtml } from "@/lib/notifications/email";
import { getHospital } from "@/data/hospitals";
import { getCity } from "@/data/destinations";
import { isDate } from "@/components/admin/format";
import { cfEnv } from "@/lib/cloudflare";
import { siteConfig } from "@/lib/config";

const REFERENCE_RE = /^TV-[A-Z2-9]{8}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;

// Server actions are reachable by POST, so each one re-authenticates and
// validates its input.

async function guard(reference: string) {
  const user = await requireAdmin();
  if (!REFERENCE_RE.test(reference)) throw new Error("Invalid reference");
  return user;
}

function str(formData: FormData, name: string, max: number): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

function orNull(v: string): string | null {
  return v ? v : null;
}

function int(formData: FormData, name: string): number | null {
  const raw = str(formData, name, 20).replace(/[,\s]/g, "");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 && n < 1e10 ? Math.round(n) : null;
}

const revalidate = (reference: string) => revalidatePath(`${ADMIN_PATH}/requests/${reference}`);

export async function changeStatus(reference: string, formData: FormData) {
  const user = await guard(reference);
  const status = formData.get("status");
  if (!isRequestStatus(status)) return;
  await updateStatus(reference, status, user.email);
  revalidate(reference);
}

export async function saveNote(reference: string, formData: FormData) {
  const user = await guard(reference);
  const body = String(formData.get("note") ?? "").trim();
  if (!body || body.length > 4000) return;
  await addNote(reference, body, user.email);
  revalidate(reference);
}

export async function assign(reference: string, formData: FormData) {
  const user = await guard(reference);
  const raw = str(formData, "assignee", 200).toLowerCase();
  const assignee = raw === "me" ? user.email : raw;
  if (assignee && !EMAIL_RE.test(assignee)) return;
  await assignRequest(reference, assignee || null, user.email);
  revalidate(reference);
}

export async function followUp(reference: string, formData: FormData) {
  const user = await guard(reference);
  if (formData.get("clear")) {
    await setFollowUp(reference, null, "", user.email);
  } else {
    const date = str(formData, "date", 10);
    if (!isDate(date)) return;
    await setFollowUp(reference, date, str(formData, "note", 300), user.email);
  }
  revalidate(reference);
}

export async function payment(reference: string, formData: FormData) {
  const user = await guard(reference);
  await setPayment(reference, formData.get("paid") === "1", str(formData, "note", 200), user.email);
  revalidate(reference);
}

export async function editDetails(reference: string, formData: FormData) {
  const user = await guard(reference);
  const edits: RequestEdits = {};
  for (const f of EDITABLE_FIELDS) {
    if (!formData.has(f.id)) continue;
    const v = str(formData, f.id, 200);
    if (f.id === "age") {
      const age = Number(v);
      if (!/^\d{1,3}$/.test(v) || age > 120) return;
      edits.age = age;
    } else if (f.id === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return;
      edits.email = v;
    } else if (f.id === "full_name" || f.id === "whatsapp" || f.id === "country" || f.id === "treatment" || f.id === "destination") {
      if (!v) return;
      edits[f.id] = v;
    } else {
      edits[f.id] = orNull(v);
    }
  }
  await editRequest(reference, edits, user.email);
  revalidate(reference);
}

function parseOption(formData: FormData): OptionInput | null {
  const pick = str(formData, "hospital", 120);
  const listed = pick && pick !== "__custom" ? getHospital(pick) : undefined;
  const name = listed?.name ?? str(formData, "hospital_name", 160);
  if (!name) return null;
  const currency = str(formData, "currency", 3).toUpperCase();
  let costMin = int(formData, "cost_min");
  let costMax = int(formData, "cost_max");
  if (costMin != null && costMax != null && costMin > costMax) [costMin, costMax] = [costMax, costMin];
  const validUntil = str(formData, "valid_until", 10);
  return {
    hospital_slug: listed?.slug ?? null,
    hospital_name: name,
    city: listed ? getCity(listed.city).name : orNull(str(formData, "city", 80)),
    doctor: orNull(str(formData, "doctor", 200)),
    procedure_name: orNull(str(formData, "procedure_name", 200)),
    currency: (OPTION_CURRENCIES as readonly string[]).includes(currency) ? currency : "USD",
    cost_min: costMin,
    cost_max: costMax,
    hospital_days: orNull(str(formData, "hospital_days", 40)),
    total_days: orNull(str(formData, "total_days", 40)),
    inclusions: orNull(str(formData, "inclusions", 2000)),
    exclusions: orNull(str(formData, "exclusions", 2000)),
    notes: orNull(str(formData, "notes", 2000)),
    valid_until: isDate(validUntil) ? validUntil : null,
    recommended: formData.get("recommended") ? 1 : 0,
  };
}

export async function saveOption(reference: string, optionId: string | null, formData: FormData) {
  const user = await guard(reference);
  const input = parseOption(formData);
  if (!input) return;
  if (optionId) {
    if (!UUID_RE.test(optionId)) return;
    await updateOption(reference, optionId, input, user.email);
  } else {
    await createOption(reference, input, user.email);
  }
  revalidate(reference);
}

export async function removeOption(reference: string, optionId: string) {
  const user = await guard(reference);
  if (!UUID_RE.test(optionId)) return;
  await deleteOption(reference, optionId, user.email);
  revalidate(reference);
}

export async function reorderOption(reference: string, optionId: string, direction: -1 | 1) {
  await guard(reference);
  if (!UUID_RE.test(optionId) || (direction !== -1 && direction !== 1)) return;
  await moveOption(reference, optionId, direction);
  revalidate(reference);
}

export type ActionResult = { ok: boolean; message: string } | null;

export async function newPatientLink(reference: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await guard(reference);
  const days = Number(formData.get("days"));
  const url = await createPatientLink(reference, user.email, [7, 14, 30, 60].includes(days) ? days : 30);
  revalidate(reference);
  return url ? { ok: true, message: "New link created. Earlier links no longer work." } : { ok: false, message: "Links need the SESSION_SECRET Worker secret." };
}

export async function revokeLinks(reference: string) {
  const user = await guard(reference);
  await revokePatientLinks(reference, user.email);
  revalidate(reference);
}

/** Records a WhatsApp message the coordinator opened (the send happens in WhatsApp). */
export async function logWhatsApp(reference: string, templateId: string) {
  const user = await guard(reference);
  const template = MESSAGE_TEMPLATES.find((t) => t.id === templateId);
  await recordEvent(reference, "message", user.email, `WhatsApp opened: ${template?.label ?? "message"}`);
  if (templateId === "options_ready") await advanceStatus(reference, "options_sent", user.email);
  else await advanceStatus(reference, "contacted", user.email);
  revalidate(reference);
}

export async function sendPatientEmail(reference: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await guard(reference);
  const r = await getRequestDetail(reference);
  if (!r) return { ok: false, message: "Request not found." };
  const subject = str(formData, "subject", 200);
  const body = String(formData.get("body") ?? "").trim().slice(0, 8000);
  const templateId = str(formData, "template", 40);
  if (!subject || !body) return { ok: false, message: "Add a subject and a message." };

  const env = cfEnv();
  const from = String(env.PATIENT_EMAIL_FROM || "");
  if (!from) return { ok: false, message: "PATIENT_EMAIL_FROM isn't configured." };
  const result = await sendEmail({
    from: `${siteConfig.name} <${from}>`,
    to: [r.email],
    replyTo: String(env.PATIENT_EMAIL_REPLY_TO || "") || undefined,
    subject,
    text: body,
    html: textToHtml(body),
  });
  if (!result.ok) return { ok: false, message: result.error };

  await recordEvent(reference, "message", user.email, `Email sent: ${subject}\n\n${body}`);
  if (templateId === "options_ready") await advanceStatus(reference, "options_sent", user.email);
  else await advanceStatus(reference, "contacted", user.email);
  revalidate(reference);
  return { ok: true, message: `Email sent to ${r.email}.` };
}

export async function recordHospitalSend(reference: string, formData: FormData) {
  const user = await guard(reference);
  const pick = str(formData, "hospital", 120);
  const listed = pick && pick !== "__custom" ? getHospital(pick) : undefined;
  const name = listed?.name ?? str(formData, "hospital_name", 160);
  if (!name) return;
  await logHospitalSend(reference, { slug: listed?.slug ?? null, name }, str(formData, "note", 500), user.email);
  revalidate(reference);
}

export async function setHospitalSendStatus(reference: string, id: number, formData: FormData) {
  const user = await guard(reference);
  const status = formData.get("status");
  if (!Number.isInteger(id) || !isSendStatus(status)) return;
  await updateHospitalSend(reference, id, status, user.email);
  revalidate(reference);
}

export async function removeHospitalSend(reference: string, id: number) {
  const user = await guard(reference);
  if (!Number.isInteger(id)) return;
  await deleteHospitalSend(reference, id, user.email);
  revalidate(reference);
}

export async function eraseRequest(reference: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await guard(reference);
  if (str(formData, "confirm", 20).toUpperCase() !== reference) {
    return { ok: false, message: `Type ${reference} to confirm.` };
  }
  const deleted = await deleteRequest(reference, str(formData, "reason", 200), user.email);
  if (!deleted) return { ok: false, message: "Request not found." };
  revalidatePath(ADMIN_PATH);
  redirect(`${ADMIN_PATH}?deleted=${reference}`);
}
