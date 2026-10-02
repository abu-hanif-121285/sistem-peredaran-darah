import { Card, PageTitle, ProgressBar } from "@/components/ui";
import { MAP_NODES } from "@/data/content";
import { useNav, type Route } from "@/store/nav";
import { useProgress } from "@/store/progress";
import { GuideBubble } from "@/components/Avatar";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";

export default function Peta() {
  const { go } = useNav();
  const { progress } = useProgress();

  const states = MAP_NODES.map((n) => n.check(progress));
  const firstLocked = states.findIndex((s) => !s);
  const semuaSelesai = states.every(Boolean);

  return (
    <div className="space-y-5">
      <PageTitle
        icon="🗺️"
        title="Peta Pembelajaran"
        subtitle="Ikuti jalurnya satu per satu. Pos berikutnya terbuka setelah pos sebelumnya selesai."
      />

      <Card className="bg-gradient-to-r from-sky-50 to-white">
        <div className="flex flex-wrap items-center gap-4">
          <GuideBubble
            type="putra"
            text="Ayo mulai dari START! Selesaikan setiap pos untuk membuka pos berikutnya."
          />
          <div className="min-w-[200px] flex-1">
            <p className="text-xs font-black text-slate-500">PROGRES PERJALANAN</p>
            <ProgressBar
              value={Math.round((states.filter(Boolean).length / MAP_NODES.length) * 100)}
              showLabel
              color="from-sky-400 to-indigo-500"
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      <div className="relative overflow-hidden rounded-[2rem] border border-white bg-[linear-gradient(180deg,#0f2244_0%,#17315d_100%)] p-4 sm:p-7">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="#93c5fd" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative space-y-1">
          <div className="flex justify-center">
            <span className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-black text-emerald-950 shadow-lg">
              🚩 START
            </span>
          </div>

          {MAP_NODES.map((n, i) => {
            const done = states[i];
            const unlocked = i === 0 || states[i - 1];
            const current = i === firstLocked;
            const side = i % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto";
            return (
              <div key={n.id} className="relative">
                <div className="flex justify-center py-1.5">
                  <svg width="14" height="34" className="opacity-70">
                    <line
                      x1="7"
                      y1="0"
                      x2="7"
                      y2="34"
                      stroke={done ? "#34d399" : "#64748b"}
                      strokeWidth="4"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <button
                  disabled={!unlocked}
                  onClick={() => {
                    if (!unlocked) return;
                    sfx.whoosh();
                    go(n.route as Route);
                  }}
                  className={cn(
                    "press group flex w-full max-w-md items-center gap-3 rounded-3xl border-2 p-3.5 text-left transition-all sm:w-[70%]",
                    side,
                    done
                      ? "border-emerald-300 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                      : unlocked
                        ? "border-amber-300 bg-white text-slate-800 shadow-lg hover:-translate-y-0.5"
                        : "cursor-not-allowed border-slate-600 bg-slate-700/60 text-slate-300",
                    current && unlocked && !done && "anim-glow",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
                      done ? "bg-white/25" : unlocked ? "bg-amber-100" : "bg-slate-600/60",
                    )}
                  >
                    {unlocked ? n.icon : "🔒"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-black">
                      Pos {i + 1} · {n.label}
                    </span>
                    <span
                      className={cn(
                        "block text-xs font-bold",
                        done ? "text-white/85" : unlocked ? "text-slate-500" : "text-slate-400",
                      )}
                    >
                      {unlocked ? n.desc : "Selesaikan pos sebelumnya untuk membuka."}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-black">
                    {done ? "✅ Selesai" : unlocked ? "Mulai →" : ""}
                  </span>
                </button>
              </div>
            );
          })}

          <div className="flex justify-center py-1.5">
            <svg width="14" height="34" className="opacity-70">
              <line x1="7" y1="0" x2="7" y2="34" stroke={semuaSelesai ? "#fbbf24" : "#64748b"} strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex justify-center">
            <div
              className={cn(
                "rounded-3xl border-2 px-6 py-4 text-center",
                semuaSelesai
                  ? "anim-pop border-amber-200 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-2xl"
                  : "border-slate-600 bg-slate-700/60 text-slate-300",
              )}
            >
              <p className="text-4xl">{semuaSelesai ? "🏅" : "🔒"}</p>
              <p className="mt-1 text-lg font-black">MASTER SISTEM PEREDARAN DARAH</p>
              <p className="text-xs font-bold opacity-85">
                {semuaSelesai
                  ? "Selamat! Kamu telah menyelesaikan seluruh perjalanan belajar."
                  : "Selesaikan semua pos untuk meraih gelar ini."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
