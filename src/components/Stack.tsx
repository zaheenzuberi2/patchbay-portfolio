import {
  siZapier,
  siMake,
  siReact,
  siLangchain,
  siWhatsapp,
  siN8n,
  siNextdotjs,
  siTypescript,
  siPostgresql,
  siNodedotjs,
} from "simple-icons";
import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";

// Every tool here is pulled from the real stack arrays in services.ts: no
// tool appears unless a service page already claims it. Real brand marks via
// simple-icons wherever one exists, rendered in each brand's own color (per
// icon .hex) so the logos read as recognizable marks rather than a single
// flat tone; a small number of tools genuinely have no icon in that catalog
// (Twilio, OpenAI, Vapi) and fall back to a plain text badge rather than a
// missing or fabricated logo.
const STACK: { name: string; path?: string; hex?: string }[] = [
  { name: "Twilio" },
  { name: "Vapi" },
  { name: "OpenAI" },
  { name: "Whisper" },
  { name: "LangChain", path: siLangchain.path, hex: siLangchain.hex },
  { name: "WhatsApp API", path: siWhatsapp.path, hex: siWhatsapp.hex },
  { name: "n8n", path: siN8n.path, hex: siN8n.hex },
  { name: "Zapier", path: siZapier.path, hex: siZapier.hex },
  { name: "Make", path: siMake.path, hex: siMake.hex },
  { name: "Next.js", path: siNextdotjs.path, hex: siNextdotjs.hex },
  { name: "TypeScript", path: siTypescript.path, hex: siTypescript.hex },
  { name: "PostgreSQL", path: siPostgresql.path, hex: siPostgresql.hex },
  { name: "React", path: siReact.path, hex: siReact.hex },
  { name: "Node", path: siNodedotjs.path, hex: siNodedotjs.hex },
];

export function Stack() {
  return (
    <section
      id="stack"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16"
    >
      <SectionGlow color={SECTION_ACCENTS.channels} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.15em] text-paper-dim">
            The stack behind it
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {STACK.map((tool) => (
              <span
                key={tool.name}
                className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-paper-dim transition-colors hover:border-signal/50 hover:text-paper"
              >
                {tool.path && (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0"
                    style={tool.hex ? { fill: `#${tool.hex}` } : undefined}
                  >
                    <path d={tool.path} />
                  </svg>
                )}
                {tool.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
