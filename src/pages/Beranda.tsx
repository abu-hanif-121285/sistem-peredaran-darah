import { Button, Card, ProgressBar } from "@/components/ui";
import HeartHero from "@/components/HeartHero";
import { Guide } from "@/components/Avatar";
import BrandLogo from "@/components/BrandLogo";
import { IMG } from "@/assets/images";
import { useNav } from "@/store/nav";
import { useProgress } from "@/store/progress";

const FITUR = [
  { icon: "📚", judul: "Materi Bergambar", teks: "6 bab materi lengkap dengan ilustrasi & fakta seru.", route: "materi", warna: "from-sky-400 to-blue-600" },
  { icon: "🫀", judul: "Eksplorasi 3D", teks: "Putar, perbesar, dan klik organ di dalam tubuh.", route: "eksplorasi", warna: "from-rose-400 to-red-600" },
  { icon: "🩸", judul: "Simulasi Darah", teks: "Ikuti perjalanan sel darah keliling tubuhmu.", route: "simulasi", warna: "from-fuchsia-400 to-purple-600" },
  { icon: "🎯", judul: "Misi Penjelajah", teks: "6 misi seru berhadiah XP, bintang, dan badge.", route: "misi", warna: "from-amber-400 to-orange-600" },
  { icon: "📝", judul: "Latihan Interaktif", teks: "Drag & drop, mencocokkan, mengurutkan, dan lainnya.", route: "latihan", warna: "from-emerald-400 to-teal-600" },
  { icon: "🏆", judul: "Kuis 20+ Soal", teks: "Uji pemahamanmu dan dapatkan badge juara.", route: "kuis", warna: "from-indigo-400 to-violet-600" },
] as const;

export default function Beranda() {
  const { go } = useNav();
  const { data, progress, level } = useProgress();

  return (
    <div className="space-y-5">
      {/* HERO */}
      <section className="anim-slide relative isolate min-h-[600px] overflow-hidden rounded-[2rem] bg-[#07172d] text-white shadow-[0_24px_60px_-24px_rgba(7,23,45,0.65)]">
        <img
          src={IMG.heroSirkulasi}
          alt="Visualisasi 3D realistis sistem peredaran darah manusia: jantung, paru-paru, arteri, dan vena"
          fetchPriority="high"
          className="anim-cinema absolute inset-0 h-full w-full object-cover object-[61%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06152b] via-[#06152b]/95 to-[#06152b]/15 sm:via-[#06152b]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06152b]/75 via-transparent to-transparent" />
        <div className="relative flex min-h-[600px] items-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="max-w-[570px]">
            <div className="flex h-[120px] w-[190px] items-center sm:h-[150px] sm:w-[245px]">
              <BrandLogo />
            </div>
            <p className="mt-4 text-xs font-black tracking-[0.28em] text-sky-200 sm:text-sm">
              PETUALANGAN IPAS KELAS 6 · FASE C
            </p>
            <h1 className="text-shadow-soft mt-4 text-3xl leading-[1.1] font-black sm:text-[44px]">
              JELAJAH SISTEM
              <br />
              PEREDARAN DARAH
              <br />
              <span className="text-[#ffcf72]">MANUSIA 3D</span>
            </h1>
            <p className="mt-4 max-w-lg text-base font-bold text-white/90 sm:text-lg">
              Ikuti perjalanan darah dan temukan bagaimana tubuhmu bekerja!
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button variant="amber" size="lg" onClick={() => go("peta")}>
                🚀 MULAI PETUALANGAN
              </Button>
              <Button variant="ghost" size="lg" onClick={() => go("materi")}>
                📚 BELAJAR
              </Button>
              <Button variant="ghost" size="lg" onClick={() => go("eksplorasi")}>
                🫀 JELAJAH 3D
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SAPAAN PEMANDU */}
      <Card className="anim-slide flex flex-wrap items-center gap-4 border-2 border-sky-100 bg-gradient-to-r from-sky-50 to-white">
        <Guide type="putri" size={84} className="anim-float" />
        <div className="min-w-[220px] flex-1">
          <p className="text-xl font-black text-slate-800">
            Halo, {data.name || "Penjelajah"}! 👋
          </p>
          <p className="text-sm font-semibold text-slate-600">
            Aku Hana, pemandumu hari ini. Di dalam tubuhmu ada “jalan raya” sepanjang puluhan ribu
            kilometer. Yuk kita jelajahi bersama lewat peta pembelajaran!
          </p>
          <div className="mt-3 flex max-w-md items-center gap-2">
            <span className="text-xs font-black text-sky-700">{level.icon} Level {level.id}</span>
            <ProgressBar value={progress.total} height="h-2" color="from-sky-400 to-amber-400" className="flex-1" />
            <span className="text-xs font-black text-sky-700">{progress.total}%</span>
          </div>
        </div>
        <Button variant="sky" onClick={() => go("peta")}>
          🗺️ Buka Peta Belajar
        </Button>
      </Card>

      {/* FITUR */}
      <section>
        <h2 className="mb-3 text-xl font-black text-slate-800">Pilih aktivitasmu</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FITUR.map((f) => (
            <button key={f.judul} onClick={() => go(f.route)} className="text-left">
              <Card hover className="h-full">
                <div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.warna} text-3xl shadow-lg`}
                >
                  {f.icon}
                </div>
                <p className="text-lg font-black text-slate-800">{f.judul}</p>
                <p className="text-sm font-semibold text-slate-500">{f.teks}</p>
                <p className="mt-3 text-sm font-black text-rose-600">Buka →</p>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-5 rounded-[2rem] bg-[#0a1b35] p-5 text-white sm:p-7 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="text-xs font-black tracking-[0.24em] text-sky-300">COBA INTERAKSI 3D</p>
          <h2 className="mt-2 text-2xl leading-tight font-black sm:text-3xl">Jantungmu bekerja tanpa henti.</h2>
          <p className="mt-2 max-w-md text-sm font-bold text-white/75">
            Lihat jantung berdetak, putar modelnya, lalu pelajari tugasnya di dalam tubuhmu.
          </p>
          <Button variant="amber" className="mt-4" onClick={() => go("materi", "jantung")}>
            Pelajari jantung →
          </Button>
        </div>
        <HeartHero height={265} />
      </section>

      {/* TUJUAN PEMBELAJARAN */}
      <Card className="anim-slide">
        <h2 className="mb-2 text-xl font-black text-slate-800">🎯 Tujuan Pembelajaran</h2>
        <p className="mb-3 text-sm font-semibold text-slate-500">
          Setelah menyelesaikan petualangan ini, kamu diharapkan mampu:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "Menjelaskan fungsi sistem peredaran darah bagi tubuh.",
            "Menyebutkan organ peredaran darah dan fungsinya.",
            "Membedakan arteri, vena, dan kapiler.",
            "Menyebutkan komponen darah beserta tugasnya.",
            "Menjelaskan peredaran darah kecil dan besar.",
            "Menerapkan cara menjaga kesehatan peredaran darah.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3">
              <span className="text-lg">✅</span>
              <span className="text-sm font-bold text-slate-700">{t}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
