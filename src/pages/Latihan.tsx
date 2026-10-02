import { useMemo, useState, type ReactNode } from "react";
import { Button, Card, Feedback, PageTitle, ProgressBar } from "@/components/ui";
import Ilustrasi from "@/components/Ilustrasi";
import { GuideBubble } from "@/components/Avatar";
import {
  DRAG_ITEMS,
  DROP_TARGETS,
  IDENT_SOAL,
  LAT_BS,
  LAT_PG,
  MATCH_PAIRS,
  URUTAN_BESAR,
  URUTAN_KECIL,
} from "@/data/questions";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";

const AKT = [
  { id: "pg", icon: "🔤", judul: "Pilihan Ganda", teks: "5 soal pilihan ganda bergambar.", warna: "from-sky-400 to-blue-600" },
  { id: "bs", icon: "⚖️", judul: "Benar atau Salah", teks: "5 pernyataan, tentukan benar/salah.", warna: "from-emerald-400 to-teal-600" },
  { id: "drag", icon: "🖐️", judul: "Pasangkan Organ", teks: "Seret nama organ ke tempat yang tepat.", warna: "from-rose-400 to-red-600" },
  { id: "match", icon: "🔗", judul: "Mencocokkan", teks: "Cocokkan bagian darah dengan fungsinya.", warna: "from-amber-400 to-orange-600" },
  { id: "urut", icon: "🧩", judul: "Urutkan Perjalanan Darah", teks: "Susun kartu perjalanan darah.", warna: "from-violet-400 to-purple-600" },
  { id: "ident", icon: "🔍", judul: "Identifikasi Gambar", teks: "Kenali gambar organ & sel darah.", warna: "from-fuchsia-400 to-pink-600" },
] as const;

function Wrap({
  judul,
  ikon,
  onBack,
  children,
  info,
}: {
  judul: string;
  ikon: string;
  onBack: () => void;
  children: ReactNode;
  info?: string;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="press text-sm font-black text-rose-600">
        ← Kembali ke daftar latihan
      </button>
      <PageTitle icon={ikon} title={judul} subtitle={info} />
      {children}
    </div>
  );
}

function Selesai({
  benar,
  total,
  onUlang,
  onBack,
}: {
  benar: number;
  total: number;
  onUlang: () => void;
  onBack: () => void;
}) {
  const persen = Math.round((benar / total) * 100);
  return (
    <Card className="anim-pop text-center">
      <p className="text-6xl">{persen >= 80 ? "🏆" : persen >= 50 ? "😃" : "💪"}</p>
      <p className="mt-2 text-2xl font-black text-slate-800">
        Benar {benar} dari {total}
      </p>
      <ProgressBar value={persen} showLabel className="mx-auto mt-3 max-w-sm" color="from-emerald-400 to-teal-500" />
      <p className="mt-3 font-bold text-slate-600">
        {persen >= 80
          ? "Luar biasa! Pemahamanmu sudah sangat baik."
          : persen >= 50
            ? "Bagus! Yuk ulangi lagi supaya makin mantap."
            : "Jangan menyerah. Pelajari kembali bagian ini dan coba lagi, kamu pasti bisa!"}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onUlang}>
          ↻ Ulangi
        </Button>
        <Button onClick={onBack}>Pilih latihan lain →</Button>
      </div>
    </Card>
  );
}

