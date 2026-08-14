export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 font-mono text-[11px] uppercase tracking-[0.1em] text-paper-dim">
        <span>
          &copy; {new Date().getFullYear()} Patchbay, Zaheen Zuberi,
          Islamabad, PK
        </span>
        <span className="flex items-center gap-2">
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
          All systems online
        </span>
      </div>
    </footer>
  );
}
