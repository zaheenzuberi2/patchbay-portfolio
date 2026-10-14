import type { VoiceNiche, VoiceNicheGroup } from "./types";
import { healthcareNiches } from "./healthcare";
import { homeServiceNiches } from "./home-services";
import { professionalNiches } from "./professional";

export type { VoiceNiche, VoiceNicheGroup };

export const voiceNiches: VoiceNiche[] = [
  ...healthcareNiches,
  ...homeServiceNiches,
  ...professionalNiches,
];

export const voiceNicheGroups: VoiceNicheGroup[] = [
  "Healthcare",
  "Home services",
  "Professional services",
  "Local business",
];

export function getVoiceNiche(slug: string) {
  return voiceNiches.find((n) => n.slug === slug);
}
