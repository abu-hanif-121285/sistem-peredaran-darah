/**
 * Mesin audio sederhana berbasis Web Audio API.
 * Tidak memerlukan file eksternal sehingga aplikasi tetap ringan & bisa offline.
 * Volume dijaga rendah agar nyaman untuk anak.
 */

let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function setAudioEnabled(v: boolean) {
  enabled = v;
}

export function isAudioEnabled() {
  return enabled;
}

type ToneOpts = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  delay?: number;
  gain?: number;
  sweepTo?: number;
};

function tone({ freq, dur = 0.16, type = "sine", delay = 0, gain = 0.09, sweepTo }: ToneOpts) {
  const ac = getCtx();
  if (!ac || !enabled) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  click: () => tone({ freq: 620, dur: 0.07, type: "triangle", gain: 0.05 }),
  hover: () => tone({ freq: 880, dur: 0.05, type: "sine", gain: 0.025 }),
  correct: () => {
    tone({ freq: 659.25, dur: 0.12, type: "sine", gain: 0.08 });
    tone({ freq: 830.6, dur: 0.12, type: "sine", delay: 0.1, gain: 0.08 });
    tone({ freq: 987.77, dur: 0.22, type: "sine", delay: 0.2, gain: 0.08 });
  },
  wrong: () => {
    tone({ freq: 300, dur: 0.18, type: "sine", gain: 0.07, sweepTo: 200 });
    tone({ freq: 220, dur: 0.22, type: "sine", delay: 0.12, gain: 0.055 });
  },
  mission: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ freq: f, dur: 0.18, type: "triangle", delay: i * 0.09, gain: 0.07 }),
    );
  },
  levelUp: () => {
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      tone({ freq: f, dur: 0.22, type: "sine", delay: i * 0.08, gain: 0.075 }),
    );
  },
  badge: () => {
    [880, 1174.66, 1567.98].forEach((f, i) =>
      tone({ freq: f, dur: 0.26, type: "sine", delay: i * 0.1, gain: 0.07 }),
    );
  },
  heartbeat: () => {
    tone({ freq: 92, dur: 0.14, type: "sine", gain: 0.1, sweepTo: 55 });
    tone({ freq: 78, dur: 0.17, type: "sine", delay: 0.2, gain: 0.075, sweepTo: 48 });
  },
  whoosh: () => tone({ freq: 180, dur: 0.3, type: "sine", gain: 0.05, sweepTo: 520 }),
};

export function unlockAudio() {
  getCtx();
}
