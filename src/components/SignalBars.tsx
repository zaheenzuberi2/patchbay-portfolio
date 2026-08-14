const BAR_DELAYS = [0, 0.12, 0.24, 0.08, 0.32, 0.18, 0.04, 0.28, 0.14, 0.22];

export function SignalBars({
  count = 10,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const bars = BAR_DELAYS.slice(0, count);
  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {bars.map((delay, i) => (
        <span
          key={i}
          className="signal-bar w-[3px] rounded-full bg-signal"
          style={{
            height: "100%",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
