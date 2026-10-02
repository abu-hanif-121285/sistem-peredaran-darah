import { useState } from "react";
import { Button, Card, Modal, PageTitle, ProgressBar, Stat } from "@/components/ui";
import { BADGES, MATERI, MISSIONS } from "@/data/content";
import { KUIS } from "@/data/questions";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";
import { LogoUploader } from "@/components/LogoUploader";

const SANDI = "Inovatif";

export default function Guru() {
  const [masuk, setMasuk] = useState(false);
  const [sandi, setSandi] = useState("");
  const [err, setErr] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [namaBaru, setNamaBaru] = useState("");
  const { data, progress, bestQuiz, level, resetAll, setName } = useProgress();
  const { go } = useNav();

  if (!masuk)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="anim-pop w-full max-w-md border-2 border-indigo-100">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-700 text-4xl shadow-lg">
              🧑‍🏫
            </div>
            <p className="mt-3 text-2xl font-black text-slate-800">Mode Guru</p>
            <p className="text-sm font-semibold text-slate-500">
              Halaman khusus bapak/ibu guru. Masukkan kata sandi untuk melanjutkan.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (sandi === SANDI) {
                setMasuk(true);
                setErr(false);
                sfx.correct();
              } else {
                setErr(true);
                sfx.wrong();
              }
            }}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              placeholder="Kata sandi guru"
              autoComplete="off"
              className={cn(
                "w-full rounded-2xl border-2 p-3.5 text-lg font-bold focus:outline-none",
                err ? "anim-shake border-rose-400 bg-rose-50" : "border-slate-200 focus:border-indigo-400",
              )}
            />
            {err && <p className="text-sm font-black text-rose-600">Kata sandi belum tepat. Silakan coba lagi.</p>}
            <Button type="submit" variant="sky" className="w-full">
              🔓 Masuk Mode Guru
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => go("beranda")}>
              ← Kembali ke mode siswa
            </Button>
          </form>
        </Card>
      </div>
    );

  const latihanSelesai = Object.keys(data.latihan).length;
  const rata =
    data.quiz.length > 0
      ? Math.round(data.quiz.reduce((a, b) => a + b.score, 0) / data.quiz.length)
      : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] bg-gradient-to-br from-indigo-700 via-violet-700 to-indigo-900 p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.25em] text-indigo-200">
              WAH OFFICIAL · PANEL PENDIDIK
            </p>
            <h1 className="text-2xl font-black sm:text-4xl">🧑‍🏫 Mode Guru</h1>
            <p className="font-bold text-indigo-100">
              Laporan belajar siswa — Jelajah Sistem Peredaran Darah Manusia 3D
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => window.print()}>
              🖨️ Cetak Laporan
            </Button>
            <Button variant="ghost" onClick={() => setMasuk(false)}>
              🔒 Keluar
            </Button>
          </div>
        </div>
      </div>

      <PageTitle icon="📊" title="Ringkasan Siswa" subtitle="Data tersimpan di perangkat ini (localStorage)." />

      <Card className="border-2 border-sky-200 bg-sky-50/60">
        <h2 className="text-lg font-black text-slate-800">🖼️ Logo asli WAH Official</h2>
        <p className="mb-3 text-sm font-semibold text-slate-600">
          Unggah berkas logo asli (PNG/JPG/WebP/SVG). Gambar disimpan dan ditampilkan apa adanya —
          tanpa digambar ulang, dipotong, diubah warna, atau dikompresi.
        </p>
        <LogoUploader />
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="🧑‍🎓" label="Nama siswa" value={data.name || "-"} color="bg-indigo-50 text-indigo-600" />
        <Stat icon="🏅" label="Level" value={`${level.id} · ${level.title}`} color="bg-amber-50 text-amber-600" />
        <Stat icon="⚡" label="Total XP" value={data.xp.toLocaleString("id-ID")} color="bg-rose-50 text-rose-600" />
        <Stat icon="📈" label="Progres total" value={`${progress.total}%`} color="bg-emerald-50 text-emerald-600" />
      </div>

      <Card>
        <p className="mb-3 text-lg font-black text-slate-800">📚 Ketuntasan per Aktivitas</p>
        <div className="space-y-3">
          {[
            { l: "Materi dibaca", v: progress.materi, d: `${data.materiRead.length} dari ${MATERI.length} bab` },
            { l: "Eksplorasi 3D", v: progress.eksplorasi, d: `${data.explored.length} bagian ditemukan` },
            { l: "Simulasi peredaran darah", v: progress.simulasi, d: data.simDone ? "Sudah menonton 1 putaran penuh" : "Belum diselesaikan" },
            { l: "Misi penjelajah", v: progress.misi, d: `${data.missions.length} dari ${MISSIONS.length} misi` },
            { l: "Latihan interaktif", v: progress.latihan, d: `${latihanSelesai} dari 6 aktivitas` },
            { l: "Kuis", v: progress.kuis, d: `${data.quiz.length} percobaan · nilai terbaik ${bestQuiz || 0}` },
          ].map((r) => (
            <div key={r.l}>
              <div className="flex justify-between">
                <p className="text-sm font-black text-slate-700">{r.l}</p>
                <p className="text-sm font-black text-slate-500">{r.v}%</p>
              </div>
              <ProgressBar value={r.v} className="mt-1" color="from-indigo-400 to-violet-500" />
              <p className="mt-0.5 text-[11px] font-bold text-slate-400">{r.d}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-3 text-lg font-black text-slate-800">🏆 Riwayat Kuis</p>
          {data.quiz.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
              Siswa belum mengerjakan kuis.
            </p>
          ) : (
            <>
              <div className="mb-2 flex gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                  Nilai terbaik: {bestQuiz}
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
                  Rata-rata: {rata}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="rounded-l-xl px-3 py-2 font-black">Tanggal</th>
                      <th className="px-3 py-2 font-black">Nilai</th>
                      <th className="px-3 py-2 font-black">Benar</th>
                      <th className="px-3 py-2 font-black">Salah</th>
                      <th className="rounded-r-xl px-3 py-2 font-black">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.quiz.map((q, i) => (
                      <tr key={i} className={i % 2 ? "bg-slate-50" : ""}>
                        <td className="px-3 py-2 font-semibold">
                          {new Date(q.date).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                        </td>
                        <td className="px-3 py-2 font-black text-slate-800">{q.score}</td>
                        <td className="px-3 py-2 font-bold text-emerald-700">{q.correct}</td>
                        <td className="px-3 py-2 font-bold text-rose-700">{q.wrong}</td>
                        <td className="px-3 py-2 font-semibold">
                          {Math.floor(q.timeSec / 60)}m {q.timeSec % 60}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] font-bold text-slate-400">
                Jumlah butir soal kuis: {KUIS.length} (pilihan ganda, benar/salah, dan soal cerita).
              </p>
            </>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="mb-2 text-lg font-black text-slate-800">🎯 Misi & Badge</p>
            <div className="space-y-1.5">
              {MISSIONS.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm font-bold text-slate-700">
                    {m.icon} {m.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-black",
                      data.missions.includes(m.id)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500",
                    )}
                  >
                    {data.missions.includes(m.id) ? "Selesai" : "Belum"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {BADGES.map((b) => (
                <span
                  key={b.id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-black",
                    data.badges.includes(b.id)
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          </Card>

          <Card className="border-2 border-amber-200 bg-amber-50/60">
            <p className="text-lg font-black text-slate-800">⚙️ Pengaturan</p>
            <p className="mb-3 text-sm font-semibold text-slate-600">
              Atur identitas siswa atau mulai ulang data pembelajaran.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={namaBaru}
                onChange={(e) => setNamaBaru(e.target.value)}
                placeholder="Nama siswa baru"
                className="min-w-[180px] flex-1 rounded-2xl border-2 border-slate-200 p-3 font-bold focus:border-indigo-400 focus:outline-none"
              />
              <Button
                variant="sky"
                onClick={() => {
                  if (namaBaru.trim()) {
                    setName(namaBaru, data.avatar);
                    setNamaBaru("");
                  }
                }}
              >
                Simpan Nama
              </Button>
              <Button variant="danger" onClick={() => setKonfirmasi(true)}>
                🗑️ Reset Progress
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-800 text-white">
            <p className="text-sm font-black">📝 Catatan Pedagogis</p>
            <ul className="mt-1.5 space-y-1 text-xs font-bold text-white/80">
              <li>• Materi disusun sesuai capaian pembelajaran IPAS Fase C.</li>
              <li>• Gunakan Eksplorasi 3D untuk pembelajaran visual & kinestetik.</li>
              <li>• Simulasi cocok untuk diskusi kelas menggunakan proyektor.</li>
              <li>• Kuis memuat soal mudah, sedang, dan HOTS sederhana.</li>
            </ul>
          </Card>
        </div>
      </div>

      <Modal open={konfirmasi} onClose={() => setKonfirmasi(false)}>
        <p className="text-xl font-black text-slate-800">Reset seluruh progress?</p>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Semua XP, badge, misi, dan nilai kuis akan dihapus dari perangkat ini. Nama siswa tetap
          disimpan. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="danger"
            onClick={() => {
              resetAll();
              setKonfirmasi(false);
            }}
          >
            Ya, reset sekarang
          </Button>
          <Button variant="secondary" onClick={() => setKonfirmasi(false)}>
            Batal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
