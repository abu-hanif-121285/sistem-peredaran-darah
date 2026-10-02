import { useEffect, useState } from "react";
import { Button } from "./ui";
import Avatar from "./Avatar";
import { useProgress } from "@/store/progress";
import { cn } from "@/utils/cn";
import { sfx, unlockAudio } from "@/lib/audio";
import BrandLogo from "./BrandLogo";
import { LogoUploader } from "./LogoUploader";
import { useBrand } from "@/store/brand";
import { IMG } from "@/assets/images";

const PESAN = [
  "Menyiapkan tubuh manusia 3D...",
  "Menyusun jaringan pembuluh darah...",
  "Memompa jantung pertama kali...",
  "Mengisi sel darah merah dengan oksigen...",
  "Hampir siap, bersiaplah menjelajah!",
];

export default function Splash({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  const [tahap, setTahap] = useState<"muat" | "nama">("muat");
  const [nama, setNama] = useState("");
  const [av, setAv] = useState<"putra" | "putri">("putra");
  const { data, setName } = useProgress();
  const { isOriginal } = useBrand();

  useEffect(() => {
    const iv = window.setInterval(() => {
      setP((v) => {
        const next = v + Math.random() * 16 + 6;
        if (next >= 100) {
          window.clearInterval(iv);
          window.setTimeout(() => {
            if (data.name) onDone();
            else setTahap("nama");
          }, 420);
          return 100;
        }
        return next;
      });
    }, 230);
    return () => window.clearInterval(iv);
  }, [data.name, onDone]);

  const pesan = PESAN[Math.min(PESAN.length - 1, Math.floor((p / 100) * PESAN.length))];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_50%_35%,#124b86_0%,#07172d_60%,#030812_100%)] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-rose-400/40"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: 6 + (i % 4) * 4,
              height: 6 + (i % 4) * 4,
              animation: `floaty ${3 + (i % 5)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {tahap === "muat" ? (
        <div className="relative w-full max-w-md text-center">
          <div className="mx-auto flex h-[130px] w-[210px] items-center justify-center sm:h-[150px] sm:w-[250px]">
            <BrandLogo />
          </div>
          <img
            src={IMG.jantungRealistis}
            alt="Ilustrasi realistis jantung manusia"
            className="anim-heart mx-auto mt-3 h-32 w-32 rounded-full object-cover shadow-[0_0_48px_rgba(244,63,94,0.45)] ring-4 ring-white/10"
          />
          <h1 className="text-shadow-soft mt-5 text-3xl leading-tight font-black sm:text-4xl">
            JELAJAH SISTEM
            <br />
            PEREDARAN DARAH
            <br />
            <span className="text-amber-300">MANUSIA 3D</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-white/70">
            Media Pembelajaran IPAS · Fase C Kurikulum Merdeka
          </p>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.min(100, p)}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-black text-white/85">{pesan}</p>
          <p className="text-xs font-bold text-white/50">{Math.min(100, Math.round(p))}%</p>
        </div>
      ) : (
        <div className="anim-pop relative w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-800 shadow-2xl">
          <div className="mx-auto flex h-20 w-36 items-center justify-center">
            <BrandLogo plain />
          </div>
          <h2 className="mt-1 text-center text-2xl font-black">Halo, Penjelajah!</h2>
          <p className="mt-1 text-center text-sm font-semibold text-slate-500">
            Siapa namamu? Namamu akan muncul di dashboard progres.
          </p>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            maxLength={22}
            placeholder="Tulis namamu di sini"
            className="mt-4 w-full rounded-2xl border-2 border-slate-200 p-3.5 text-lg font-bold focus:border-rose-400 focus:outline-none"
          />
          <p className="mt-4 text-center text-sm font-black text-slate-500">Pilih avatarmu</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["putra", "putri"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  sfx.click();
                  setAv(t);
                }}
                className={cn(
                  "press flex flex-col items-center gap-1 rounded-2xl border-2 p-3 font-black transition-all",
                  av === t ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500",
                )}
              >
                <Avatar type={t} size={64} />
                {t === "putra" ? "Putra" : "Putri"}
              </button>
            ))}
          </div>
          {!isOriginal && (
            <details className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-3 text-left">
              <summary className="cursor-pointer text-sm font-black text-sky-800">
                🖼️ Punya berkas logo asli WAH Official? Pasang di sini
              </summary>
              <div className="mt-3">
                <LogoUploader compact />
              </div>
            </details>
          )}
          <Button
            size="lg"
            className="mt-5 w-full"
            onClick={() => {
              unlockAudio();
              setName(nama || "Penjelajah", av);
              sfx.levelUp();
              onDone();
            }}
          >
            🚀 MULAI PETUALANGAN
          </Button>
          <p className="mt-3 text-center text-[11px] font-bold text-slate-400">
            WAH Official — Belajar, Bereksplorasi, dan Bertumbuh.
          </p>
        </div>
      )}
    </div>
  );
}
