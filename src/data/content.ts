/**
 * DATA MATERI PEMBELAJARAN
 * IPAS Kurikulum Merdeka — Fase C (Kelas 5/6 SD)
 * Topik: Sistem Peredaran Darah Manusia
 * Bahasa disederhanakan untuk siswa SD, konsep tetap sesuai sains.
 */

export type MateriBlok =
  | { tipe: "paragraf"; teks: string }
  | { tipe: "poin"; judul?: string; items: string[] }
  | { tipe: "kartu"; items: { ikon: string; judul: string; teks: string; warna: string }[] }
  | { tipe: "alur"; items: { ikon: string; label: string }[] }
  | { tipe: "catatan"; ikon: string; teks: string }
  | { tipe: "bandingkan"; kolom: string[]; baris: string[][] };

export type Materi = {
  id: string;
  nomor: string;
  ikon: string;
  judul: string;
  ringkas: string;
  warna: string;
  blok: MateriBlok[];
  faktaSeru: string;
};

export const MATERI: Materi[] = [
  {
    id: "pengenalan",
    nomor: "A",
    ikon: "🧭",
    judul: "Mengenal Sistem Peredaran Darah",
    ringkas: "Apa itu sistem peredaran darah dan mengapa tubuh kita membutuhkannya.",
    warna: "from-rose-400 to-pink-500",
    blok: [
      {
        tipe: "paragraf",
        teks: "Di dalam tubuhmu ada sebuah “jalan raya” yang sibuk sepanjang hari. Jalan raya itu bernama sistem peredaran darah. Sistem peredaran darah adalah kerja sama antara jantung, pembuluh darah, dan darah untuk mengedarkan darah ke seluruh tubuh.",
      },
      {
        tipe: "kartu",
        items: [
          {
            ikon: "🫀",
            judul: "Jantung",
            teks: "Pompa tubuh. Jantung memompa darah agar terus mengalir.",
            warna: "from-rose-400 to-red-500",
          },
          {
            ikon: "🫁",
            judul: "Pembuluh Darah",
            teks: "Jalan atau saluran tempat darah mengalir ke seluruh tubuh.",
            warna: "from-sky-400 to-blue-500",
          },
          {
            ikon: "🩸",
            judul: "Darah",
            teks: "Kendaraan pengangkut oksigen dan sari makanan.",
            warna: "from-red-400 to-rose-600",
          },
        ],
      },
      {
        tipe: "poin",
        judul: "Fungsi sistem peredaran darah",
        items: [
          "Mengangkut oksigen dari paru-paru ke seluruh sel tubuh.",
          "Mengangkut sari makanan dari usus halus ke seluruh tubuh.",
          "Membawa karbon dioksida dan zat sisa untuk dibuang keluar tubuh.",
          "Membantu tubuh melawan kuman penyebab penyakit.",
          "Membantu menjaga suhu tubuh tetap hangat dan stabil.",
          "Mengedarkan hormon, yaitu zat pengatur kerja tubuh.",
        ],
      },
      {
        tipe: "paragraf",
        teks: "Setiap bagian tubuhmu — otak, otot kaki, mata, sampai ujung jari — membutuhkan oksigen dan makanan agar bisa bekerja. Darahlah yang mengantarkannya. Jika aliran darah berhenti, sel-sel tubuh tidak mendapat oksigen dan tubuh tidak dapat bekerja dengan baik.",
      },
      {
        tipe: "catatan",
        ikon: "💡",
        teks: "Peredaran darah manusia disebut peredaran darah TERTUTUP karena darah selalu mengalir di dalam pembuluh darah, dan disebut GANDA karena dalam satu kali putaran darah melewati jantung dua kali.",
      },
    ],
    faktaSeru:
      "Kalau semua pembuluh darahmu disambung menjadi satu garis, panjangnya bisa lebih dari 90.000 kilometer!",
  },
  {
    id: "jantung",
    nomor: "B",
    ikon: "🫀",
    judul: "Jantung — Sang Pemompa",
    ringkas: "Bentuk, letak, ruang jantung, dan cara jantung memompa darah.",
    warna: "from-red-400 to-rose-600",
    blok: [
      {
        tipe: "paragraf",
        teks: "Jantung adalah organ berotot yang bertugas memompa darah ke seluruh tubuh. Besarnya kira-kira sebesar kepalan tanganmu sendiri. Jantung terletak di dalam rongga dada, di antara kedua paru-paru, dan posisinya agak condong ke sebelah kiri.",
      },
      {
        tipe: "poin",
        judul: "Ciri-ciri jantung",
        items: [
          "Terbuat dari otot yang sangat kuat dan tidak pernah lelah.",
          "Bekerja terus-menerus, bahkan saat kita tidur.",
          "Berdetak sekitar 60–100 kali setiap menit pada orang dewasa (anak-anak biasanya sedikit lebih cepat).",
          "Sekali berdetak, jantung memeras darah keluar lalu mengisi kembali.",
        ],
      },
      {
        tipe: "kartu",
        items: [
          {
            ikon: "↘️",
            judul: "Serambi Kanan",
            teks: "Menerima darah kotor (banyak karbon dioksida) yang kembali dari seluruh tubuh.",
            warna: "from-sky-400 to-blue-500",
          },
          {
            ikon: "⬇️",
            judul: "Bilik Kanan",
            teks: "Memompa darah menuju paru-paru untuk mengambil oksigen.",
            warna: "from-blue-400 to-indigo-500",
          },
          {
            ikon: "↙️",
            judul: "Serambi Kiri",
            teks: "Menerima darah bersih (kaya oksigen) yang datang dari paru-paru.",
            warna: "from-rose-300 to-rose-500",
          },
          {
            ikon: "💪",
            judul: "Bilik Kiri",
            teks: "Memompa darah bersih ke seluruh tubuh. Dindingnya paling tebal karena bekerja paling keras.",
            warna: "from-red-400 to-rose-600",
          },
        ],
      },
      {
        tipe: "paragraf",
        teks: "Jantung punya 4 ruang: 2 serambi (bagian atas) dan 2 bilik (bagian bawah). Serambi bertugas MENERIMA darah, sedangkan bilik bertugas MEMOMPA darah keluar. Di antara ruang-ruang itu ada katup, yaitu pintu satu arah supaya darah tidak mengalir kembali ke tempat semula.",
      },
      {
        tipe: "catatan",
        ikon: "🤚",
        teks: "Coba tempelkan dua jarimu di pergelangan tangan atau sisi leher. Yang kamu rasakan berdenyut itu adalah aliran darah yang didorong oleh jantung!",
      },
    ],
    faktaSeru: "Dalam sehari, jantungmu berdetak sekitar 100.000 kali tanpa pernah berhenti istirahat.",
  },
  {
    id: "pembuluh",
    nomor: "C",
    ikon: "🛣️",
    judul: "Pembuluh Darah — Jalan Raya Tubuh",
    ringkas: "Arteri, vena, dan kapiler beserta perbedaan tugasnya.",
    warna: "from-sky-400 to-cyan-500",
    blok: [
      {
        tipe: "paragraf",
        teks: "Pembuluh darah adalah saluran tempat darah mengalir. Ada tiga jenis pembuluh darah dengan tugas yang berbeda-beda.",
      },
      {
        tipe: "kartu",
        items: [
          {
            ikon: "🔴",
            judul: "Arteri (Pembuluh Nadi)",
            teks: "Mengalirkan darah KELUAR dari jantung. Dindingnya tebal dan elastis, letaknya agak dalam, dan denyutnya terasa.",
            warna: "from-rose-400 to-red-500",
          },
          {
            ikon: "🔵",
            judul: "Vena (Pembuluh Balik)",
            teks: "Membawa darah KEMBALI ke jantung. Dindingnya lebih tipis, letaknya dekat permukaan kulit, dan memiliki katup.",
            warna: "from-sky-400 to-blue-600",
          },
          {
            ikon: "🕸️",
            judul: "Kapiler",
            teks: "Pembuluh paling kecil dan sangat halus. Di sinilah oksigen dan sari makanan berpindah dari darah ke sel tubuh.",
            warna: "from-fuchsia-400 to-purple-500",
          },
        ],
      },
      {
        tipe: "bandingkan",
        kolom: ["Pembeda", "Arteri", "Vena"],
        baris: [
          ["Arah aliran", "Keluar dari jantung", "Menuju ke jantung"],
          ["Dinding", "Tebal & elastis", "Lebih tipis"],
          ["Letak", "Agak dalam dari kulit", "Dekat permukaan kulit"],
          ["Denyut", "Terasa berdenyut", "Tidak terasa berdenyut"],
          ["Katup", "Hanya di dekat jantung", "Banyak di sepanjang pembuluh"],
        ],
      },
      {
        tipe: "catatan",
        ikon: "💡",
        teks: "Umumnya arteri membawa darah kaya oksigen dan vena membawa darah kaya karbon dioksida. Pengecualiannya ada pada pembuluh menuju dan dari paru-paru: pembuluh nadi paru-paru justru membawa darah yang kaya karbon dioksida.",
      },
      {
        tipe: "paragraf",
        teks: "Kapiler sangat penting walaupun ukurannya paling kecil. Dinding kapiler hanya setipis satu lapis sel, sehingga oksigen dan sari makanan mudah keluar menuju sel tubuh, sementara karbon dioksida masuk ke dalam darah untuk dibawa pergi.",
      },
    ],
    faktaSeru: "Pembuluh kapiler sangat tipis — diameternya lebih kecil daripada sehelai rambutmu!",
  },
  {
    id: "darah",
    nomor: "D",
    ikon: "🩸",
    judul: "Darah dan Komponennya",
    ringkas: "Plasma, sel darah merah, sel darah putih, dan keping darah.",
    warna: "from-rose-500 to-red-700",
    blok: [
      {
        tipe: "paragraf",
        teks: "Darah bukan hanya cairan merah biasa. Di dalam darah ada bermacam-macam bagian yang punya tugas masing-masing, seperti tim kerja yang kompak.",
      },
      {
        tipe: "kartu",
        items: [
          {
            ikon: "💧",
            judul: "Plasma Darah",
            teks: "Bagian cair berwarna kekuningan, sebagian besar berupa air. Tugasnya mengangkut sari makanan, hormon, dan zat sisa.",
            warna: "from-amber-300 to-yellow-500",
          },
          {
            ikon: "🔴",
            judul: "Sel Darah Merah",
            teks: "Mengangkut oksigen ke seluruh tubuh. Mengandung hemoglobin yang membuat darah berwarna merah.",
            warna: "from-red-400 to-rose-600",
          },
          {
            ikon: "⚪",
            judul: "Sel Darah Putih",
            teks: "Pasukan penjaga tubuh. Tugasnya melawan kuman dan bibit penyakit yang masuk ke tubuh.",
            warna: "from-slate-300 to-slate-500",
          },
          {
            ikon: "🟡",
            judul: "Keping Darah (Trombosit)",
            teks: "Membantu pembekuan darah saat kita terluka, sehingga luka berhenti berdarah.",
            warna: "from-orange-300 to-amber-500",
          },
        ],
      },
      {
        tipe: "poin",
        judul: "Hal penting tentang darah",
        items: [
          "Sebagian besar darah (sekitar setengahnya lebih) adalah plasma yang berupa cairan.",
          "Sel darah merah jumlahnya paling banyak di antara sel-sel darah.",
          "Hemoglobin adalah zat di sel darah merah yang mengikat oksigen.",
          "Saat lutut terluka lalu darah berhenti sendiri, itu adalah hasil kerja keping darah.",
        ],
      },
      {
        tipe: "catatan",
        ikon: "🥗",
        teks: "Agar sel darah merah sehat, tubuh memerlukan zat besi. Zat besi banyak terdapat pada bayam, daging, hati, dan kacang-kacangan.",
      },
    ],
    faktaSeru: "Satu tetes darah berisi jutaan sel darah merah yang sibuk mengantar oksigen.",
  },
  {
    id: "peredaran",
    nomor: "E",
    ikon: "🔄",
    judul: "Perjalanan Darah di Tubuhmu",
    ringkas: "Peredaran darah kecil dan peredaran darah besar.",
    warna: "from-violet-400 to-indigo-600",
    blok: [
      {
        tipe: "paragraf",
        teks: "Darah tidak berjalan sembarangan. Ia mengikuti jalur yang teratur. Manusia memiliki peredaran darah ganda, artinya darah melewati jantung dua kali dalam satu putaran penuh.",
      },
      {
        tipe: "alur",
        items: [
          { ikon: "🫀", label: "Bilik kanan" },
          { ikon: "🔵", label: "Pembuluh nadi paru-paru" },
          { ikon: "🫁", label: "Paru-paru (ambil oksigen)" },
          { ikon: "🔴", label: "Pembuluh balik paru-paru" },
          { ikon: "🫀", label: "Serambi kiri" },
        ],
      },
      {
        tipe: "catatan",
        ikon: "🫁",
        teks: "Jalur di atas disebut PEREDARAN DARAH KECIL, karena darah hanya pergi ke paru-paru lalu kembali lagi ke jantung. Di paru-paru darah melepaskan karbon dioksida dan mengambil oksigen.",
      },
      {
        tipe: "alur",
        items: [
          { ikon: "🫀", label: "Bilik kiri" },
          { ikon: "🔴", label: "Aorta & arteri" },
          { ikon: "🕸️", label: "Kapiler seluruh tubuh" },
          { ikon: "🔵", label: "Vena" },
          { ikon: "🫀", label: "Serambi kanan" },
        ],
      },
      {
        tipe: "catatan",
        ikon: "🏃",
        teks: "Jalur ini disebut PEREDARAN DARAH BESAR, karena darah berjalan jauh ke seluruh tubuh, mulai dari kepala sampai ujung kaki, lalu kembali ke jantung.",
      },
      {
        tipe: "poin",
        judul: "Yang terjadi selama perjalanan",
        items: [
          "Di paru-paru: darah membuang karbon dioksida dan mengambil oksigen.",
          "Di kapiler tubuh: darah memberikan oksigen dan sari makanan kepada sel.",
          "Di kapiler tubuh juga: darah mengambil karbon dioksida dan zat sisa dari sel.",
          "Darah kembali ke jantung melalui vena untuk diedarkan lagi.",
        ],
      },
      {
        tipe: "paragraf",
        teks: "Saat kamu berlari, tubuh membutuhkan lebih banyak oksigen. Karena itu jantung berdetak lebih cepat dan napasmu jadi lebih cepat pula, agar darah bisa mengantar oksigen lebih banyak dan lebih cepat.",
      },
    ],
    faktaSeru: "Satu putaran penuh darah mengelilingi tubuhmu hanya butuh waktu sekitar satu menit saja.",
  },
  {
    id: "sehat",
    nomor: "F",
    ikon: "🌱",
    judul: "Menjaga Peredaran Darah Tetap Sehat",
    ringkas: "Kebiasaan baik dan gangguan sederhana pada peredaran darah.",
    warna: "from-emerald-400 to-teal-600",
    blok: [
      {
        tipe: "poin",
        judul: "Cara menjaga kesehatan peredaran darah",
        items: [
          "Berolahraga secara teratur, misalnya berjalan kaki, bersepeda, atau berenang.",
          "Makan makanan bergizi seimbang: sayur, buah, dan lauk yang cukup.",
          "Mengurangi makanan yang terlalu berlemak, terlalu asin, dan terlalu manis.",
          "Istirahat dan tidur yang cukup setiap hari.",
          "Minum air putih yang cukup.",
          "Menjauhi asap rokok karena berbahaya bagi jantung dan pembuluh darah.",
        ],
      },
      {
        tipe: "kartu",
        items: [
          {
            ikon: "😴",
            judul: "Anemia",
            teks: "Kekurangan sel darah merah atau hemoglobin. Tubuh jadi mudah lelah, lemas, dan pucat.",
            warna: "from-slate-300 to-slate-500",
          },
          {
            ikon: "📈",
            judul: "Tekanan Darah Tinggi",
            teks: "Tekanan darah di pembuluh terlalu tinggi sehingga jantung bekerja lebih berat.",
            warna: "from-orange-300 to-red-500",
          },
        ],
      },
      {
        tipe: "catatan",
        ikon: "❤️",
        teks: "Tubuhmu hanya satu. Rawat jantung dan darahmu sejak sekarang dengan kebiasaan baik setiap hari.",
      },
    ],
    faktaSeru: "Berolahraga membuat otot jantung semakin kuat, sama seperti otot lenganmu yang terlatih.",
  },
];

