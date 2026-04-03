import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ─── COLORS ───
const C = {
  bg: "#050A18",
  blue: "#3B82F6",
  card: "#0C1225",
  border: "#1A2547",
  text: "#F9FAFB",
  muted: "#64748B",
  green: "#10B981",
  yellow: "#F59E0B",
};

// ─── HELPERS ───
const fadeIn = (frame, start, dur) =>
  interpolate(frame, [start, start + dur], [0, 1], { extrapolateRight: "clamp" });

const slideUp = (frame, start, dur, dist = 60) =>
  interpolate(frame, [start, start + dur], [dist, 0], { extrapolateRight: "clamp" });

const scaleIn = (frame, fps, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

// ─── GLITCH TEXT ───
const GlitchText = ({ text, frame }) => {
  const glitchActive = frame % 4 < 2 && frame < 20;
  const opacity = fadeIn(frame, 0, 8);
  return (
    <div
      style={{
        fontSize: 72,
        fontWeight: 900,
        color: C.text,
        textAlign: "center",
        opacity,
        transform: glitchActive
          ? `translate(${Math.random() * 6 - 3}px, ${Math.random() * 4 - 2}px)`
          : "none",
        textShadow: glitchActive
          ? `3px 0 ${C.blue}, -3px 0 #ff0040`
          : `0 0 40px rgba(59,130,246,0.3)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "0 60px",
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
};

// ─── SCENE 1: HOOK (0s-3s = frames 0-90) ───
const SceneHook = () => {
  const frame = useCurrentFrame();
  const betterOpacity = fadeIn(frame, 50, 15);
  const betterY = slideUp(frame, 50, 15);
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <GlitchText text="Ancora Excel e WhatsApp?" frame={frame} />
      <div
        style={{
          marginTop: 60,
          fontSize: 36,
          color: C.blue,
          fontWeight: 700,
          opacity: betterOpacity,
          transform: `translateY(${betterY}px)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        C'e un modo migliore.
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: REVEAL (3s-6s = frames 90-180) ───
const SceneReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = scaleIn(frame, fps, 5);
  const textOp = fadeIn(frame, 20, 12);
  const textY = slideUp(frame, 20, 12);
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 800, height: 500, background: C.card, borderRadius: 20,
          border: `2px solid ${C.border}`,
          transform: `scale(${s}) perspective(1200px) rotateY(-5deg)`,
          boxShadow: `0 40px 100px rgba(59,130,246,0.15)`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div style={{ height: 36, background: "#0a0f1e", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div style={{ flex: 1, textAlign: "center", fontSize: 13, color: C.muted }}>personaltrainerboard.com</div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.blue, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 36, fontWeight: 900, color: "#fff", fontFamily: "system-ui" }}>PT</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 300, fontSize: 48, fontWeight: 800, color: C.text, opacity: textOp, transform: `translateY(${textY}px)`, fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
        Registrazione in 30 secondi
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3: VALUTAZIONE (6s-10s = frames 180-300) ───
const SceneValutazione = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [1, 2, 3, 4, 5, 6];
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 52, fontWeight: 900, color: C.text, marginBottom: 60, opacity: fadeIn(frame, 0, 10), fontFamily: "system-ui" }}>Valutazione guidata</div>
      <div style={{ display: "flex", gap: 24, marginBottom: 80 }}>
        {steps.map((s, i) => {
          const delay = i * 8;
          const active = frame > delay;
          const sc = active ? scaleIn(frame, fps, delay) : 0;
          return (
            <div key={s} style={{ width: 80, height: 80, borderRadius: 16, background: active ? C.blue : C.card, border: `2px solid ${active ? C.blue : C.border}`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 28, fontWeight: 800, color: active ? "#fff" : C.muted, transform: `scale(${sc})`, boxShadow: active ? `0 0 30px rgba(59,130,246,0.4)` : "none", fontFamily: "system-ui" }}>{s}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: fadeIn(frame, 50, 15) }}>
        <span style={{ fontSize: 120, fontWeight: 900, color: C.blue, fontFamily: "system-ui" }}>{Math.min(60, Math.round(interpolate(frame, [50, 90], [0, 60], { extrapolateRight: "clamp" })))}</span>
        <span style={{ fontSize: 40, fontWeight: 700, color: C.muted, fontFamily: "system-ui" }}>/100</span>
      </div>
      <div style={{ fontSize: 32, color: C.text, marginTop: 20, opacity: fadeIn(frame, 70, 12), fontFamily: "system-ui", fontWeight: 700 }}>Score automatico per eta e sesso</div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4: SCHEDA (10s-14s = frames 300-420) ───
const SceneScheda = () => {
  const frame = useCurrentFrame();
  const exercises = ["Box Squat 4x10", "Leg Press 3x12", "Push-up 4x10", "Lat Pulldown 3x12", "Plank 3x45s", "Shoulder Press 3x10"];
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 56, fontWeight: 900, color: C.text, marginBottom: 20, opacity: fadeIn(frame, 0, 10), fontFamily: "system-ui" }}>65 esercizi.</div>
      <div style={{ fontSize: 56, fontWeight: 900, color: C.blue, marginBottom: 60, opacity: fadeIn(frame, 8, 10), fontFamily: "system-ui" }}>Un click.</div>
      <div style={{ width: 800, display: "flex", flexDirection: "column", gap: 16 }}>
        {exercises.map((ex, i) => {
          const delay = 15 + i * 8;
          return (
            <div key={ex} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: fadeIn(frame, delay, 8), transform: `translateY(${slideUp(frame, delay, 8, 40)}px)` }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: "system-ui" }}>{ex}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.green, display: "flex", justifyContent: "center", alignItems: "center" }}><span style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>✓</span></div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5: NUTRIZIONE + REPORT + CALENDARIO (14s-17s = frames 420-510) ───
const SceneTriple = () => {
  const frame = useCurrentFrame();
  const sections = [
    { label: "Nutrizione", value: "2208 kcal", color: C.green, startFrame: 0 },
    { label: "Report PDF", value: "Professionale", color: C.blue, startFrame: 30 },
    { label: "Calendario", value: "Sedute settimanali", color: C.yellow, startFrame: 60 },
  ];
  const activeIdx = frame < 30 ? 0 : frame < 60 ? 1 : 2;
  const s = sections[activeIdx];
  const localFrame = frame - s.startFrame;
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 40, fontWeight: 800, color: s.color, opacity: fadeIn(localFrame, 0, 8), transform: `translateY(${slideUp(localFrame, 0, 8)}px)`, marginBottom: 30, fontFamily: "system-ui", letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
      <div style={{ fontSize: 96, fontWeight: 900, color: C.text, opacity: fadeIn(localFrame, 5, 10), transform: `scale(${interpolate(localFrame, [5, 15], [0.8, 1], { extrapolateRight: "clamp" })})`, fontFamily: "system-ui" }}>{s.value}</div>
    </AbsoluteFill>
  );
};

// ─── SCENE 6: PERSONALIZZAZIONE (17s-21s = frames 510-630) ───
const ScenePersonalizza = () => {
  const frame = useCurrentFrame();
  const isDark = frame % 60 < 30;
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 52, fontWeight: 900, color: C.text, marginBottom: 10, opacity: fadeIn(frame, 0, 10), fontFamily: "system-ui", textAlign: "center" }}>Il tuo brand.</div>
      <div style={{ fontSize: 52, fontWeight: 900, color: C.blue, marginBottom: 60, opacity: fadeIn(frame, 8, 10), fontFamily: "system-ui", textAlign: "center" }}>Il tuo stile.</div>
      <div style={{ width: 200, height: 60, borderRadius: 30, background: isDark ? "#1e293b" : "#e2e8f0", position: "relative", border: `2px solid ${C.border}` }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: isDark ? C.blue : C.yellow, position: "absolute", top: 3, left: isDark ? 5 : 143, boxShadow: `0 0 20px ${isDark ? "rgba(59,130,246,0.5)" : "rgba(245,158,11,0.5)"}` }} />
      </div>
      <div style={{ marginTop: 80, width: 120, height: 120, borderRadius: "50%", background: C.blue, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 48, fontWeight: 900, color: "#fff", fontFamily: "system-ui", transform: `scale(${scaleIn(frame, 30, 40)})`, boxShadow: `0 0 60px rgba(59,130,246,0.4)` }}>PT</div>
    </AbsoluteFill>
  );
};

