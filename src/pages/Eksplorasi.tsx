import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Button, Card, IconButton, PageTitle, ProgressBar } from "@/components/ui";
import { hasWebGL } from "@/components/three/parts";
import type { ExploreMode, ViewPreset } from "@/components/three/ExploreScene";
import { useProgress } from "@/store/progress";
import { useNav } from "@/store/nav";
import { EXPLORE_SPOTS } from "@/data/content";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";

const ExploreScene = lazy(() => import("@/components/three/ExploreScene"));

type Info = {
  id: string;
  ikon: string;
  nama: string;
  singkat: string;
  detail: string[];
  materi: string;
  warna: string;
};

const INFO: Record<string, Info> = {
  jantung: {
    id: "jantung",
    ikon: "🫀",
    nama: "Jantung",
    singkat: "Jantung adalah organ yang berfungsi memompa darah ke seluruh tubuh.",
    detail: [
      "Besarnya kira-kira sebesar kepalan tanganmu sendiri.",
      "Terletak di rongga dada di antara paru-paru, agak condong ke kiri.",
      "Terbuat dari otot kuat yang bekerja terus-menerus, bahkan saat kita tidur.",
      "Memiliki 4 ruang: 2 serambi (penerima) dan 2 bilik (pemompa).",
    ],
    materi: "jantung",
    warna: "from-rose-500 to-red-700",
  },
  arteri: {
    id: "arteri",
    ikon: "🔴",
    nama: "Arteri (Pembuluh Nadi)",
    singkat: "Arteri mengalirkan darah KELUAR dari jantung menuju seluruh tubuh.",
    detail: [
      "Dindingnya tebal dan elastis karena menahan dorongan kuat dari jantung.",
      "Letaknya agak dalam dari permukaan kulit.",
      "Denyutnya bisa kita rasakan di pergelangan tangan dan leher.",
      "Arteri terbesar bernama aorta, keluar dari bilik kiri jantung.",
    ],
    materi: "pembuluh",
    warna: "from-rose-500 to-red-600",
  },
  vena: {
    id: "vena",
    ikon: "🔵",
    nama: "Vena (Pembuluh Balik)",
    singkat: "Vena membawa darah KEMBALI dari tubuh menuju jantung.",
    detail: [
      "Dindingnya lebih tipis daripada arteri.",
      "Letaknya dekat permukaan kulit (kadang terlihat kebiruan di tangan).",
      "Memiliki banyak katup agar darah tidak mengalir balik.",
      "Alirannya tidak terasa berdenyut.",
    ],
    materi: "pembuluh",
    warna: "from-sky-500 to-blue-700",
  },
  kapiler: {
    id: "kapiler",
    ikon: "🕸️",
    nama: "Kapiler",
    singkat: "Kapiler adalah pembuluh paling kecil, tempat pertukaran zat dengan sel tubuh.",
    detail: [
      "Ukurannya sangat halus, lebih kecil daripada sehelai rambut.",
      "Dindingnya hanya setipis satu lapis sel.",
      "Di sinilah oksigen dan sari makanan berpindah dari darah ke sel tubuh.",
      "Karbon dioksida dari sel juga masuk ke darah melalui kapiler.",
    ],
    materi: "pembuluh",
    warna: "from-fuchsia-500 to-purple-700",
  },
  paru: {
    id: "paru",
    ikon: "🫁",
    nama: "Paru-paru",
    singkat: "Di paru-paru darah melepaskan karbon dioksida dan mengambil oksigen.",
    detail: [
      "Paru-paru bekerja sama dengan sistem peredaran darah.",
      "Darah yang datang dari bilik kanan masuk ke paru-paru.",
      "Setelah mengambil oksigen, darah kembali ke serambi kiri jantung.",
      "Jalur ini disebut peredaran darah kecil.",
    ],
    materi: "peredaran",
    warna: "from-pink-400 to-fuchsia-600",
  },
  "sel-merah": {
    id: "sel-merah",
    ikon: "🔴",
    nama: "Sel Darah Merah",
    singkat: "Sel darah merah bertugas mengangkut oksigen ke seluruh tubuh.",
    detail: [
      "Bentuknya seperti cakram pipih yang bagian tengahnya cekung.",
      "Mengandung hemoglobin yang mengikat oksigen.",
      "Hemoglobin membuat darah berwarna merah.",
      "Jumlahnya paling banyak di antara sel-sel darah.",
    ],
    materi: "darah",
    warna: "from-red-500 to-rose-700",
  },
  "sel-putih": {
    id: "sel-putih",
    ikon: "⚪",
    nama: "Sel Darah Putih",
    singkat: "Sel darah putih adalah pasukan penjaga tubuh dari kuman penyakit.",
    detail: [
      "Jumlahnya lebih sedikit daripada sel darah merah.",
      "Dapat bergerak untuk mengejar dan memakan kuman.",
      "Jumlahnya bertambah saat tubuh sedang melawan penyakit.",
      "Tidak berwarna merah karena tidak memiliki hemoglobin.",
    ],
    materi: "darah",
    warna: "from-slate-400 to-slate-600",
  },
  keping: {
    id: "keping",
    ikon: "🟡",
    nama: "Keping Darah (Trombosit)",
    singkat: "Keping darah membantu proses pembekuan darah saat tubuh terluka.",
    detail: [
      "Bentuknya kecil dan tidak beraturan.",
      "Saat kulit terluka, keping darah berkumpul menutup luka.",
      "Darah menjadi beku sehingga perdarahan berhenti.",
      "Luka lalu menjadi keropeng dan sembuh.",
    ],
    materi: "darah",
    warna: "from-amber-400 to-orange-600",
  },
  plasma: {
    id: "plasma",
    ikon: "💧",
    nama: "Plasma Darah",
    singkat: "Plasma adalah bagian cair darah yang mengangkut sari makanan dan zat lain.",
    detail: [
      "Berwarna kekuningan dan sebagian besar terdiri atas air.",
      "Merupakan bagian terbesar dari darah.",
      "Mengangkut sari makanan, hormon, dan zat sisa.",
      "Menjadi tempat mengalirnya sel-sel darah.",
    ],
    materi: "darah",
    warna: "from-amber-300 to-yellow-500",
  },
  "serambi-kanan": {
    id: "serambi-kanan",
    ikon: "↘️",
    nama: "Serambi Kanan",
    singkat: "Menerima darah dari seluruh tubuh yang banyak mengandung karbon dioksida.",
    detail: ["Darah masuk melalui pembuluh vena besar.", "Lalu darah diteruskan ke bilik kanan."],
    materi: "jantung",
    warna: "from-sky-500 to-blue-700",
  },
  "serambi-kiri": {
    id: "serambi-kiri",
    ikon: "↙️",
    nama: "Serambi Kiri",
    singkat: "Menerima darah kaya oksigen yang datang dari paru-paru.",
    detail: ["Darah masuk melalui pembuluh balik paru-paru.", "Lalu darah diteruskan ke bilik kiri."],
    materi: "jantung",
    warna: "from-rose-400 to-rose-600",
  },
  "bilik-kanan": {
    id: "bilik-kanan",
    ikon: "⬇️",
    nama: "Bilik Kanan",
    singkat: "Memompa darah menuju paru-paru untuk mengambil oksigen.",
    detail: ["Awal dari peredaran darah kecil.", "Darah dipompa melalui pembuluh nadi paru-paru."],
    materi: "jantung",
    warna: "from-blue-500 to-indigo-700",
  },
  "bilik-kiri": {
    id: "bilik-kiri",
    ikon: "💪",
    nama: "Bilik Kiri",
    singkat: "Memompa darah kaya oksigen ke seluruh tubuh melalui aorta.",
    detail: [
      "Dindingnya paling tebal karena bekerja paling keras.",
      "Awal dari peredaran darah besar.",
    ],
    materi: "jantung",
    warna: "from-red-500 to-rose-700",
  },
  aorta: {
    id: "aorta",
    ikon: "🔺",
    nama: "Aorta",
    singkat: "Aorta adalah pembuluh arteri terbesar yang keluar dari bilik kiri jantung.",
    detail: [
      "Membawa darah kaya oksigen ke seluruh tubuh.",
      "Bercabang menjadi arteri-arteri yang lebih kecil.",
    ],
    materi: "pembuluh",
    warna: "from-rose-500 to-red-700",
  },
  "arteri-paru": {
    id: "arteri-paru",
    ikon: "🫁",
    nama: "Arteri Pulmonalis (Pembuluh Nadi Paru-paru)",
    singkat: "Membawa darah yang kaya karbon dioksida dari bilik kanan menuju paru-paru.",
    detail: [
      "Satu-satunya arteri yang membawa darah kaya karbon dioksida.",
      "Bercabang dua: ke paru-paru kanan dan paru-paru kiri.",
      "Awal dari peredaran darah kecil.",
    ],
    materi: "peredaran",
    warna: "from-indigo-500 to-violet-700",
  },
  "vena-kava": {
    id: "vena-kava",
    ikon: "🔵",
    nama: "Vena Kava (Pembuluh Balik Besar)",
    singkat: "Vena terbesar yang mengembalikan darah dari seluruh tubuh ke serambi kanan.",
    detail: [
      "Vena kava atas membawa darah dari kepala dan lengan.",
      "Vena kava bawah membawa darah dari perut dan tungkai.",
      "Darahnya banyak mengandung karbon dioksida.",
    ],
    materi: "pembuluh",
    warna: "from-sky-500 to-blue-700",
  },
  koroner: {
    id: "koroner",
    ikon: "❤️‍🩹",
    nama: "Arteri Koroner",
    singkat: "Pembuluh kecil di permukaan jantung yang memberi makan otot jantung itu sendiri.",
    detail: [
      "Otot jantung juga butuh oksigen dan sari makanan.",
      "Jika tersumbat oleh lemak, otot jantung bisa kekurangan oksigen.",
      "Olahraga dan makanan sehat menjaga pembuluh ini tetap lancar.",
    ],
    materi: "sehat",
    warna: "from-amber-500 to-orange-600",
  },
};

