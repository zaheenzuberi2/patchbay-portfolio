"use client";

import { motion, useReducedMotion } from "motion/react";
import { whatsappUrl } from "@/lib/site-config";

export function WhatsAppButton() {
  const reduced = useReducedMotion();

  return (
    // Floaty bob lives on this plain wrapper, not on the motion.a below.
    // motion.a already drives its own transform (entrance spring,
    // hover/tap scale) via inline style every frame; a CSS keyframe
    // animation targeting transform on that same element would fight it.
    // Splitting position+floaty (outer) from scale/opacity (inner) keeps
    // both animations independent, same reason Hero's portrait frame
    // floats its outer wrapper rather than the image itself.
    <div className="floaty fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Message on WhatsApp"
        initial={reduced ? undefined : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] sm:h-14 sm:w-14"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.02 3C9.4 3 4 8.37 4 14.98c0 2.23.62 4.32 1.7 6.12L4 29l8.1-1.66a12.9 12.9 0 0 0 3.92.6h.01c6.62 0 12.02-5.37 12.02-11.97C28.05 8.37 22.65 3 16.02 3Zm0 21.86h-.01a10.9 10.9 0 0 1-5.55-1.52l-.4-.24-4.8.98 1.02-4.66-.26-.42a9.86 9.86 0 0 1-1.53-5.28c0-5.46 4.46-9.9 9.94-9.9 2.66 0 5.15 1.03 7.02 2.9a9.83 9.83 0 0 1 2.9 7.02c0 5.46-4.47 9.92-9.33 9.92Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </motion.a>
    </div>
  );
}
