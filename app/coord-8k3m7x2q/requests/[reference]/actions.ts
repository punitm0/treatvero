"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { addNote, isRequestStatus, updateStatus } from "@/lib/admin/requests";

const REFERENCE_RE = /^TV-[A-Z2-9]{8}$/;

// Server actions are reachable by POST, so each one re-authenticates.

export async function changeStatus(reference: string, formData: FormData) {
  const user = await requireAdmin();
  const status = formData.get("status");
  if (!REFERENCE_RE.test(reference) || !isRequestStatus(status)) return;
  await updateStatus(reference, status, user.email);
  revalidatePath(`${ADMIN_PATH}/requests/${reference}`);
}

export async function saveNote(reference: string, formData: FormData) {
  const user = await requireAdmin();
  const body = String(formData.get("note") ?? "").trim();
  if (!REFERENCE_RE.test(reference) || !body || body.length > 4000) return;
  await addNote(reference, body, user.email);
  revalidatePath(`${ADMIN_PATH}/requests/${reference}`);
}
