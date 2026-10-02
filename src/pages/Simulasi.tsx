import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import { Button, Card, PageTitle } from "@/components/ui";
import { hasWebGL } from "@/components/three/parts";
import { CHECKPOINTS } from "@/components/three/SimScene";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";
import { GuideBubble } from "@/components/Avatar";

const SimScene = lazy(() => import("@/components/three/SimScene"));

const WARNA: Record<string, string> = {
  sky: "from-sky-500 to-blue-700",
  rose: "from-rose-500 to-red-700",
  violet: "from-violet-500 to-fuchsia-700",
};

/* ===== Fallback 2D: diagram angka 8 beranimasi ===== */
function Sim2D({ running }: { running: boolean }) {
  return (
    <svg viewBox="0 0 320 420" className="h-full w-full">
      <rect width="320" height="420" fill="#08162c" />
      <ellipse cx="90" cy="90" rx="42" ry="34" fill="#ffc2cf" opacity="0.35" />
      <ellipse cx="230" cy="90" rx="42" ry="34" fill="#ffc2cf" opacity="0.35" />
      <text x="90" y="52" textAnchor="middle" fill="#f9a8d4" fontSize="12" fontWeight="bold">Paru-paru</text>
      <text x="230" y="52" textAnchor="middle" fill="#f9a8d4" fontSize="12" fontWeight="bold">Paru-paru</text>
      <path d="M145 185 C110 170 80 140 90 100" stroke="#2f6fc0" strokeWidth="9" fill="none" strokeLinecap="round" className={running ? "flow-line" : ""} />
      <path d="M90 100 C120 70 200 70 230 100" stroke="#2f6fc0" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M230 100 C240 140 210 170 175 185" stroke="#c23b50" strokeWidth="9" fill="none" strokeLinecap="round" className={running ? "flow-line" : ""} />
      <g>
        <circle cx="145" cy="205" r="26" fill="#ef4b63" />
        <circle cx="175" cy="205" r="26" fill="#ef4b63" />
        <path d="M119 213 L160 258 L201 213 Z" fill="#ef4b63" />
        <text x="160" y="210" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">JANTUNG</text>
      </g>
      <path d="M180 255 C215 275 245 310 230 345" stroke="#c23b50" strokeWidth="9" fill="none" strokeLinecap="round" className={running ? "flow-line" : ""} />
      <path d="M230 345 C200 375 120 375 90 345" stroke="#c23b50" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M90 345 C75 310 105 275 140 255" stroke="#2f6fc0" strokeWidth="9" fill="none" strokeLinecap="round" className={running ? "flow-line" : ""} />
      <text x="160" y="395" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">SELURUH TUBUH</text>
      <text x="160" y="22" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Mode 2D — diagram peredaran darah ganda</text>
    </svg>
  );
}

