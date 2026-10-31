// Caps for the voice widget. Enforced on the server (voice-session.ts and
// /api/assistant); the UI only reads these to show the visitor what is left.
export const VOICE_MAX_SESSION_MS = 3 * 60 * 1000;
export const VOICE_MAX_TURNS = 8;
// New voice sessions per IP per hour, on top of the general request limit.
export const VOICE_SESSIONS_PER_HOUR = 4;

export const VOICE_CAP_MESSAGES = {
  turns:
    "That is the limit for this demo conversation. For anything more, message Zaheen on WhatsApp or send an email, and he will pick it up from there.",
  time:
    "That is the time limit for this demo conversation. For anything more, message Zaheen on WhatsApp or send an email, and he will pick it up from there.",
  busy:
    "The voice demo has had a lot of use from your connection in the last hour. Please try again later, or message Zaheen on WhatsApp.",
} as const;

export type VoiceCapReason = keyof typeof VOICE_CAP_MESSAGES;
