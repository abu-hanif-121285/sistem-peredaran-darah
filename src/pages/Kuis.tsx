import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Confetti, Feedback, PageTitle, ProgressBar, Stat } from "@/components/ui";
import { KUIS, PESAN_MOTIVASI, type Soal } from "@/data/questions";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { GuideBubble } from "@/components/Avatar";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";
import { IMG } from "@/assets/images";

type Fase = "intro" | "main" | "hasil";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const d = s % 60;
  return `${m}:${String(d).padStart(2, "0")}`;
}

export default function Kuis() {
  const [fase, setFase] = useState<Fase>("intro");
  const [i, setI] = useState(0);
  const [jawaban, setJawaban] = useState<(number | boolean | null)[]>(() => KUIS.map(() => null));
  const [kunci, setKunci] = useState(false);
  const [detik, setDetik] = useState(0);
  const [hasil, setHasil] = useState({ benar: 0, salah: 0, persen: 0, nilai: 0, waktu: 0 });
  const timer = useRef<number | null>(null);
  const { addQuiz, bestQuiz, data, awardBadge, progress } = useProgress();
  const { go } = useNav();

  useEffect(() => {
    if (fase === "main") {
      timer.current = window.setInterval(() => setDetik((d) => d + 1), 1000);
      return () => {
        if (timer.current) window.clearInterval(timer.current);
      };
    }
  }, [fase]);

  const soal: Soal = KUIS[i];
  const dijawab = jawaban[i] !== null;

  const mulai = () => {
    setFase("main");
    setI(0);
    setJawaban(KUIS.map(() => null));
    setDetik(0);
    setKunci(false);
  };

  const pilih = (v: number | boolean) => {
    if (kunci) return;
    const next = [...jawaban];
    next[i] = v;
    setJawaban(next);
    setKunci(true);
    const benar = soal.tipe === "pg" ? v === soal.jawaban : v === soal.jawaban;
    if (benar) sfx.correct();
    else sfx.wrong();
  };

  const lanjut = () => {
    if (i + 1 >= KUIS.length) {
      const benar = KUIS.reduce((acc, s, idx) => {
        const j = jawaban[idx];
        if (j === null) return acc;
        return acc + (s.tipe === "pg" ? (j === s.jawaban ? 1 : 0) : j === s.jawaban ? 1 : 0);
      }, 0);
      const persen = Math.round((benar / KUIS.length) * 100);
      const nilai = persen;
      setHasil({ benar, salah: KUIS.length - benar, persen, nilai, waktu: detik });
      addQuiz({
        date: new Date().toISOString(),
        score: nilai,
        correct: benar,
        wrong: KUIS.length - benar,
        percent: persen,
        timeSec: detik,
      });
      if (persen >= 90) awardBadge("master-peredaran");
      setFase("hasil");
      if (persen >= 60) sfx.levelUp();
    } else {
      setI(i + 1);
      setKunci(jawaban[i + 1] !== null);
    }
  };

  const badgeKuis = useMemo(() => {
    if (hasil.persen >= 90) return { icon: "🥇", nama: "Medali Emas" };
    if (hasil.persen >= 75) return { icon: "🥈", nama: "Medali Perak" };
    if (hasil.persen >= 60) return { icon: "🥉", nama: "Medali Perunggu" };
    return { icon: "🎖️", nama: "Pejuang Belajar" };
  }, [hasil.persen]);

  /* ============ INTRO ============ */
  if (fase === "intro")
    return (
      <div className="space-y-4">
        <PageTitle icon="🏆" title="Kuis Sistem Peredaran Darah" subtitle="Uji pemahamanmu dengan 22 soal pilihan ganda dan benar/salah." />
        <div className="relative isolate h-[210px] overflow-hidden rounded-[2rem] bg-[#0a1b35] sm:h-[260px]">
          <img
            src={IMG.selDarahRealistis}
            alt="Ilustrasi 3D sel darah merah, sel darah putih, dan keping darah"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07172d]/90 via-[#07172d]/45 to-transparent" />
          <div className="relative flex h-full max-w-md flex-col justify-center p-5 text-white sm:p-8">
            <p className="text-xs font-black tracking-[0.2em] text-[#ffcf72]">SIAP MENJADI ILMUWAN CILIK?</p>
            <p className="mt-2 text-2xl leading-tight font-black sm:text-3xl">
              Kenali setiap bagian dalam perjalanan darah.
            </p>
          </div>
        </div>
        <Card className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <GuideBubble type="putri" text="Siap? Kerjakan dengan teliti ya. Tidak ada batas waktu, santai saja!" />
            <ul className="space-y-2">
              {[
                `Jumlah soal: ${KUIS.length} soal`,
                "Jenis: pilihan ganda, benar/salah, dan soal cerita sederhana",
                "Tingkat: Mudah, Sedang, dan HOTS sederhana",
                "Setiap jawaban langsung diberi penjelasan",
                "Nilai terbaikmu akan disimpan otomatis",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                  <span>📌</span>
                  {t}
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={mulai}>
              🚀 MULAI KUIS
            </Button>
          </div>
          <div className="space-y-3">
            <Stat icon="🏅" label="Nilai terbaikmu" value={bestQuiz || "Belum ada"} color="bg-amber-50 text-amber-600" />
            <Stat icon="🔁" label="Jumlah percobaan" value={data.quiz.length} color="bg-sky-50 text-sky-600" />
            <Stat icon="📈" label="Progres kuis" value={`${progress.kuis}%`} color="bg-emerald-50 text-emerald-600" />
            {data.quiz.length > 0 && (
              <Card className="bg-slate-50 p-3">
                <p className="mb-1.5 text-xs font-black text-slate-500">RIWAYAT TERAKHIR</p>
                <div className="space-y-1">
                  {data.quiz.slice(0, 4).map((q, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{new Date(q.date).toLocaleDateString("id-ID")}</span>
                      <span className="font-black text-slate-800">
                        {q.score} · {q.correct}✓ {q.wrong}✗
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    );

  /* ============ HASIL ============ */
  if (fase === "hasil")
    return (
      <div className="space-y-4">
        <Confetti show={hasil.persen >= 60} />
        <PageTitle icon="📊" title="Hasil Kuis" subtitle="Inilah hasil kerja kerasmu!" />
        <Card className="anim-pop overflow-hidden p-0">
          <div
            className={cn(
              "p-6 text-center text-white",
              hasil.persen >= 75
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : hasil.persen >= 50
                  ? "bg-gradient-to-br from-amber-400 to-orange-500"
                  : "bg-gradient-to-br from-sky-500 to-indigo-600",
            )}
          >
            <p className="text-7xl">{badgeKuis.icon}</p>
            <p className="mt-1 text-sm font-black tracking-widest opacity-90">NILAI KAMU</p>
            <p className="text-6xl font-black">{hasil.nilai}</p>
            <p className="text-lg font-black">{badgeKuis.nama}</p>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5">
            <Stat icon="✅" label="Jawaban benar" value={hasil.benar} color="bg-emerald-50 text-emerald-600" />
            <Stat icon="❌" label="Jawaban salah" value={hasil.salah} color="bg-rose-50 text-rose-600" />
            <Stat icon="📊" label="Persentase" value={`${hasil.persen}%`} color="bg-violet-50 text-violet-600" />
            <Stat icon="⏱️" label="Waktu" value={fmt(hasil.waktu)} color="bg-sky-50 text-sky-600" />
            <Stat icon="⚡" label="XP didapat" value={`+${Math.round(hasil.nilai * 1.5)}`} color="bg-amber-50 text-amber-600" />
          </div>
          <div className="px-5 pb-5">
            <ProgressBar value={hasil.persen} showLabel height="h-4" color="from-emerald-400 to-teal-500" />
            <div className="mt-4 rounded-2xl border-2 border-rose-100 bg-rose-50 p-4">
              <p className="font-black text-rose-700">💬 Pesan untukmu</p>
              <p className="text-sm font-bold text-rose-900">{PESAN_MOTIVASI(hasil.persen)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-lg font-black text-slate-800">📋 Pembahasan Jawaban</p>
          <div className="space-y-2">
            {KUIS.map((s, idx) => {
              const j = jawaban[idx];
              const benar = s.tipe === "pg" ? j === s.jawaban : j === s.jawaban;
              const jawabTeks =
                j === null
                  ? "Tidak dijawab"
                  : s.tipe === "pg"
                    ? s.opsi[j as number]
                    : (j as boolean)
                      ? "Benar"
                      : "Salah";
              return (
                <details key={s.id} className={cn("rounded-2xl border-2 p-3", benar ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50")}>
                  <summary className="cursor-pointer text-sm font-black text-slate-700">
                    {benar ? "✅" : "❌"} Soal {idx + 1}. {s.soal.slice(0, 62)}
                    {s.soal.length > 62 ? "..." : ""}
                  </summary>
                  <div className="mt-2 space-y-1 text-sm font-semibold text-slate-700">
                    <p>{s.soal}</p>
                    <p>
                      Jawabanmu: <b>{jawabTeks}</b>
                    </p>
                    <p className="text-emerald-700">
                      Kunci:{" "}
                      <b>{s.tipe === "pg" ? s.opsi[s.jawaban] : s.jawaban ? "Benar" : "Salah"}</b>
                    </p>
                    <p className="rounded-xl bg-white p-2.5 text-slate-600">💡 {s.bahas}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button onClick={mulai}>↻ Ulangi Kuis</Button>
          <Button variant="secondary" onClick={() => go("materi")}>
            📚 Pelajari Materi Lagi
          </Button>
          <Button variant="sky" onClick={() => go("progres")}>
            👤 Lihat Progres
          </Button>
        </div>
      </div>
    );

  /* ============ MAIN ============ */
  const benarSekarang = soal.tipe === "pg" ? jawaban[i] === soal.jawaban : jawaban[i] === soal.jawaban;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-black text-white">
            Soal {i + 1}/{KUIS.length}
          </span>
          <span
            className={cn(
              "rounded-2xl px-3 py-2 text-xs font-black",
              soal.level === "Mudah"
                ? "bg-emerald-100 text-emerald-700"
                : soal.level === "Sedang"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-violet-100 text-violet-700",
            )}
          >
            {soal.level}
          </span>
        </div>
        <span className="rounded-2xl bg-slate-800 px-3 py-2 text-sm font-black text-white">
          ⏱️ {fmt(detik)}
        </span>
      </div>

      <ProgressBar value={((i + 1) / KUIS.length) * 100} color="from-rose-400 to-red-500" />

      <Card className="space-y-4">
        <p className="text-lg leading-snug font-black text-slate-800 sm:text-xl">{soal.soal}</p>

        {soal.tipe === "pg" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {soal.opsi.map((o, idx) => {
              const state = !kunci
                ? "idle"
                : idx === soal.jawaban
                  ? "benar"
                  : idx === jawaban[i]
                    ? "salah"
                    : "idle";
              return (
                <button
                  key={idx}
                  onClick={() => pilih(idx)}
                  disabled={kunci}
                  className={cn(
                    "press flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left text-[15px] font-bold transition-all",
                    state === "idle" && "border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50",
                    state === "benar" && "border-emerald-400 bg-emerald-50 text-emerald-800",
                    state === "salah" && "anim-shake border-rose-400 bg-rose-50 text-rose-800",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-black">
                    {"ABCD"[idx]}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {[true, false].map((v) => {
              const state = !kunci ? "idle" : v === soal.jawaban ? "benar" : v === jawaban[i] ? "salah" : "idle";
              return (
                <button
                  key={String(v)}
                  onClick={() => pilih(v)}
                  disabled={kunci}
                  className={cn(
                    "press rounded-2xl border-4 p-5 text-xl font-black transition-all",
                    state === "idle" && (v ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"),
                    state === "benar" && "border-emerald-500 bg-emerald-100 text-emerald-800",
                    state === "salah" && "anim-shake border-rose-500 bg-rose-100 text-rose-800",
                  )}
                >
                  {v ? "✔️ BENAR" : "❌ SALAH"}
                </button>
              );
            })}
          </div>
        )}

        {kunci && <Feedback status={benarSekarang ? "benar" : "salah"} text={soal.bahas} />}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={i === 0}
            onClick={() => {
              setI(i - 1);
              setKunci(jawaban[i - 1] !== null);
            }}
          >
            ← Sebelumnya
          </Button>
          <Button onClick={lanjut} disabled={!dijawab}>
            {i + 1 >= KUIS.length ? "🏁 Selesai & Lihat Nilai" : "Soal berikutnya →"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