/* ============== TITIK EKSPLORASI 3D UTAMA ============== */
export const EXPLORE_SPOTS = [
  "jantung",
  "arteri",
  "vena",
  "kapiler",
  "paru",
  "sel-merah",
  "sel-putih",
  "keping",
  "plasma",
];

/* ============== SISTEM LEVEL ============== */
export type Level = { id: number; title: string; minXp: number; icon: string };

export const LEVELS: Level[] = [
  { id: 1, title: "Mengenal Darah", minXp: 0, icon: "🩸" },
  { id: 2, title: "Mengenal Jantung", minXp: 300, icon: "🫀" },
  { id: 3, title: "Mengenal Pembuluh Darah", minXp: 700, icon: "🛣️" },
  { id: 4, title: "Menjelajahi Peredaran Darah", minXp: 1200, icon: "🚀" },
  { id: 5, title: "Peneliti Sistem Peredaran Darah", minXp: 2000, icon: "🔬" },
];

/* ============== BADGE ============== */
export type Badge = { id: string; icon: string; name: string; desc: string };

export const BADGES: Badge[] = [
  { id: "ahli-jantung", icon: "🫀", name: "Ahli Jantung", desc: "Menemukan & mempelajari jantung di Eksplorasi 3D." },
  { id: "penjelajah-darah", icon: "🩸", name: "Penjelajah Darah", desc: "Menyelesaikan Simulasi Perjalanan Darah." },
  { id: "ilmuwan-cilik", icon: "🔬", name: "Ilmuwan Cilik", desc: "Menyelesaikan semua jenis latihan." },
  { id: "pelari-oksigen", icon: "💨", name: "Pelari Oksigen", desc: "Mengurutkan perjalanan darah dengan benar." },
  { id: "kutu-buku", icon: "📚", name: "Kutu Buku", desc: "Membaca seluruh materi pembelajaran." },
  { id: "penjelajah-misi", icon: "🎯", name: "Komandan Misi", desc: "Menyelesaikan seluruh misi penjelajah." },
  { id: "juara-kuis", icon: "🏆", name: "Juara Kuis", desc: "Mendapat nilai kuis minimal 80." },
  { id: "master-peredaran", icon: "🏅", name: "Master Peredaran Darah", desc: "Menyelesaikan seluruh perjalanan belajar." },
];