const MODES: { id: ExploreMode; icon: string; label: string; hint: string }[] = [
  { id: "tubuh", icon: "🧍", label: "Tubuh", hint: "Lihat seluruh tubuh & organ" },
  { id: "jantung", icon: "🫀", label: "Jantung", hint: "Zoom ke organ jantung" },
  { id: "pembuluh", icon: "🔴", label: "Pembuluh", hint: "Lihat jaringan pembuluh darah" },
  { id: "darah", icon: "🩸", label: "Darah", hint: "Lihat sel-sel darah" },
];

const SPOT_UTAMA = EXPLORE_SPOTS;

/* ====== Fallback 2D interaktif bila WebGL tidak tersedia ====== */
function Fallback2D({ onSelect, selected }: { onSelect: (id: string) => void; selected: string | null }) {
  const hot = (id: string) => (selected === id ? 1 : 0.75);
  return (
    <svg viewBox="0 0 260 360" className="h-full w-full">
      <rect width="260" height="360" fill="#0b1b35" />
      <g opacity="0.25" fill="#9ad2ff">
        <circle cx="130" cy="52" r="26" />
        <rect x="96" y="80" width="68" height="110" rx="30" />
        <rect x="60" y="88" width="22" height="100" rx="11" />
        <rect x="178" y="88" width="22" height="100" rx="11" />
        <rect x="104" y="188" width="22" height="130" rx="11" />
        <rect x="134" y="188" width="22" height="130" rx="11" />
      </g>
      <path d="M140 100 C150 130 152 170 150 210 C148 250 150 280 152 310" stroke="#e8394f" strokeWidth="7" fill="none" strokeLinecap="round" opacity={hot("arteri")} className="cursor-pointer" onClick={() => onSelect("arteri")} />
      <path d="M118 100 C108 130 106 170 108 210 C110 250 108 280 106 310" stroke="#2f7fd4" strokeWidth="7" fill="none" strokeLinecap="round" opacity={hot("vena")} className="cursor-pointer" onClick={() => onSelect("vena")} />
      <g className="cursor-pointer" onClick={() => onSelect("kapiler")} opacity={hot("kapiler")}>
        {[70, 190].map((x) => (
          <g key={x}>
            <circle cx={x} cy={196} r="8" fill="#c084fc" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={x} y1={196} x2={x + Math.cos((i * Math.PI) / 2) * 16} y2={196 + Math.sin((i * Math.PI) / 2) * 16} stroke="#c084fc" strokeWidth="3" />
            ))}
          </g>
        ))}
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("paru")} opacity={hot("paru")}>
        <ellipse cx="112" cy="118" rx="18" ry="26" fill="#ffc2cf" opacity="0.6" />
        <ellipse cx="148" cy="118" rx="18" ry="26" fill="#ffc2cf" opacity="0.6" />
      </g>
      <g className="cursor-pointer anim-heart" style={{ transformOrigin: "128px 126px" }} onClick={() => onSelect("jantung")}>
        <circle cx="122" cy="120" r="11" fill="#ef4b63" />
        <circle cx="136" cy="120" r="11" fill="#ef4b63" />
        <path d="M112 126 L129 146 L146 126 Z" fill="#ef4b63" />
      </g>
      <text x="130" y="344" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">
        Mode 2D — ketuk bagian tubuh untuk info
      </text>
    </svg>
  );
}