export default function Simulasi() {
  const webgl = useMemo(() => hasWebGL(), []);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [cp, setCp] = useState<number | null>(null);
  const [laps, setLaps] = useState(0);
  const { markSim, completeMission, awardBadge, data } = useProgress();
  const { go } = useNav();

  const onCheckpoint = useCallback((i: number) => {
    setCp(i);
  }, []);

  const onLap = useCallback(() => {
    setLaps((l) => l + 1);
    sfx.correct();
    markSim();
    completeMission("misi-simulasi");
    awardBadge("penjelajah-darah");
  }, [markSim, completeMission, awardBadge]);

  const info = cp !== null ? CHECKPOINTS[cp] : null;

  return (
    <div className="space-y-4">
      <PageTitle
        icon="🩸"
        title="Simulasi Perjalanan Darah"
        subtitle="Ikuti sel darah berkeliling tubuh, dari jantung ke paru-paru dan ke seluruh tubuh."
        right={
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-center">
            <p className="text-[10px] font-black text-emerald-600">PUTARAN SELESAI</p>
            <p className="text-xl font-black text-emerald-700">{laps}</p>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_330px]">
        <Card className="overflow-hidden p-0">
          <div className="relative h-[54vh] min-h-[400px] w-full sm:h-[64vh]">
            {webgl ? (
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center bg-[#08162c] text-white">
                    <p className="animate-pulse font-black">Menyiapkan simulasi 3D...</p>
                  </div>
                }
              >
                <SimScene
                  running={running}
                  speed={speed}
                  resetKey={resetKey}
                  onCheckpoint={onCheckpoint}
                  onLap={onLap}
                />
              </Suspense>
            ) : (
              <Sim2D running={running} />
            )}

            <div
              className={cn(
                "pointer-events-none absolute top-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-black whitespace-nowrap text-white backdrop-blur",
                running ? "bg-rose-600/85" : "bg-slate-700/80",
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full bg-white", running && "animate-ping")} />
              {running ? "ANDA SEDANG MELIHAT PERJALANAN DARAH" : "SIMULASI DIJEDA — TEKAN ▶ MULAI"}
            </div>

            <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col items-end gap-1 text-[11px] font-black">
              <span className="rounded-full bg-rose-600/90 px-2.5 py-1 text-white">🔴 Sel darah kaya oksigen</span>
              <span className="rounded-full bg-indigo-600/90 px-2.5 py-1 text-white">🟣 Sel darah kaya karbon dioksida</span>
              <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] text-white/85">
                🖱️ Seret untuk memutar · scroll untuk mendekat ke jantung
              </span>
            </div>
          </div>

          {/* ===== KONTROL ===== */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-3">
            <Button
              variant={running ? "secondary" : "success"}
              onClick={() => {
                setRunning(true);
                sfx.heartbeat();
              }}
              disabled={running}
            >
              ▶ MULAI
            </Button>
            <Button variant="secondary" onClick={() => setRunning(false)} disabled={!running}>
              ⏸ JEDA
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setResetKey((k) => k + 1);
                setCp(null);
              }}
            >
              ↻ ULANGI
            </Button>
            <span className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />
            {([
              { v: 0.5, l: "🐢 LAMBAT" },
              { v: 1, l: "▶ NORMAL" },
              { v: 2, l: "⚡ CEPAT" },
            ] as const).map((s) => (
              <button
                key={s.v}
                onClick={() => {
                  sfx.click();
                  setSpeed(s.v);
                }}
                className={cn(
                  "press rounded-2xl border-2 px-3.5 py-2.5 text-sm font-black transition-all",
                  speed === s.v
                    ? "border-amber-500 bg-amber-400 text-white shadow-lg shadow-amber-400/30"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-300",
                )}
              >
                {s.l}
              </button>
            ))}
          </div>
        </Card>

        {/* ===== PANEL SAMPING ===== */}
        <div className="space-y-3">
          {info ? (
            <Card className="anim-pop overflow-hidden p-0">
              <div className={`bg-gradient-to-br ${WARNA[info.warna]} p-4 text-white`}>
                <p className="text-[11px] font-black tracking-widest text-white/80">
                  DARAH SEDANG MELEWATI
                </p>
                <p className="text-2xl font-black">{info.judul}</p>
              </div>
              <p className="p-4 text-[15px] font-bold text-slate-700">{info.teks}</p>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-rose-200 bg-rose-50/60">
              <GuideBubble
                type="putra"
                text="Tekan ▶ MULAI, lalu perhatikan sel-sel darah berjalan. Warnanya akan berubah lho!"
              />
            </Card>
          )}

          <Card>
            <p className="mb-2 text-sm font-black text-slate-700">🧭 Titik perhentian darah</p>
            <ol className="space-y-1.5">
              {CHECKPOINTS.map((c, i) => (
                <li
                  key={c.judul}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-black transition-colors",
                    cp === i ? "bg-rose-500 text-white" : "bg-slate-50 text-slate-600",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-lg text-[11px]",
                      cp === i ? "bg-white/25" : "bg-white",
                    )}
                  >
                    {i + 1}
                  </span>
                  {c.judul}
                </li>
              ))}
            </ol>
          </Card>

          <Card className="bg-gradient-to-br from-sky-600 to-indigo-700 text-white">
            <p className="text-sm font-black">💡 Ingat ya!</p>
            <p className="mt-1 text-xs font-bold text-white/85">
              Peredaran darah KECIL: jantung → paru-paru → jantung.
              <br />
              Peredaran darah BESAR: jantung → seluruh tubuh → jantung.
            </p>
            <p className="mt-2 text-[11px] font-semibold text-white/70">
              Catatan sains: darah yang kaya karbon dioksida sebenarnya berwarna merah gelap. Warna
              biru-ungu pada simulasi hanyalah penanda seperti pada buku pelajaran.
            </p>
            {data.simDone && (
              <Button size="sm" variant="amber" className="mt-3" onClick={() => go("latihan")}>
                📝 Lanjut ke Latihan →
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