/* ============== MISI ============== */
export type Mission = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  xp: number;
  hint: string;
  goto: string;
};

export const MISSIONS: Mission[] = [
  {
    id: "misi-jantung",
    title: "Temukan jantung!",
    desc: "Masuk ke Eksplorasi 3D lalu klik organ jantung di dalam tubuh.",
    icon: "🫀",
    xp: 100,
    hint: "Jantung ada di rongga dada, agak ke sebelah kiri.",
    goto: "eksplorasi",
  },
  {
    id: "misi-arteri",
    title: "Temukan pembuluh arteri!",
    desc: "Klik pembuluh berwarna merah yang keluar dari jantung.",
    icon: "🔴",
    xp: 100,
    hint: "Arteri membawa darah KELUAR dari jantung.",
    goto: "eksplorasi",
  },
  {
    id: "misi-vena",
    title: "Temukan pembuluh vena!",
    desc: "Klik pembuluh berwarna biru yang menuju kembali ke jantung.",
    icon: "🔵",
    xp: 100,
    hint: "Vena membawa darah KEMBALI ke jantung.",
    goto: "eksplorasi",
  },
  {
    id: "misi-simulasi",
    title: "Ikuti perjalanan darah!",
    desc: "Tonton Simulasi Perjalanan Darah sampai satu putaran penuh selesai.",
    icon: "🚀",
    xp: 150,
    hint: "Tekan tombol MULAI pada halaman Simulasi.",
    goto: "simulasi",
  },
  {
    id: "misi-sel-darah",
    title: "Temukan sel darah merah!",
    desc: "Buka mode DARAH di Eksplorasi 3D lalu klik sel darah merah.",
    icon: "🩸",
    xp: 100,
    hint: "Pilih tombol mode 🩸 Darah di panel kiri eksplorasi.",
    goto: "eksplorasi",
  },
  {
    id: "misi-urutan",
    title: "Susun perjalanan darah dengan benar!",
    desc: "Selesaikan permainan Urutkan Perjalanan Darah tanpa kesalahan akhir.",
    icon: "🧩",
    xp: 150,
    hint: "Ada di menu Latihan → Urutkan Perjalanan Darah.",
    goto: "latihan",
  },
];