/* ================= 1. PILIHAN GANDA ================= */
function LatPG({ onBack, onDone }: { onBack: () => void; onDone: (b: number, t: number) => void }) {
  const [i, setI] = useState(0);
  const [pilih, setPilih] = useState<number | null>(null);
  const [benar, setBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const s = LAT_PG[i];

  if (selesai)
    return (
      <Wrap judul="Pilihan Ganda" ikon="🔤" onBack={onBack}>
        <Selesai
          benar={benar}
          total={LAT_PG.length}
          onBack={onBack}
          onUlang={() => {
            setI(0);
            setBenar(0);
            setPilih(null);
            setSelesai(false);
          }}
        />
      </Wrap>
    );

  const jawab = (idx: number) => {
    if (pilih !== null) return;
    setPilih(idx);
    const ok = idx === s.jawaban;
    if (ok) {
      setBenar((b) => b + 1);
      sfx.correct();
    } else sfx.wrong();
  };

  return (
    <Wrap judul="Pilihan Ganda" ikon="🔤" onBack={onBack} info={`Soal ${i + 1} dari ${LAT_PG.length}`}>
      <ProgressBar value={((i + 1) / LAT_PG.length) * 100} color="from-sky-400 to-blue-500" />
      <Card className="space-y-3">
        <span className="inline-block rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black text-sky-700">
          {s.level}
        </span>
        <p className="text-lg font-black text-slate-800">{s.soal}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {s.opsi.map((o, idx) => {
            const state =
              pilih === null ? "idle" : idx === s.jawaban ? "benar" : idx === pilih ? "salah" : "idle";
            return (
              <button
                key={idx}
                onClick={() => jawab(idx)}
                className={cn(
                  "press flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left text-[15px] font-bold transition-all",
                  state === "idle" && "border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50",
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
        {pilih !== null && (
          <>
            <Feedback status={pilih === s.jawaban ? "benar" : "salah"} text={s.bahas} />
            <Button
              onClick={() => {
                if (i + 1 >= LAT_PG.length) {
                  setSelesai(true);
                  onDone(benar, LAT_PG.length);
                } else {
                  setI(i + 1);
                  setPilih(null);
                }
              }}
            >
              {i + 1 >= LAT_PG.length ? "Lihat hasil →" : "Soal berikutnya →"}
            </Button>
          </>
        )}
      </Card>
    </Wrap>
  );
}

/* ================= 2. BENAR / SALAH ================= */
function LatBS({ onBack, onDone }: { onBack: () => void; onDone: (b: number, t: number) => void }) {
  const [i, setI] = useState(0);
  const [pilih, setPilih] = useState<boolean | null>(null);
  const [benar, setBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const s = LAT_BS[i];

  if (selesai)
    return (
      <Wrap judul="Benar atau Salah" ikon="⚖️" onBack={onBack}>
        <Selesai
          benar={benar}
          total={LAT_BS.length}
          onBack={onBack}
          onUlang={() => {
            setI(0);
            setBenar(0);
            setPilih(null);
            setSelesai(false);
          }}
        />
      </Wrap>
    );

  const jawab = (v: boolean) => {
    if (pilih !== null) return;
    setPilih(v);
    if (v === s.jawaban) {
      setBenar((b) => b + 1);
      sfx.correct();
    } else sfx.wrong();
  };

  return (
    <Wrap judul="Benar atau Salah" ikon="⚖️" onBack={onBack} info={`Soal ${i + 1} dari ${LAT_BS.length}`}>
      <ProgressBar value={((i + 1) / LAT_BS.length) * 100} color="from-emerald-400 to-teal-500" />
      <Card className="space-y-4">
        <p className="text-lg font-black text-slate-800">{s.soal}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => jawab(true)}
            disabled={pilih !== null}
            className={cn(
              "press rounded-2xl border-4 p-5 text-xl font-black transition-all",
              pilih === null
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400"
                : s.jawaban === true
                  ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                  : pilih === true
                    ? "anim-shake border-rose-400 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-slate-50 text-slate-400",
            )}
          >
            ✔️ BENAR
          </button>
          <button
            onClick={() => jawab(false)}
            disabled={pilih !== null}
            className={cn(
              "press rounded-2xl border-4 p-5 text-xl font-black transition-all",
              pilih === null
                ? "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400"
                : s.jawaban === false
                  ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                  : pilih === false
                    ? "anim-shake border-rose-400 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-slate-50 text-slate-400",
            )}
          >
            ❌ SALAH
          </button>
        </div>
        {pilih !== null && (
          <>
            <Feedback status={pilih === s.jawaban ? "benar" : "salah"} text={s.bahas} />
            <Button
              onClick={() => {
                if (i + 1 >= LAT_BS.length) {
                  setSelesai(true);
                  onDone(benar, LAT_BS.length);
                } else {
                  setI(i + 1);
                  setPilih(null);
                }
              }}
            >
              {i + 1 >= LAT_BS.length ? "Lihat hasil →" : "Soal berikutnya →"}
            </Button>
          </>
        )}
      </Card>
    </Wrap>
  );
}

/* ================= 3. DRAG & DROP ================= */
function LatDrag({ onBack, onDone }: { onBack: () => void; onDone: (b: number, t: number) => void }) {
  const [isi, setIsi] = useState<Record<string, string>>({});
  const [ambil, setAmbil] = useState<string | null>(null);
  const [fb, setFb] = useState<{ s: "benar" | "salah"; t: string } | null>(null);
  const [salahCount, setSalahCount] = useState(0);

  const taruh = (targetId: string, nama: string) => {
    const t = DROP_TARGETS.find((x) => x.id === targetId)!;
    if (isi[targetId]) return;
    if (t.benar === nama) {
      setIsi((p) => ({ ...p, [targetId]: nama }));
      setFb({ s: "benar", t: t.feedback });
      sfx.correct();
      if (Object.keys(isi).length + 1 === DROP_TARGETS.length)
        onDone(DROP_TARGETS.length, DROP_TARGETS.length);
    } else {
      setSalahCount((c) => c + 1);
      setFb({
        s: "salah",
        t:
          salahCount >= 2
            ? "Jangan menyerah. Baca lagi petunjuk pada kotaknya, lalu coba pasangkan kembali."
            : "Coba lagi. Perhatikan bentuk dan fungsi organ pada kotak tersebut.",
      });
      sfx.wrong();
    }
    setAmbil(null);
  };

  const benar = Object.keys(isi).length;
  const tuntas = benar === DROP_TARGETS.length;

  return (
    <Wrap
      judul="Pasangkan Organ"
      ikon="🖐️"
      onBack={onBack}
      info="Seret kartu nama ke kotak yang sesuai, atau ketuk kartu lalu ketuk kotaknya."
    >
      <ProgressBar value={(benar / DROP_TARGETS.length) * 100} color="from-rose-400 to-red-500" showLabel />

      <Card>
        <p className="mb-2 text-sm font-black text-slate-500">KARTU NAMA</p>
        <div className="flex flex-wrap gap-2">
          {DRAG_ITEMS.map((n) => {
            const terpakai = Object.values(isi).includes(n);
            return (
              <button
                key={n}
                draggable={!terpakai}
                onDragStart={() => setAmbil(n)}
                onClick={() => {
                  if (!terpakai) {
                    sfx.click();
                    setAmbil(ambil === n ? null : n);
                  }
                }}
                disabled={terpakai}
                className={cn(
                  "press rounded-2xl border-2 px-4 py-3 text-sm font-black transition-all",
                  terpakai
                    ? "border-emerald-200 bg-emerald-50 text-emerald-400 line-through"
                    : ambil === n
                      ? "scale-105 border-rose-500 bg-rose-500 text-white shadow-lg"
                      : "cursor-grab border-slate-200 bg-white text-slate-700 hover:border-rose-400",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DROP_TARGETS.map((t) => {
          const filled = isi[t.id];
          return (
            <div
              key={t.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => ambil && taruh(t.id, ambil)}
              onClick={() => ambil && taruh(t.id, ambil)}
              className={cn(
                "rounded-3xl border-4 border-dashed p-4 text-center transition-all",
                filled
                  ? "border-emerald-400 bg-emerald-50"
                  : ambil
                    ? "cursor-pointer border-rose-400 bg-rose-50/60 hover:scale-[1.02]"
                    : "border-slate-200 bg-white",
              )}
            >
              <p className="text-4xl">{t.ikon}</p>
              <p className="mt-1 font-black text-slate-800">{t.nama}</p>
              <p className="text-xs font-bold text-slate-500">{t.deskripsi}</p>
              <div
                className={cn(
                  "mt-3 rounded-xl py-2 text-sm font-black",
                  filled ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400",
                )}
              >
                {filled ?? "letakkan di sini"}
              </div>
            </div>
          );
        })}
      </div>

      {fb && <Feedback status={fb.s} text={fb.t} />}

      {tuntas && (
        <Selesai
          benar={DROP_TARGETS.length}
          total={DROP_TARGETS.length}
          onBack={onBack}
          onUlang={() => {
            setIsi({});
            setFb(null);
          }}
        />
      )}
    </Wrap>
  );
}

/* ================= 4. MENCOCOKKAN ================= */
function LatMatch({ onBack, onDone }: { onBack: () => void; onDone: (b: number, t: number) => void }) {
  const kanan = useMemo(() => [...MATCH_PAIRS].sort(() => Math.random() - 0.5), []);
  const [kiriPilih, setKiriPilih] = useState<string | null>(null);
  const [cocok, setCocok] = useState<string[]>([]);
  const [fb, setFb] = useState<{ s: "benar" | "salah"; t: string } | null>(null);

  const klikKanan = (id: string) => {
    if (!kiriPilih) {
      setFb({ s: "salah", t: "Pilih dulu kartu di kolom kiri, ya!" });
      return;
    }
    if (kiriPilih === id) {
      setCocok((c) => [...c, id]);
      setFb({ s: "benar", t: "Pasangan yang tepat! Jawabanmu benar." });
      sfx.correct();
      if (cocok.length + 1 === MATCH_PAIRS.length) onDone(MATCH_PAIRS.length, MATCH_PAIRS.length);
    } else {
      setFb({ s: "salah", t: "Belum tepat. Yuk coba pahami kembali materinya." });
      sfx.wrong();
    }
    setKiriPilih(null);
  };

  const tuntas = cocok.length === MATCH_PAIRS.length;

  return (
    <Wrap judul="Mencocokkan" ikon="🔗" onBack={onBack} info="Ketuk kartu kiri, lalu ketuk pasangannya di kanan.">
      <ProgressBar value={(cocok.length / MATCH_PAIRS.length) * 100} showLabel color="from-amber-400 to-orange-500" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="mb-2 text-sm font-black text-slate-500">BAGIAN</p>
          <div className="space-y-2">
            {MATCH_PAIRS.map((p) => {
              const done = cocok.includes(p.id);
              return (
                <button
                  key={p.id}
                  disabled={done}
                  onClick={() => {
                    sfx.click();
                    setKiriPilih(p.id);
                  }}
                  className={cn(
                    "press flex w-full items-center gap-2 rounded-2xl border-2 p-3 text-left font-black transition-all",
                    done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                      : kiriPilih === p.id
                        ? "border-amber-500 bg-amber-400 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-amber-400",
                  )}
                >
                  <span className="text-xl">{p.ikon}</span> {p.kiri} {done && "✓"}
                </button>
              );
            })}
          </div>
        </Card>
        <Card>
          <p className="mb-2 text-sm font-black text-slate-500">FUNGSI</p>
          <div className="space-y-2">
            {kanan.map((p) => {
              const done = cocok.includes(p.id);
              return (
                <button
                  key={p.id}
                  disabled={done}
                  onClick={() => klikKanan(p.id)}
                  className={cn(
                    "press w-full rounded-2xl border-2 p-3 text-left text-sm font-bold transition-all",
                    done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                      : "border-slate-200 bg-white text-slate-700 hover:border-amber-400",
                  )}
                >
                  {p.kanan} {done && "✓"}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      {fb && <Feedback status={fb.s} text={fb.t} />}
      {tuntas && (
        <Selesai
          benar={MATCH_PAIRS.length}
          total={MATCH_PAIRS.length}
          onBack={onBack}
          onUlang={() => {
            setCocok([]);
            setFb(null);
          }}
        />
      )}
    </Wrap>
  );
}

/* ================= 5. MENGURUTKAN ================= */
function LatUrut({ onBack, onDone }: { onBack: () => void; onDone: (b: number, t: number) => void }) {
  const [jenis, setJenis] = useState<"besar" | "kecil">("besar");
  const data = jenis === "besar" ? URUTAN_BESAR : URUTAN_KECIL;
  const [acak, setAcak] = useState(() => [...data].sort(() => Math.random() - 0.5));
  const [susun, setSusun] = useState<typeof data>([]);
  const [fb, setFb] = useState<{ s: "benar" | "salah"; t: string } | null>(null);
  const { completeMission, awardBadge } = useProgress();
  const { go } = useNav();

  const reset = (j: "besar" | "kecil") => {
    const d = j === "besar" ? URUTAN_BESAR : URUTAN_KECIL;
    setJenis(j);
    setAcak([...d].sort(() => Math.random() - 0.5));
    setSusun([]);
    setFb(null);
  };

  const pilih = (id: string) => {
    const item = acak.find((a) => a.id === id)!;
    const idxBenar = data.findIndex((d) => d.id === id);
    if (idxBenar === susun.length) {
      setSusun((s) => [...s, item]);
      setAcak((a) => a.filter((x) => x.id !== id));
      sfx.correct();
      setFb({ s: "benar", t: "Tepat! Lanjutkan urutannya." });
      if (susun.length + 1 === data.length) {
        completeMission("misi-urutan");
        awardBadge("pelari-oksigen");
        onDone(data.length, data.length);
      }
    } else {
      sfx.wrong();
      setFb({
        s: "salah",
        t: "Belum tepat. Ingat, darah selalu dipompa dari bilik lalu kembali ke serambi.",
      });
    }
  };

  const tuntas = susun.length === data.length;

  return (
    <Wrap
      judul="Urutkan Perjalanan Darah"
      ikon="🧩"
      onBack={onBack}
      info="Ketuk kartu sesuai urutan perjalanan darah yang benar."
    >
      <div className="flex flex-wrap gap-2">
        {(["besar", "kecil"] as const).map((j) => (
          <button
            key={j}
            onClick={() => reset(j)}
            className={cn(
              "press rounded-2xl border-2 px-4 py-2.5 text-sm font-black",
              jenis === j
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300",
            )}
          >
            {j === "besar" ? "🏃 Peredaran Darah Besar" : "🫁 Peredaran Darah Kecil"}
          </button>
        ))}
      </div>

      <Card className="space-y-3">
        <p className="text-sm font-black text-slate-500">URUTAN YANG KAMU SUSUN</p>
        <div className="flex min-h-[90px] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/60 p-3">
          {susun.length === 0 && (
            <p className="text-sm font-bold text-slate-400">Belum ada kartu. Mulai dari langkah pertama!</p>
          )}
          {susun.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className="anim-pop rounded-2xl bg-violet-600 px-3 py-2 text-center text-white shadow">
                <p className="text-xl">{s.ikon}</p>
                <p className="text-[11px] font-black">{s.label}</p>
              </div>
              {i < susun.length - 1 && <span className="font-black text-violet-500">➜</span>}
            </div>
          ))}
        </div>

        <p className="text-sm font-black text-slate-500">PILIH KARTU BERIKUTNYA</p>
        <div className="flex flex-wrap gap-2">
          {acak.map((a) => (
            <button
              key={a.id}
              onClick={() => pilih(a.id)}
              className="press rounded-2xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-center hover:border-violet-400"
            >
              <p className="text-2xl">{a.ikon}</p>
              <p className="text-xs font-black text-slate-700">{a.label}</p>
            </button>
          ))}
        </div>

        {fb && <Feedback status={fb.s} text={fb.t} />}

        {tuntas && (
          <div className="anim-pop rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-center text-white">
            <p className="text-5xl">🎉</p>
            <p className="text-xl font-black">Urutan benar semua!</p>
            <p className="font-bold text-white/85">
              {jenis === "besar"
                ? "Itulah peredaran darah besar: jantung → seluruh tubuh → jantung."
                : "Itulah peredaran darah kecil: jantung → paru-paru → jantung."}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button variant="amber" onClick={() => go("simulasi")}>
                🩸 Lihat animasinya di Simulasi
              </Button>
              <Button variant="secondary" onClick={() => reset(jenis === "besar" ? "kecil" : "besar")}>
                Coba jalur yang lain →
              </Button>
            </div>
          </div>
        )}
      </Card>
    </Wrap>
  );
}

/* ================= 6. IDENTIFIKASI GAMBAR ================= */
function LatIdent({ onBack, onDone }: { onBack: () => void; onDone: (b: number, t: number) => void }) {
  const [i, setI] = useState(0);
  const [pilih, setPilih] = useState<number | null>(null);
  const [benar, setBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const s = IDENT_SOAL[i];

  if (selesai)
    return (
      <Wrap judul="Identifikasi Gambar" ikon="🔍" onBack={onBack}>
        <Selesai
          benar={benar}
          total={IDENT_SOAL.length}
          onBack={onBack}
          onUlang={() => {
            setI(0);
            setBenar(0);
            setPilih(null);
            setSelesai(false);
          }}
        />
      </Wrap>
    );

  return (
    <Wrap judul="Identifikasi Gambar" ikon="🔍" onBack={onBack} info={`Gambar ${i + 1} dari ${IDENT_SOAL.length}`}>
      <ProgressBar value={((i + 1) / IDENT_SOAL.length) * 100} color="from-fuchsia-400 to-pink-500" />
      <Card className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div className="flex items-center justify-center rounded-3xl bg-slate-50 p-3">
          <Ilustrasi jenis={s.gambar} size={170} />
        </div>
        <div className="space-y-3">
          <p className="text-lg font-black text-slate-800">{s.pertanyaan}</p>
          <div className="grid gap-2">
            {s.opsi.map((o, idx) => {
              const state =
                pilih === null ? "idle" : idx === s.jawaban ? "benar" : idx === pilih ? "salah" : "idle";
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (pilih !== null) return;
                    setPilih(idx);
                    if (idx === s.jawaban) {
                      setBenar((b) => b + 1);
                      sfx.correct();
                    } else sfx.wrong();
                  }}
                  className={cn(
                    "press rounded-2xl border-2 p-3 text-left font-bold transition-all",
                    state === "idle" && "border-slate-200 bg-white hover:border-fuchsia-400",
                    state === "benar" && "border-emerald-400 bg-emerald-50 text-emerald-800",
                    state === "salah" && "anim-shake border-rose-400 bg-rose-50 text-rose-800",
                  )}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {pilih !== null && (
            <>
              <Feedback status={pilih === s.jawaban ? "benar" : "salah"} text={s.bahas} />
              <Button
                onClick={() => {
                  if (i + 1 >= IDENT_SOAL.length) {
                    setSelesai(true);
                    onDone(benar, IDENT_SOAL.length);
                  } else {
                    setI(i + 1);
                    setPilih(null);
                  }
                }}
              >
                {i + 1 >= IDENT_SOAL.length ? "Lihat hasil →" : "Gambar berikutnya →"}
              </Button>
            </>
          )}
        </div>
      </Card>
    </Wrap>
  );
}

/* ================= HALAMAN UTAMA LATIHAN ================= */
export default function Latihan() {
  const [aktif, setAktif] = useState<string | null>(null);
  const { data, saveLatihan, addXp, awardBadge, progress } = useProgress();

  const selesaiAktivitas = (id: string) => (b: number, t: number) => {
    saveLatihan(id, b, t);
    addXp(b * 10, "Latihan selesai");
    const total = Object.keys({ ...data.latihan, [id]: 1 }).length;
    if (total >= 6) awardBadge("ilmuwan-cilik");
  };

  const back = () => setAktif(null);

  if (aktif === "pg") return <LatPG onBack={back} onDone={selesaiAktivitas("pg")} />;
  if (aktif === "bs") return <LatBS onBack={back} onDone={selesaiAktivitas("bs")} />;
  if (aktif === "drag") return <LatDrag onBack={back} onDone={selesaiAktivitas("drag")} />;
  if (aktif === "match") return <LatMatch onBack={back} onDone={selesaiAktivitas("match")} />;
  if (aktif === "urut") return <LatUrut onBack={back} onDone={selesaiAktivitas("urut")} />;
  if (aktif === "ident") return <LatIdent onBack={back} onDone={selesaiAktivitas("ident")} />;

  return (
    <div className="space-y-4">
      <PageTitle
        icon="📝"
        title="Latihan Interaktif"
        subtitle="Enam jenis aktivitas seru untuk menguatkan pemahamanmu."
        right={
          <div className="min-w-[180px]">
            <p className="text-xs font-black text-slate-500">
              {Object.keys(data.latihan).length}/6 AKTIVITAS DICOBA
            </p>
            <ProgressBar value={progress.latihan} showLabel color="from-emerald-400 to-teal-500" className="mt-1" />
          </div>
        }
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-white">
        <GuideBubble
          type="putra"
          text="Tidak apa-apa kalau salah. Setiap jawaban salah adalah kesempatan belajar!"
        />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {AKT.map((a) => {
          const hasil = data.latihan[a.id];
          return (
            <button key={a.id} onClick={() => setAktif(a.id)} className="text-left">
              <Card hover className="h-full">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${a.warna} text-3xl shadow-lg`}>
                  {a.icon}
                </div>
                <p className="text-lg font-black text-slate-800">{a.judul}</p>
                <p className="text-sm font-semibold text-slate-500">{a.teks}</p>
                {hasil ? (
                  <p className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                    ✓ Nilai terbaik: {hasil.best}/{hasil.total}
                  </p>
                ) : (
                  <p className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
                    Belum dikerjakan
                  </p>
                )}
                <p className="mt-3 text-sm font-black text-rose-600">Mulai latihan →</p>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
