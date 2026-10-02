import { useEffect, useState } from "react";
import { Button, Card, PageTitle, ProgressBar } from "@/components/ui";
import { MATERI, type MateriBlok } from "@/data/content";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { GuideBubble } from "@/components/Avatar";
import HeartHero from "@/components/HeartHero";
import { cn } from "@/utils/cn";
import { MATERI_IMG } from "@/assets/images";

const MATERI_IMAGES = MATERI_IMG;

function Blok({ b }: { b: MateriBlok }) {
  switch (b.tipe) {
    case "paragraf":
      return <p className="text-[15px] leading-relaxed font-semibold text-slate-700">{b.teks}</p>;

    case "poin":
      return (
        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/70 p-4">
          {b.judul && <p className="mb-2 text-base font-black text-slate-800">{b.judul}</p>}
          <ul className="space-y-2">
            {b.items.map((it, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-xs font-black text-white">
                  {i + 1}
                </span>
                <span className="text-[15px] font-semibold text-slate-700">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "kartu":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {b.items.map((k) => (
            <div
              key={k.judul}
              className="card-3d rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm hover:shadow-lg"
            >
              <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${k.warna} text-2xl shadow`}>
                {k.ikon}
              </div>
              <p className="font-black text-slate-800">{k.judul}</p>
              <p className="text-sm font-semibold text-slate-600">{k.teks}</p>
            </div>
          ))}
        </div>
      );

    case "alur":
      return (
        <div className="flex flex-wrap items-stretch gap-2 rounded-2xl bg-gradient-to-r from-rose-50 to-sky-50 p-3">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="min-w-[120px] rounded-2xl border-2 border-white bg-white px-3 py-2 text-center shadow-sm">
                <p className="text-2xl">{it.ikon}</p>
                <p className="text-xs font-black text-slate-700">{it.label}</p>
              </div>
              {i < b.items.length - 1 && <span className="text-xl font-black text-rose-400">➜</span>}
            </div>
          ))}
        </div>
      );

    case "catatan":
      return (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <span className="text-2xl">{b.ikon}</span>
          <p className="text-[15px] font-bold text-amber-900">{b.teks}</p>
        </div>
      );

    case "bandingkan":
      return (
        <div className="overflow-x-auto rounded-2xl border-2 border-slate-100">
          <table className="w-full min-w-[460px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-800 text-white">
                {b.kolom.map((k) => (
                  <th key={k} className="px-3 py-2.5 text-sm font-black">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.baris.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                  {r.map((c, j) => (
                    <td
                      key={j}
                      className={cn(
                        "px-3 py-2.5 text-sm font-semibold text-slate-700",
                        j === 0 && "font-black text-slate-800",
                        j === 1 && "text-rose-700",
                        j === 2 && "text-sky-700",
                      )}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function Materi() {
  const { data, markMateri, progress } = useProgress();
  const { payload, clearPayload, go } = useNav();
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (payload) {
      const i = MATERI.findIndex((m) => m.id === payload);
      if (i >= 0) setIdx(i);
      clearPayload();
    }
  }, [payload, clearPayload]);

  if (idx === null) {
    return (
      <div className="space-y-5">
        <PageTitle
          icon="📚"
          title="Materi Pembelajaran"
          subtitle="Pilih bab yang ingin kamu pelajari. Setiap bab memberi +25 XP!"
          right={
            <div className="min-w-[180px]">
              <p className="text-xs font-black text-slate-500">
                {data.materiRead.length}/{MATERI.length} BAB SELESAI
              </p>
              <ProgressBar value={progress.materi} showLabel className="mt-1" />
            </div>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MATERI.map((m, i) => {
            const done = data.materiRead.includes(m.id);
            return (
              <button key={m.id} onClick={() => setIdx(i)} className="text-left">
                <Card hover className="relative h-full overflow-hidden p-0">
                  <div className="relative h-40 overflow-hidden bg-sky-100">
                    <img
                      src={MATERI_IMAGES[m.id]}
                      alt={`Ilustrasi animasi 3D: ${m.judul}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  {done && (
                    <span className="absolute top-3 right-3 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                      ✓ Selesai
                    </span>
                  )}
                  <div className="p-5">
                    <p className="text-[11px] font-black tracking-widest text-rose-500">{m.ikon} BAB {m.nomor}</p>
                    <p className="mt-1 text-lg leading-tight font-black text-slate-800">{m.judul}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{m.ringkas}</p>
                    <p className="mt-3 text-sm font-black text-rose-600">Baca materi →</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const m = MATERI[idx];
  const done = data.materiRead.includes(m.id);

  return (
    <div className="space-y-4">
      <button onClick={() => setIdx(null)} className="press text-sm font-black text-rose-600">
        ← Kembali ke daftar materi
      </button>

      <div className="relative isolate flex min-h-[250px] items-end overflow-hidden rounded-[2rem] bg-[#0a1b35] p-5 text-white shadow-xl sm:p-7">
        <img
          src={MATERI_IMAGES[m.id]}
          alt={`Ilustrasi animasi 3D: ${m.judul}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06152b]/95 via-[#06152b]/80 to-transparent" />
        <div className="relative max-w-2xl">
          <p className="text-[11px] font-black tracking-[0.25em] text-sky-200">{m.ikon} BAB {m.nomor}</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">{m.judul}</h1>
          <p className="mt-1 font-bold text-white/90">{m.ringkas}</p>
        </div>
      </div>

      <Card className="space-y-4">
        {m.id === "jantung" && (
          <div>
            <p className="mb-2 text-sm font-black text-slate-700">🫀 Lihat jantung berdetak dalam 3D</p>
            <HeartHero height={300} />
          </div>
        )}
        {m.blok.map((b, i) => (
          <Blok key={i} b={b} />
        ))}

        <div className="flex items-start gap-3 rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
          <span className="text-2xl">🤯</span>
          <div>
            <p className="font-black text-violet-800">Tahukah kamu?</p>
            <p className="text-sm font-bold text-violet-700">{m.faktaSeru}</p>
          </div>
        </div>

        <GuideBubble
          type="putri"
          text={done ? "Bab ini sudah kamu selesaikan. Hebat!" : "Sudah paham? Tekan tombol Selesai Dibaca untuk mendapat XP!"}
        />
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          ← Bab sebelumnya
        </Button>
        {!done ? (
          <Button variant="success" onClick={() => markMateri(m.id)}>
            ✅ Selesai Dibaca (+25 XP)
          </Button>
        ) : (
          <span className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-700">
            ✓ Sudah dipelajari
          </span>
        )}
        {idx < MATERI.length - 1 ? (
          <Button onClick={() => setIdx(idx + 1)}>Bab selanjutnya →</Button>
        ) : (
          <Button variant="sky" onClick={() => go("eksplorasi")}>
            🫀 Lanjut Eksplorasi 3D →
          </Button>
        )}
      </div>
    </div>
  );
}
