// Caps for the voice widget. Session length is enforced by Google: the token
// minted in /api/assistant/live expires at this time and the connection closes.
// The widget only reads it to show the visitor what is happening.
export const VOICE_MAX_SESSION_MS = 3 * 60 * 1000;
// New voice sessions per IP per hour (in-memory, per serverless instance).
export const VOICE_SESSIONS_PER_HOUR = 4;

export const VOICE_CAP_MESSAGES = {
  time:
    "That is the time limit for this demo conversation. For anything more, message Zaheen on WhatsApp or send an email, and he will pick it up from there.",
  busy:
    "The voice demo has had a lot of use from your connection in the last hour. Please try again later, or message Zaheen on WhatsApp.",
  down:
    "The voice assistant is not available right now. Please message Zaheen on WhatsApp and he will reply.",
} as const;

export type VoiceCapReason = keyof typeof VOICE_CAP_MESSAGES;

export const VOICE_CAP_MESSAGES_UR = {
  time:
    "اس ڈیمو گفتگو کی وقت کی حد پوری ہو گئی ہے۔ مزید بات کے لیے واٹس ایپ پر ظہین کو میسج کریں یا ای میل بھیجیں، وہ آپ سے رابطہ کریں گے۔",
  busy:
    "آپ کے کنکشن سے پچھلے ایک گھنٹے میں ڈیمو بہت زیادہ استعمال ہوا ہے۔ براہ کرم بعد میں کوشش کریں یا واٹس ایپ پر ظہین کو میسج کریں۔",
  down:
    "وائس اسسٹنٹ اس وقت دستیاب نہیں۔ براہ کرم واٹس ایپ پر ظہین کو میسج کریں۔",
} as const;
