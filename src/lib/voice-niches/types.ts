export type VoiceNicheGroup =
  | "Healthcare"
  | "Home services"
  | "Professional services"
  | "Local business";

export type VoiceNiche = {
  slug: string;
  /** Plural label used in titles and headings, e.g. "Dentists". */
  plural: string;
  /** What the business is called in running prose, e.g. "dental practice". */
  noun: string;
  group: VoiceNicheGroup;
  /** Kept short: the layout template appends " | Patchbay". */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Why the phone matters specifically in this niche. */
  why: string;
  /** Inbound call types the agent handles. */
  inbound: string[];
  /** Outbound call jobs, only ever to consented contacts. */
  outbound: string[];
  /** What the agent collects before anything reaches a human. */
  intake: string[];
  /** When the call goes to a person immediately. */
  handoff: string[];
  /** Systems the agent is typically wired into. */
  tools: string;
  /** A niche-specific limit or caution, stated plainly. */
  watch: string;
  faqs: { q: string; a: string }[];
  related: string[];
};