/* ============== PETA PEMBELAJARAN ============== */
export type MapNode = {
  id: string;
  label: string;
  icon: string;
  route: string;
  desc: string;
  check: (p: { materi: number; eksplorasi: number; simulasi: number; misi: number; latihan: number; kuis: number }) => boolean;
};

export const MAP_NODES: MapNode[] = [
  {
    id: "n1",
    label: "Mengenal Darah",
    icon: "🩸",
    route: "materi",
    desc: "Baca materi pengenalan & komponen darah.",
    check: (p) => p.materi >= 30,
  },
  {
    id: "n2",
    label: "Mengenal Jantung",
    icon: "🫀",
    route: "materi",
    desc: "Pelajari bagian dan fungsi jantung.",
    check: (p) => p.materi >= 60,
  },
  {
    id: "n3",
    label: "Mengenal Pembuluh",
    icon: "🛣️",
    route: "materi",
    desc: "Kenali arteri, vena, dan kapiler.",
    check: (p) => p.materi >= 100,
  },
  {
    id: "n4",
    label: "Eksplorasi 3D",
    icon: "🔬",
    route: "eksplorasi",
    desc: "Jelajahi tubuh manusia dalam 3 dimensi.",
    check: (p) => p.eksplorasi >= 60,
  },
  {
    id: "n5",
    label: "Simulasi Darah",
    icon: "🚀",
    route: "simulasi",
    desc: "Ikuti perjalanan darah keliling tubuh.",
    check: (p) => p.simulasi >= 100,
  },
  {
    id: "n6",
    label: "Misi Penjelajah",
    icon: "🎯",
    route: "misi",
    desc: "Selesaikan tantangan penjelajah darah.",
    check: (p) => p.misi >= 80,
  },
  {
    id: "n7",
    label: "Latihan",
    icon: "📝",
    route: "latihan",
    desc: "Berlatih dengan 6 jenis aktivitas seru.",
    check: (p) => p.latihan >= 80,
  },
  {
    id: "n8",
    label: "Kuis Akhir",
    icon: "🏆",
    route: "kuis",
    desc: "Uji pemahamanmu dengan 20 soal.",
    check: (p) => p.kuis >= 70,
  },
];