export default function Eksplorasi() {
  const webgl = useMemo(() => hasWebGL(), []);
  const [mode, setMode] = useState<ExploreMode>("tubuh");
  const [view, setView] = useState<ViewPreset>("depan");
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(false);
  const [beating, setBeating] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState(false);
  const { data, markExplored, completeMission, awardBadge, progress } = useProgress();
  const { go } = useNav();

  const pick = (id: string) => {
    if (!id) {
      setSelected(null);
      return;
    }
    setSelected(id);
    setDetail(false);
    sfx.whoosh();
    if (SPOT_UTAMA.includes(id)) markExplored(id);
    if (id === "jantung") completeMission("misi-jantung");
    if (id === "arteri") completeMission("misi-arteri");
    if (id === "vena") completeMission("misi-vena");
    if (id === "sel-merah") completeMission("misi-sel-darah");
  };

  useEffect(() => {
    const ruang = ["serambi-kanan", "serambi-kiri", "bilik-kanan", "bilik-kiri"];
    if (ruang.every((r) => data.explored.includes(r) || r === selected)) {
      if (selected && ruang.includes(selected)) awardBadge("ahli-jantung");
    }
  }, [selected, data.explored, awardBadge]);

  useEffect(() => {
    if (selected && ["serambi-kanan", "serambi-kiri", "bilik-kanan", "bilik-kiri"].includes(selected))
      markExplored(selected);
  }, [selected, markExplored]);

  const info = selected ? INFO[selected] : null;

  return (
    <div className="space-y-4">
      <PageTitle
        icon="🫀"
        title="Eksplorasi 3D Tubuh"
        subtitle="Putar, perbesar, geser, dan klik bagian tubuh untuk mempelajarinya."
        right={
          <div className="min-w-[190px]">
            <p className="text-xs font-black text-slate-500">
              {data.explored.filter((e) => SPOT_UTAMA.includes(e)).length}/{SPOT_UTAMA.length} BAGIAN DITEMUKAN
            </p>
            <ProgressBar value={progress.eksplorasi} showLabel className="mt-1" color="from-fuchsia-400 to-purple-600" />
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        {/* ====== PANEL 3D ====== */}
        <Card className="relative overflow-hidden p-0">
          <div className="relative h-[52vh] min-h-[380px] w-full sm:h-[62vh]">
            {webgl ? (
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center bg-[#0b1b35] text-white">
                    <p className="animate-pulse font-black">Menyiapkan tubuh manusia 3D...</p>
                  </div>
                }
              >
                <ExploreScene
                  mode={mode}
                  view={view}
                  selected={selected}
                  onSelect={pick}
                  beating={beating}
                  zoom={zoom}
                  autoRotate={rotate}
                />
              </Suspense>
            ) : (
              <Fallback2D onSelect={pick} selected={selected} />
            )}

            {/* label mode */}
            <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/45 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
              MODE: {MODES.find((m) => m.id === mode)?.label.toUpperCase()}
            </div>

            {/* kontrol kamera */}
            <div className="absolute right-3 bottom-3 flex flex-wrap items-center justify-end gap-1.5">
              <IconButton label="Perbesar" onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.25).toFixed(2)))}>
                ➕
              </IconButton>
              <IconButton label="Perkecil" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.25).toFixed(2)))}>
                ➖
              </IconButton>
              <IconButton label="Putar otomatis" active={rotate} onClick={() => setRotate((r) => !r)}>
                🔄
              </IconButton>
              <IconButton
                label={beating ? "Jeda detak jantung" : "Putar detak jantung"}
                active={beating}
                onClick={() => setBeating((b) => !b)}
              >
                {beating ? "⏸" : "▶"}
              </IconButton>
              <IconButton
                label="Reset tampilan"
                onClick={() => {
                  setZoom(1);
                  setView("depan");
                  setRotate(false);
                }}
              >
                ↺
              </IconButton>
            </div>

            {/* petunjuk */}
            <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-xl bg-black/40 px-3 py-2 text-[11px] font-bold text-white/90 backdrop-blur sm:block">
              🖱️ Seret = putar · Scroll = zoom · Klik kanan+seret = geser
            </div>
          </div>

          {/* tombol mode & sudut pandang */}
          <div className="space-y-2.5 border-t border-slate-100 p-3">
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  title={m.hint}
                  onClick={() => {
                    sfx.click();
                    setMode(m.id);
                    setSelected(null);
                    setZoom(1);
                  }}
                  className={cn(
                    "press flex items-center gap-2 rounded-2xl border-2 px-3.5 py-2.5 text-sm font-black transition-all",
                    mode === m.id
                      ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "border-slate-200 bg-white text-slate-600 hover:border-rose-300",
                  )}
                >
                  <span className="text-lg">{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                { v: "depan", l: "LIHAT DARI DEPAN", i: "👁️" },
                { v: "samping", l: "LIHAT DARI SAMPING", i: "↔️" },
                { v: "sistem", l: "LIHAT SISTEM PEREDARAN", i: "🔄" },
              ] as const).map((b) => (
                <button
                  key={b.v}
                  onClick={() => {
                    sfx.click();
                    setView(b.v);
                  }}
                  className={cn(
                    "press rounded-xl border-2 px-3 py-2 text-[11px] font-black tracking-wide transition-all",
                    view === b.v
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-slate-200 bg-white text-slate-500 hover:border-sky-300",
                  )}
                >
                  {b.i} {b.l}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ====== PANEL INFO ====== */}
        <div className="space-y-3">
          {info ? (
            <Card className="anim-pop overflow-hidden p-0">
              <div className={`bg-gradient-to-br ${info.warna} p-4 text-white`}>
                <p className="text-4xl">{info.ikon}</p>
                <p className="text-xl font-black">{info.nama}</p>
              </div>
              <div className="space-y-3 p-4">
                <p className="text-[15px] font-bold text-slate-700">{info.singkat}</p>
                {detail && (
                  <ul className="anim-slide space-y-1.5 rounded-2xl bg-slate-50 p-3">
                    {info.detail.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm font-semibold text-slate-700">
                        <span className="text-rose-500">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => go("materi", info.materi)}>
                    📖 Pelajari
                  </Button>
                  <Button size="sm" variant="sky" onClick={() => setRotate((r) => !r)}>
                    🔄 Putar
                  </Button>
                  <Button size="sm" variant="amber" onClick={() => setZoom((z) => Math.min(2.2, z + 0.25))}>
                    🔍 Perbesar
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setDetail((d) => !d)}>
                    ℹ️ {detail ? "Tutup Info" : "Info"}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-rose-200 bg-rose-50/60 text-center">
              <p className="text-4xl">👆</p>
              <p className="mt-1 font-black text-slate-700">Klik bagian tubuh</p>
              <p className="text-sm font-semibold text-slate-500">
                Ketuk organ, pembuluh, atau label berwarna pada model 3D untuk melihat penjelasannya.
              </p>
            </Card>
          )}

          <Card>
            <p className="mb-2 text-sm font-black text-slate-700">🔎 Daftar temuanmu</p>
            <div className="flex flex-wrap gap-1.5">
              {SPOT_UTAMA.map((s) => {
                const found = data.explored.includes(s);
                return (
                  <span
                    key={s}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-black",
                      found ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {found ? "✓" : "?"} {INFO[s]?.nama ?? s}
                  </span>
                );
              })}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <p className="text-sm font-black">🎮 Tips Penjelajah</p>
            <ul className="mt-1.5 space-y-1 text-xs font-bold text-white/80">
              <li>• Gunakan mode 🫀 Jantung untuk melihat ruang-ruang jantung.</li>
              <li>• Mode 🩸 Darah menampilkan sel darah merah, putih, dan keping darah.</li>
              <li>• Setiap bagian baru yang kamu temukan memberi +15 XP.</li>
            </ul>
            <Button size="sm" variant="amber" className="mt-3" onClick={() => go("simulasi")}>
              🩸 Lanjut ke Simulasi →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
