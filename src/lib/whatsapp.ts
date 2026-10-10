/** Keep prefilled messages readable across WhatsApp clients and font support. */
export function cleanWhatsAppMessage(message: string): string {
  return message
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\uFE0F\u200D\u20E3\uFFFD]/gu, "")
    .replace(/[\t ]{2,}/g, " ")
    .replace(/^[\t ]+|[\t ]+$/gm, "")
    .trim();
}

export function encodeWhatsAppMessage(message: string): string {
  return encodeURIComponent(cleanWhatsAppMessage(message));
}
