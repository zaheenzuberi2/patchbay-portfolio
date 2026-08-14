"use client";

import { useEffect, useRef } from "react";

// Two honestly different data sources feed this, worth being explicit
// about: while LISTENING, `analyser` is real microphone amplitude data (a
// genuine Web Audio AnalyserNode reading the mic stream). While SPEAKING,
// there is no equivalent — browsers do not expose any audio buffer or
// amplitude data for speechSynthesis output, full stop, so that state runs
// a procedural animation (layered sine waves with drifting phase/amplitude)
// that looks alive without pretending to be a real waveform of the actual
// speech. Idle is a slow, low, single ambient pulse.
export type VisualizerState = "idle" | "listening" | "speaking";

export function AudioVisualizer({
  state,
  analyser,
  className = "",
}: {
  state: VisualizerState;
  analyser?: AnalyserNode | null;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  const analyserRef = useRef(analyser);

  // Refs read inside the rAF loop below, kept in sync via effect (not
  // assigned during render) so the loop always sees the latest props
  // without needing to restart the whole canvas/rAF setup on every change.
  useEffect(() => {
    stateRef.current = state;
    analyserRef.current = analyser;
  }, [state, analyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      width = c.clientWidth;
      height = c.clientHeight;
      c.width = width * dpr;
      c.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const bins = new Uint8Array(64);
    let t = 0;
    const accentColor = "#ff5a1f";

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      if (!ctx || width === 0 || height === 0) return;
      t += 1;

      ctx.clearRect(0, 0, width, height);

      const mid = height / 2;
      const points = 48;
      const path: [number, number][] = [];

      const currentState = stateRef.current;
      const currentAnalyser = analyserRef.current;

      let energy = 0.12; // idle ambient level
      let useReal = false;

      if (currentState === "listening" && currentAnalyser) {
        currentAnalyser.getByteFrequencyData(bins);
        useReal = true;
      } else if (currentState === "speaking") {
        // Procedural "breathing" energy so speaking still visibly surges
        // and settles rather than sitting at one flat amplitude.
        energy = 0.55 + 0.35 * Math.sin(t * 0.09) * Math.sin(t * 0.031 + 1.3);
        energy = Math.max(0.25, energy);
      } else if (currentState === "listening") {
        // Mic granted but analyser not ready yet — gentle placeholder
        // motion instead of a dead flat line.
        energy = 0.2 + 0.08 * Math.sin(t * 0.15);
      }

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        let amp: number;

        if (useReal) {
          const bin = bins[Math.floor((i / points) * bins.length)] / 255;
          amp = 0.15 + bin * 0.85;
        } else {
          // Layered sine waves with drifting phase = organic, non-repeating
          // motion instead of an obviously looping animation.
          const phase = t * 0.05;
          const wobble =
            Math.sin(i * 0.5 + phase) * 0.5 +
            Math.sin(i * 0.23 - phase * 1.7) * 0.3 +
            Math.sin(i * 0.9 + phase * 0.6) * 0.2;
          amp = energy * (0.5 + 0.5 * wobble);
        }

        const y = mid - amp * mid * 0.92;
        path.push([x, y]);
      }

      ctx.beginPath();
      ctx.moveTo(path[0][0], mid);
      path.forEach(([x, y], i) => {
        if (i === 0) ctx.lineTo(x, y);
        else {
          const prev = path[i - 1];
          const cx = (prev[0] + x) / 2;
          const cy = (prev[1] + y) / 2;
          ctx.quadraticCurveTo(prev[0], prev[1], cx, cy);
        }
      });
      // Mirror below the midline for a symmetric organic band, filled with
      // a soft glow rather than a thin stroked line.
      for (let i = path.length - 1; i >= 0; i--) {
        const [x, y] = path[i];
        const mirroredY = mid + (mid - y);
        ctx.lineTo(x, mirroredY);
      }
      ctx.closePath();

      ctx.save();
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = currentState === "idle" ? 6 : 16;
      ctx.fillStyle =
        currentState === "idle"
          ? "rgba(255, 90, 31, 0.25)"
          : "rgba(255, 90, 31, 0.55)";
      ctx.fill();
      ctx.restore();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = accentColor;
      ctx.stroke();
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
