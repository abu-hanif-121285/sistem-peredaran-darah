import { useState } from "react";
import { Button, Card, Confetti, Modal, PageTitle, ProgressBar, Stat } from "@/components/ui";
import Avatar from "@/components/Avatar";
import { BADGES, LEVELS, MISSIONS } from "@/data/content";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { cn } from "@/utils/cn";

const AKTIVITAS = [
  { key: "materi", label: "Materi", icon: "📚", color: "from-sky-400 to-blue-500", route: "materi" },
  { key: "eksplorasi", label: "Eksplorasi 3D", icon: "🫀", color: "from-rose-400 to-red-500", route: "eksplorasi" },
  { key: "simulasi", label: "Simulasi", icon: "🩸", color: "from-fuchsia-400 to-purple-500", route: "simulasi" },
  { key: "misi", label: "Misi", icon: "🎯", color: "from-amber-400 to-orange-500", route: "misi" },
  { key: "latihan", label: "Latihan", icon: "📝", color: "from-emerald-400 to-teal-500", route: "latihan" },
  { key: "kuis", label: "Kuis", icon: "🏆", color: "from-indigo-400 to-violet-500", route: "kuis" },
] as const;

export default function Progres() {
  const { data, level, nextLevel, levelProgress, progress, bestQuiz, setName } = useProgress();
  const { go } = useNav();
  const [edit, setEdit] = useState(false);
  const [nama, setNama] = useState(data.name);
  const [av, setAv] = useState<"putra" | "putri">(data.avatar);

  const tuntas = progress.total >= 100;

  return (
    <div className="space-y-4">
      <Confetti show={tuntas} />
      <PageTitle icon="👤" title="Dashboard Siswa" subtitle="Pantau perkembangan belajarmu di sini." />

      {/* KARTU PROFIL */}
      <Card className="overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-0 text-white">
        <div className="flex flex-wrap items-center gap-4 p-5">
          <div className="rounded-3xl bg-white/10 p-2">
            <Avatar type={data.avatar} size={76} />
          </div>
          <div className="min-w-[200px] flex-1">
            <p className="text-[11px] font-black tracking-[0.2em] text-rose-300">SISWA PENJELAJAH</p>
            <p className="text-2xl font-black">{data.name || "Siswa"}</p>
            <p className="text-sm font-bold text-white/70">
              {level.icon} LEVEL {String(level.id).padStart(2, "0")} — {level.title}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEdit(true)}>
            ✏️ Ubah Nama / Avatar
          </Button>
        </div>
        <div className="space-y-2 bg-black/20 px-5 py-4">
          <div className="flex justify-between text-xs font-black">
            <span className="text-amber-300">⚡ XP</span>
            <span>
              {data.xp.toLocaleString("id-ID")} / {nextLevel ? nextLevel.minXp.toLocaleString("id-ID") : "MAX"}
            </span>
          </div>
          <ProgressBar value={levelProgress} color="from-amber-400 to-orange-500" height="h-4" />
          <p className="text-[11px] font-bold text-white/60">
            {nextLevel
              ? `Kumpulkan ${nextLevel.minXp - data.xp} XP lagi untuk naik ke Level ${nextLevel.id} — ${nextLevel.title}`
              : "Kamu sudah mencapai level tertinggi. Luar biasa!"}
          </p>
        </div>
      </Card>

      {/* STATISTIK */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="🎯" label="Misi selesai" value={`${data.missions.length}/${MISSIONS.length}`} color="bg-amber-50 text-amber-600" />
        <Stat icon="🏆" label="Nilai kuis terbaik" value={bestQuiz || "-"} color="bg-emerald-50 text-emerald-600" />
        <Stat icon="📝" label="Kuis dikerjakan" value={data.quiz.length} color="bg-sky-50 text-sky-600" />
        <Stat icon="🏅" label="Badge diperoleh" value={`${data.badges.length}/${BADGES.length}`} color="bg-violet-50 text-violet-600" />
      </div>

      {/* PROGRES AKTIVITAS */}
      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-lg font-black text-slate-800">📈 Progres Pembelajaran</p>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">
            Total {progress.total}%
          </span>
        </div>
        <div className="space-y-3">
          {AKTIVITAS.map((a) => (
            <div key={a.key} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                {a.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-black text-slate-700">{a.label}</p>
                  <p className="text-sm font-black text-slate-500">{progress[a.key]}%</p>
                </div>
                <ProgressBar value={progress[a.key]} color={a.color} className="mt-1" />
              </div>
              <Button size="sm" variant="secondary" onClick={() => go(a.route)}>
                Buka
              </Button>
            </div>
          ))}
        </div>
        {tuntas && (
          <div className="anim-pop mt-4 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-5 text-center text-white">
            <p className="text-5xl">🏆</p>
            <p className="text-2xl font-black">SELAMAT!</p>
            <p className="font-bold">
              Kamu telah menyelesaikan Jelajah Sistem Peredaran Darah Manusia.
            </p>
          </div>
        )}
      </Card>

      {/* LEVEL */}
      <Card>
        <p className="mb-3 text-lg font-black text-slate-800">🪜 Perjalanan Level</p>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {LEVELS.map((l) => {
            const tercapai = data.xp >= l.minXp;
            return (
              <div
                key={l.id}
                className={cn(
                  "rounded-2xl border-2 p-3 text-center transition-all",
                  l.id === level.id
                    ? "border-rose-400 bg-rose-50"
                    : tercapai
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50 opacity-70",
                )}
              >
                <p className="text-3xl">{tercapai ? l.icon : "🔒"}</p>
                <p className="text-xs font-black text-slate-500">LEVEL {l.id}</p>
                <p className="text-sm leading-tight font-black text-slate-800">{l.title}</p>
                <p className="text-[11px] font-bold text-slate-400">{l.minXp} XP</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* BADGE */}
      <Card>
        <p className="mb-3 text-lg font-black text-slate-800">🏅 Koleksi Badge</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {BADGES.map((b) => {
            const punya = data.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={cn(
                  "rounded-2xl border-2 p-4 text-center transition-all",
                  punya
                    ? "card-3d border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50"
                    : "border-dashed border-slate-200 bg-slate-50",
                )}
              >
                <p className={cn("text-4xl", !punya && "opacity-25 grayscale")}>{punya ? b.icon : "🔒"}</p>
                <p className={cn("mt-1 font-black", punya ? "text-slate-800" : "text-slate-400")}>{b.name}</p>
                <p className="text-[11px] font-bold text-slate-500">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal open={edit} onClose={() => setEdit(false)}>
        <p className="text-xl font-black text-slate-800">Ubah Nama & Avatar</p>
        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          maxLength={22}
          placeholder="Tulis namamu"
          className="mt-3 w-full rounded-2xl border-2 border-slate-200 p-3.5 text-lg font-bold focus:border-rose-400 focus:outline-none"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(["putra", "putri"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setAv(t)}
              className={cn(
                "press flex flex-col items-center gap-1 rounded-2xl border-2 p-3 font-black",
                av === t ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-200",
              )}
            >
              <Avatar type={t} size={56} />
              {t === "putra" ? "Putra" : "Putri"}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => {
              setName(nama, av);
              setEdit(false);
            }}
          >
            Simpan
          </Button>
          <Button variant="secondary" onClick={() => setEdit(false)}>
            Batal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
