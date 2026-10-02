import { Button, Card, PageTitle, ProgressBar } from "@/components/ui";
import { MISSIONS } from "@/data/content";
import { useProgress } from "@/store/progress";
import { useNav, type Route } from "@/store/nav";
import { cn } from "@/utils/cn";

export default function Misi() {
  const { data, progress } = useProgress();
  const { go } = useNav();
  const selesai = data.missions.length;
  const totalXp = MISSIONS.filter((m) => data.missions.includes(m.id)).reduce((a, b) => a + b.xp, 0);

  return (
    <div className="space-y-4">
      <PageTitle
        icon="🎯"
        title="Misi Penjelajah Darah"
        subtitle="Selesaikan misi untuk mendapatkan XP, bintang, dan badge spesial!"
      />

      <Card className="grid gap-3 bg-gradient-to-r from-amber-50 to-white sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">⭐</span>
          <div>
            <p className="text-xs font-black text-slate-500">MISI SELESAI</p>
            <p className="text-2xl font-black text-slate-800">
              {selesai} / {MISSIONS.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl">⚡</span>
          <div>
            <p className="text-xs font-black text-slate-500">XP DARI MISI</p>
            <p className="text-2xl font-black text-slate-800">{totalXp}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-black text-slate-500">PROGRES MISI</p>
          <ProgressBar value={progress.misi} showLabel color="from-amber-400 to-orange-500" className="mt-1" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {MISSIONS.map((m, i) => {
          const done = data.missions.includes(m.id);
          return (
            <Card
              key={m.id}
              hover
              className={cn(
                "relative overflow-hidden",
                done ? "border-2 border-emerald-200 bg-emerald-50/60" : "border-2 border-slate-100",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow",
                    done ? "bg-emerald-500" : "bg-gradient-to-br from-amber-400 to-orange-500",
                  )}
                >
                  {done ? "✅" : m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black tracking-widest text-amber-600">
                    MISI {i + 1}
                  </p>
                  <p className="text-lg leading-tight font-black text-slate-800">{m.title}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-600">{m.desc}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700">
                      ⚡ +{m.xp} XP
                    </span>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-black text-violet-700">
                      {done ? "⭐⭐⭐" : "☆☆☆"}
                    </span>
                    {done && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                        Misi selesai!
                      </span>
                    )}
                  </div>

                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-black text-sky-600">
                      💡 Lihat petunjuk
                    </summary>
                    <p className="mt-1 rounded-xl bg-sky-50 p-2.5 text-xs font-bold text-sky-800">
                      {m.hint}
                    </p>
                  </details>

                  {!done && (
                    <Button size="sm" className="mt-3" onClick={() => go(m.goto as Route)}>
                      Kerjakan misi →
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selesai === MISSIONS.length && (
        <Card className="anim-pop bg-gradient-to-r from-violet-600 to-fuchsia-600 text-center text-white">
          <p className="text-5xl">🏅</p>
          <p className="mt-1 text-2xl font-black">SEMUA MISI SELESAI!</p>
          <p className="font-bold text-white/85">
            Kamu resmi menjadi Komandan Misi Penjelajah Darah. Lanjutkan ke kuis untuk menguji
            pemahamanmu!
          </p>
          <Button variant="amber" className="mt-3" onClick={() => go("kuis")}>
            🏆 Kerjakan Kuis
          </Button>
        </Card>
      )}
    </div>
  );
}