// ─── SCENE 7: PRICING (21s-25s = frames 630-750) ───
const ScenePricing = () => {
  const frame = useCurrentFrame();
  const leftX = interpolate(frame, [0, 20], [-400, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const rightX = interpolate(frame, [5, 25], [400, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const PricingCard = ({ name, price, period, badge, color, x, glow }) => (
    <div style={{ width: 380, background: C.card, border: `2px solid ${C.border}`, borderRadius: 24, padding: "40px 30px", textAlign: "center", transform: `translateX(${x}px)`, boxShadow: `0 0 40px ${glow}` }}>
      {badge && <div style={{ background: C.green, color: "#fff", fontSize: 16, fontWeight: 800, padding: "6px 20px", borderRadius: 20, display: "inline-block", marginBottom: 20, fontFamily: "system-ui" }}>{badge}</div>}
      <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, marginBottom: 12, fontFamily: "system-ui" }}>{name}</div>
      <div style={{ fontSize: 64, fontWeight: 900, color, fontFamily: "system-ui" }}>{price}</div>
      <div style={{ fontSize: 22, color: C.muted, fontFamily: "system-ui" }}>{period}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center", gap: 30, flexDirection: "row" }}>
      <PricingCard name="Pro Mensile" price="9,99\u20ac" period="/mese" color={C.blue} x={leftX} glow="rgba(59,130,246,0.15)" />
      <PricingCard name="Pro Annuale" price="7,99\u20ac" period="/mese" badge="RISPARMIA 20%" color={C.green} x={rightX} glow="rgba(16,185,129,0.15)" />
    </AbsoluteFill>
  );
};

// ─── SCENE 8: CTA FINALE (25s-30s = frames 750-900) ───
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.03;
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
      <div style={{ width: 140, height: 140, borderRadius: "50%", background: C.blue, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 56, fontWeight: 900, color: "#fff", fontFamily: "system-ui", transform: `scale(${pulseScale * scaleIn(frame, fps, 5)})`, boxShadow: `0 0 80px rgba(59,130,246,0.4)`, marginBottom: 60 }}>PT</div>
      <div style={{ fontSize: 48, fontWeight: 800, color: C.text, opacity: fadeIn(frame, 15, 12), transform: `translateY(${slideUp(frame, 15, 12)}px)`, fontFamily: "system-ui", textAlign: "center", marginBottom: 20 }}>Prova gratis 15 giorni</div>
      <div style={{ fontSize: 44, fontWeight: 900, color: C.blue, opacity: fadeIn(frame, 25, 12), transform: `translateY(${slideUp(frame, 25, 12)}px)`, fontFamily: "system-ui", textAlign: "center", marginBottom: 30 }}>personaltrainerboard.com</div>
      <div style={{ fontSize: 24, color: C.muted, opacity: fadeIn(frame, 35, 12), fontFamily: "system-ui", textAlign: "center" }}>Nessuna carta di credito richiesta</div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ───
export const PTBoardReel = () => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={0} durationInFrames={90}><SceneHook /></Sequence>
      <Sequence from={90} durationInFrames={90}><SceneReveal /></Sequence>
      <Sequence from={180} durationInFrames={120}><SceneValutazione /></Sequence>
      <Sequence from={300} durationInFrames={120}><SceneScheda /></Sequence>
      <Sequence from={420} durationInFrames={90}><SceneTriple /></Sequence>
      <Sequence from={510} durationInFrames={120}><ScenePersonalizza /></Sequence>
      <Sequence from={630} durationInFrames={120}><ScenePricing /></Sequence>
      <Sequence from={750} durationInFrames={150}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};
