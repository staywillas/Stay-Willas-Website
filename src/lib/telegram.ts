/**
 * Modular Telegram Dispatcher for Stay Willas Operations
 *
 * When TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are provided in .env,
 * this automatically sends formatted photo alerts to your Telegram operations group.
 * If not configured, it safely logs to the server console without throwing errors.
 */

interface TelegramDispatchParams {
  role: "caretaker" | "chef" | "admin";
  staffName: string;
  villaName: string;
  category: string;
  notes?: string;
  imageBase64?: string;
  timestamp: string;
}

export async function dispatchTelegramCareAlert(params: TelegramDispatchParams): Promise<{ success: boolean; dispatched: boolean }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log("[Telegram] Bot token or Chat ID not configured. Stored locally in database.");
    return { success: true, dispatched: false };
  }

  const roleEmoji = params.role === "caretaker" ? "🧹" : params.role === "chef" ? "👨‍🍳" : "👑";
  const title = params.role === "caretaker" 
    ? "✅ VILLA READINESS PROOF SUBMITTED" 
    : "🍽️ MEAL SPREAD PROOF LOGGED";

  const caption = `
${roleEmoji} *${title}*
━━━━━━━━━━━━━━━━━━━━
🏡 *Property:* ${params.villaName}
📋 *Category:* ${params.category}
👤 *Submitted By:* ${params.staffName}
🕒 *Timestamp:* ${params.timestamp}
${params.notes ? `📝 *Notes:* _${params.notes}_\n` : ""}━━━━━━━━━━━━━━━━━━━━
✨ _Verified via care.staywillas.com_
`.trim();

  try {
    if (params.imageBase64 && params.imageBase64.startsWith("data:image")) {
      // Send photo as multipart FormData
      const base64Data = params.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", caption);
      formData.append("parse_mode", "Markdown");
      formData.append("photo", new Blob([buffer], { type: "image/jpeg" }), "proof.jpg");

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Telegram] API sendPhoto Error:", errorText);
        return { success: false, dispatched: false };
      }

      return { success: true, dispatched: true };
    } else {
      // Send text message
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: caption,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Telegram] API sendMessage Error:", errorText);
        return { success: false, dispatched: false };
      }

      return { success: true, dispatched: true };
    }
  } catch (error) {
    console.error("[Telegram] Dispatch Exception:", error);
    return { success: false, dispatched: false };
  }
}
