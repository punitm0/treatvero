export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi TreatVero, I'm looking for medical treatment abroad and would like help understanding my options.";

/**
 * Builds a wa.me link. The recipient comes only from NEXT_PUBLIC_WHATSAPP_NUMBER;
 * when it isn't configured the link opens WhatsApp with the message and lets
 * the user pick a chat, so no personal number is ever hardcoded.
 *
 * Never pass medical details in `message` — it ends up in a URL.
 */
export function whatsappUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

export const isWhatsAppConfigured = Boolean(
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
);
