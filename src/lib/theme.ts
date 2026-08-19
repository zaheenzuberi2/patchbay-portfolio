export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "patchbay_theme";

// Runs synchronously, inline, as the first thing in <body> (see layout.tsx)
// so `data-theme` is set on <html> before the browser paints anything.
// Without this, the page would render with the default dark tokens for one
// frame and then visibly snap to light for a visitor who chose light last
// time — the classic theme-toggle flash. Written as a plain string, not a
// template literal referencing THEME_STORAGE_KEY, because this has to be
// valid standalone JS the moment the HTML parser reaches it, embedded via
// dangerouslySetInnerHTML; string-interpolating the constant in is safe here
// since it is a fixed literal we own, not user input.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`;

export function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

export function setStoredTheme(theme: Theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private browsing etc — the attribute is already set for this
    // pageview, it just will not persist to the next one.
  }
  // No React context: SiteBackgroundMount (the 3D wireframe, tuned for a
  // near-black canvas and hidden in light mode) needs to react to a toggle
  // click without being a descendant of whatever held the toggle's state,
  // and a plain DOM CustomEvent is a lot less wiring than threading a
  // provider through the root layout for one cross-cutting concern.
  window.dispatchEvent(new CustomEvent("patchbay:theme", { detail: theme }));
}
