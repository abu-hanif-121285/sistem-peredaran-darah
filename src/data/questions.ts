/** BANK SOAL — Latihan & Kuis Sistem Peredaran Darah (Fase C) */

export type PG = {
  id: string;
  tipe: "pg";
  soal: string;
  gambar?: string;
  opsi: string[];
  jawaban: number;
  bahas: string;
  level: "Mudah" | "Sedang" | "HOTS";
};

export type BS = {
  id: string;
  tipe: "bs";
  soal: string;
  jawaban: boolean;
  bahas: string;
  level: "Mudah" | "Sedang" | "HOTS";
};

export type Soal = PG | BS;

/* ===================== LATIHAN 1 — PILIHAN GANDA ===================== */
export const LAT_PG: PG[] = [
  {
    id: "lpg1",
    tipe: "pg",
    soal: "Organ yang bertugas memompa darah ke seluruh tubuh adalah ....",
    opsi: ["Paru-paru", "Jantung", "Lambung", "Ginjal"],
    jawaban: 1,
    bahas: "Jantung adalah organ berotot yang memompa darah ke seluruh tubuh.",
    level: "Mudah",
  },
  {
    id: "lpg2",
    tipe: "pg",
    soal: "Pembuluh darah yang mengalirkan darah keluar dari jantung disebut ....",
    opsi: ["Vena", "Kapiler", "Arteri", "Trombosit"],
    jawaban: 2,
    bahas: "Arteri (pembuluh nadi) mengalirkan darah keluar dari jantung.",
    level: "Mudah",
  },
  {
    id: "lpg3",
    tipe: "pg",
    soal: "Bagian darah yang bertugas mengangkut oksigen adalah ....",
    opsi: ["Sel darah putih", "Keping darah", "Plasma darah", "Sel darah merah"],
    jawaban: 3,
    bahas: "Sel darah merah mengandung hemoglobin yang mengikat dan mengangkut oksigen.",
    level: "Mudah",
  },
  {
    id: "lpg4",
    tipe: "pg",
    soal: "Jantung manusia memiliki ... ruang.",
    opsi: ["2", "3", "4", "5"],
    jawaban: 2,
    bahas: "Jantung memiliki 4 ruang: 2 serambi (atas) dan 2 bilik (bawah).",
    level: "Mudah",
  },
  {
    id: "lpg5",
    tipe: "pg",
    soal: "Pertukaran oksigen dan karbon dioksida dengan sel tubuh terjadi di pembuluh ....",
    opsi: ["Arteri besar", "Kapiler", "Vena besar", "Aorta"],
    jawaban: 1,
    bahas: "Dinding kapiler sangat tipis sehingga zat mudah berpindah ke dan dari sel tubuh.",
    level: "Sedang",
  },
];

/* ===================== LATIHAN 2 — BENAR / SALAH ===================== */
export const LAT_BS: BS[] = [
  {
    id: "lbs1",
    tipe: "bs",
    soal: "Jantung terletak di dalam rongga dada, agak condong ke sebelah kiri.",
    jawaban: true,
    bahas: "Benar. Jantung berada di antara kedua paru-paru dan condong ke kiri.",
    level: "Mudah",
  },
  {
    id: "lbs2",
    tipe: "bs",
    soal: "Vena adalah pembuluh darah yang membawa darah kembali menuju jantung.",
    jawaban: true,
    bahas: "Benar. Vena atau pembuluh balik membawa darah kembali ke jantung.",
    level: "Mudah",
  },
  {
    id: "lbs3",
    tipe: "bs",
    soal: "Sel darah putih bertugas membekukan darah saat kita terluka.",
    jawaban: false,
    bahas: "Salah. Yang membantu pembekuan darah adalah keping darah (trombosit). Sel darah putih melawan kuman.",
    level: "Sedang",
  },
  {
    id: "lbs4",
    tipe: "bs",
    soal: "Bilik kiri jantung memiliki dinding paling tebal karena memompa darah ke seluruh tubuh.",
    jawaban: true,
    bahas: "Benar. Bilik kiri bekerja paling keras sehingga ototnya paling tebal.",
    level: "Sedang",
  },
  {
    id: "lbs5",
    tipe: "bs",
    soal: "Pada peredaran darah kecil, darah mengalir dari jantung ke seluruh tubuh.",
    jawaban: false,
    bahas: "Salah. Peredaran darah kecil adalah jantung → paru-paru → kembali ke jantung.",
    level: "Sedang",
  },
];

/* ===================== LATIHAN 3 — DRAG & DROP (pasangkan organ) ===== */
export type DropTarget = {
  id: string;
  ikon: string;
  nama: string;
  deskripsi: string;
  benar: string;
  feedback: string;
};

export const DRAG_ITEMS = ["JANTUNG", "ARTERI", "VENA", "KAPILER", "DARAH"];

export const DROP_TARGETS: DropTarget[] = [
  {
    id: "t1",
    ikon: "🫀",
    nama: "Organ pemompa",
    deskripsi: "Memompa darah ke seluruh tubuh",
    benar: "JANTUNG",
    feedback: "Hebat! Jantung berfungsi memompa darah.",
  },
  {
    id: "t2",
    ikon: "🔴",
    nama: "Pembuluh keluar",
    deskripsi: "Membawa darah keluar dari jantung",
    benar: "ARTERI",
    feedback: "Tepat! Arteri membawa darah keluar dari jantung.",
  },
  {
    id: "t3",
    ikon: "🔵",
    nama: "Pembuluh balik",
    deskripsi: "Membawa darah kembali ke jantung",
    benar: "VENA",
    feedback: "Benar sekali! Vena membawa darah kembali ke jantung.",
  },
  {
    id: "t4",
    ikon: "🕸️",
    nama: "Pembuluh terkecil",
    deskripsi: "Tempat pertukaran oksigen dengan sel tubuh",
    benar: "KAPILER",
    feedback: "Mantap! Kapiler adalah tempat pertukaran zat.",
  },
  {
    id: "t5",
    ikon: "🩸",
    nama: "Cairan pengangkut",
    deskripsi: "Mengangkut oksigen dan sari makanan",
    benar: "DARAH",
    feedback: "Luar biasa! Darah mengangkut oksigen dan sari makanan.",
  },
];

/* ===================== LATIHAN 4 — MENCOCOKKAN ======================= */
export type MatchPair = { id: string; kiri: string; kanan: string; ikon: string };

export const MATCH_PAIRS: MatchPair[] = [
  { id: "m1", kiri: "Sel darah merah", kanan: "Mengangkut oksigen", ikon: "🔴" },
  { id: "m2", kiri: "Sel darah putih", kanan: "Melawan kuman penyakit", ikon: "⚪" },
  { id: "m3", kiri: "Keping darah", kanan: "Membekukan darah saat luka", ikon: "🟡" },
  { id: "m4", kiri: "Plasma darah", kanan: "Mengangkut sari makanan", ikon: "💧" },
  { id: "m5", kiri: "Serambi kanan", kanan: "Menerima darah dari tubuh", ikon: "↘️" },
];

/* ===================== LATIHAN 5 — MENGURUTKAN ======================= */
export const URUTAN_BESAR = [
  { id: "u1", ikon: "🫀", label: "Bilik kiri jantung" },
  { id: "u2", ikon: "🔴", label: "Aorta & pembuluh arteri" },
  { id: "u3", ikon: "🕸️", label: "Kapiler di seluruh tubuh" },
  { id: "u4", ikon: "🔵", label: "Pembuluh vena" },
  { id: "u5", ikon: "🫀", label: "Serambi kanan jantung" },
];

export const URUTAN_KECIL = [
  { id: "k1", ikon: "🫀", label: "Bilik kanan jantung" },
  { id: "k2", ikon: "🔵", label: "Pembuluh nadi paru-paru" },
  { id: "k3", ikon: "🫁", label: "Paru-paru" },
  { id: "k4", ikon: "🔴", label: "Pembuluh balik paru-paru" },
  { id: "k5", ikon: "🫀", label: "Serambi kiri jantung" },
];

/* ===================== LATIHAN 6 — IDENTIFIKASI GAMBAR =============== */
export type IdentSoal = {
  id: string;
  gambar: "jantung" | "selMerah" | "selPutih" | "kapiler" | "paru" | "keping";
  pertanyaan: string;
  opsi: string[];
  jawaban: number;
  bahas: string;
};

export const IDENT_SOAL: IdentSoal[] = [
  {
    id: "id1",
    gambar: "jantung",
    pertanyaan: "Organ apakah ini?",
    opsi: ["Paru-paru", "Jantung", "Hati", "Ginjal"],
    jawaban: 1,
    bahas: "Ini adalah jantung, organ pemompa darah.",
  },
  {
    id: "id2",
    gambar: "selMerah",
    pertanyaan: "Sel darah apakah yang berbentuk cakram merah ini?",
    opsi: ["Sel darah putih", "Keping darah", "Sel darah merah", "Plasma"],
    jawaban: 2,
    bahas: "Sel darah merah berbentuk cakram dan bertugas mengangkut oksigen.",
  },
  {
    id: "id3",
    gambar: "selPutih",
    pertanyaan: "Sel darah ini bertugas ....",
    opsi: ["Mengangkut oksigen", "Melawan kuman", "Membekukan darah", "Mengangkut hormon"],
    jawaban: 1,
    bahas: "Sel darah putih adalah penjaga tubuh yang melawan kuman.",
  },
  {
    id: "id4",
    gambar: "kapiler",
    pertanyaan: "Jaringan pembuluh sangat halus ini disebut ....",
    opsi: ["Aorta", "Vena besar", "Kapiler", "Katup"],
    jawaban: 2,
    bahas: "Kapiler adalah pembuluh paling kecil dan halus.",
  },
  {
    id: "id5",
    gambar: "paru",
    pertanyaan: "Di organ ini darah melepaskan karbon dioksida dan mengambil ....",
    opsi: ["Air", "Oksigen", "Lemak", "Garam"],
    jawaban: 1,
    bahas: "Di paru-paru darah mengambil oksigen dan melepaskan karbon dioksida.",
  },
  {
    id: "id6",
    gambar: "keping",
    pertanyaan: "Bagian darah ini membantu tubuh ketika ....",
    opsi: ["Berlari cepat", "Terluka dan berdarah", "Tidur", "Makan"],
    jawaban: 1,
    bahas: "Keping darah membantu proses pembekuan darah saat terluka.",
  },
];

/* ===================== KUIS (22 SOAL) ================================ */
export const KUIS: Soal[] = [
  {
    id: "q1",
    tipe: "pg",
    soal: "Sistem peredaran darah manusia terdiri dari tiga bagian utama, yaitu ....",
    opsi: [
      "Jantung, paru-paru, dan ginjal",
      "Jantung, pembuluh darah, dan darah",
      "Darah, lambung, dan usus",
      "Otak, jantung, dan tulang",
    ],
    jawaban: 1,
    bahas: "Sistem peredaran darah terdiri atas jantung, pembuluh darah, dan darah.",
    level: "Mudah",
  },
  {
    id: "q2",
    tipe: "pg",
    soal: "Fungsi utama jantung adalah ....",
    opsi: [
      "Menyaring darah kotor",
      "Memompa darah ke seluruh tubuh",
      "Mencerna makanan",
      "Menghasilkan oksigen",
    ],
    jawaban: 1,
    bahas: "Jantung memompa darah agar terus mengalir ke seluruh tubuh.",
    level: "Mudah",
  },
  {
    id: "q3",
    tipe: "pg",
    soal: "Ukuran jantung manusia kira-kira sebesar ....",
    opsi: ["Biji jagung", "Kepalan tangan sendiri", "Bola sepak", "Telur ayam"],
    jawaban: 1,
    bahas: "Jantung kira-kira sebesar kepalan tangan pemiliknya.",
    level: "Mudah",
  },
  {
    id: "q4",
    tipe: "bs",
    soal: "Jantung manusia memiliki dua serambi dan dua bilik.",
    jawaban: true,
    bahas: "Benar. Ada serambi kanan, serambi kiri, bilik kanan, dan bilik kiri.",
    level: "Mudah",
  },
  {
    id: "q5",
    tipe: "pg",
    soal: "Ruang jantung yang memompa darah ke seluruh tubuh adalah ....",
    opsi: ["Serambi kanan", "Serambi kiri", "Bilik kanan", "Bilik kiri"],
    jawaban: 3,
    bahas: "Bilik kiri memompa darah kaya oksigen ke seluruh tubuh.",
    level: "Sedang",
  },
  {
    id: "q6",
    tipe: "pg",
    soal: "Pembuluh darah yang denyutnya dapat kita rasakan di pergelangan tangan adalah ....",
    opsi: ["Vena", "Arteri", "Kapiler", "Katup"],
    jawaban: 1,
    bahas: "Arteri memiliki denyut karena menerima dorongan kuat dari jantung.",
    level: "Sedang",
  },
  {
    id: "q7",
    tipe: "bs",
    soal: "Pembuluh kapiler memiliki dinding yang sangat tipis.",
    jawaban: true,
    bahas: "Benar. Dinding kapiler sangat tipis agar zat mudah berpindah.",
    level: "Mudah",
  },
  {
    id: "q8",
    tipe: "pg",
    soal: "Zat dalam sel darah merah yang mengikat oksigen bernama ....",
    opsi: ["Hemoglobin", "Insulin", "Klorofil", "Enzim"],
    jawaban: 0,
    bahas: "Hemoglobin mengikat oksigen dan memberi warna merah pada darah.",
    level: "Sedang",
  },
  {
    id: "q9",
    tipe: "pg",
    soal: "Bagian darah yang berupa cairan berwarna kekuningan adalah ....",
    opsi: ["Sel darah merah", "Sel darah putih", "Plasma darah", "Trombosit"],
    jawaban: 2,
    bahas: "Plasma darah adalah bagian cair darah yang berwarna kekuningan.",
    level: "Mudah",
  },
  {
    id: "q10",
    tipe: "pg",
    soal: "Ketika lututmu luka lalu darahnya berhenti sendiri, itu adalah hasil kerja ....",
    opsi: ["Sel darah merah", "Keping darah", "Plasma darah", "Sel darah putih"],
    jawaban: 1,
    bahas: "Keping darah (trombosit) membantu proses pembekuan darah.",
    level: "Sedang",
  },
  {
    id: "q11",
    tipe: "bs",
    soal: "Sel darah putih berfungsi melindungi tubuh dari kuman penyakit.",
    jawaban: true,
    bahas: "Benar. Sel darah putih adalah pasukan penjaga tubuh.",
    level: "Mudah",
  },
  {
    id: "q12",
    tipe: "pg",
    soal: "Urutan peredaran darah kecil yang benar adalah ....",
    opsi: [
      "Bilik kiri → seluruh tubuh → serambi kanan",
      "Bilik kanan → paru-paru → serambi kiri",
      "Serambi kiri → paru-paru → bilik kanan",
      "Bilik kanan → seluruh tubuh → serambi kiri",
    ],
    jawaban: 1,
    bahas: "Peredaran darah kecil: bilik kanan → paru-paru → serambi kiri.",
    level: "Sedang",
  },
  {
    id: "q13",
    tipe: "pg",
    soal: "Urutan peredaran darah besar yang benar adalah ....",
    opsi: [
      "Bilik kiri → seluruh tubuh → serambi kanan",
      "Bilik kanan → paru-paru → serambi kiri",
      "Serambi kanan → paru-paru → bilik kiri",
      "Serambi kiri → seluruh tubuh → bilik kanan",
    ],
    jawaban: 0,
    bahas: "Peredaran darah besar: bilik kiri → seluruh tubuh → serambi kanan.",
    level: "Sedang",
  },
  {
    id: "q14",
    tipe: "pg",
    soal: "Di paru-paru, darah melepaskan ... dan mengambil ....",
    opsi: [
      "Oksigen; karbon dioksida",
      "Karbon dioksida; oksigen",
      "Air; garam",
      "Sari makanan; oksigen",
    ],
    jawaban: 1,
    bahas: "Di paru-paru darah membuang karbon dioksida dan mengambil oksigen.",
    level: "Sedang",
  },
  {
    id: "q15",
    tipe: "bs",
    soal: "Peredaran darah manusia disebut peredaran darah terbuka karena darah mengalir bebas di luar pembuluh.",
    jawaban: false,
    bahas: "Salah. Peredaran darah manusia bersifat tertutup, darah selalu di dalam pembuluh.",
    level: "Sedang",
  },
  {
    id: "q16",
    tipe: "pg",
    soal: "Katup pada jantung berguna untuk ....",
    opsi: [
      "Menyaring kotoran darah",
      "Mencegah darah mengalir kembali ke tempat semula",
      "Membuat darah menjadi merah",
      "Menambah jumlah darah",
    ],
    jawaban: 1,
    bahas: "Katup bekerja seperti pintu satu arah agar darah tidak berbalik arah.",
    level: "Sedang",
  },
  {
    id: "q17",
    tipe: "pg",
    soal: "Saat Nadia berlari mengelilingi lapangan, jantungnya berdetak lebih cepat. Hal ini terjadi karena ....",
    opsi: [
      "Jantung sedang beristirahat",
      "Tubuh membutuhkan lebih banyak oksigen",
      "Darah berhenti mengalir",
      "Tubuh kekurangan air",
    ],
    jawaban: 1,
    bahas: "Saat berolahraga otot butuh lebih banyak oksigen, sehingga jantung memompa lebih cepat.",
    level: "HOTS",
  },
  {
    id: "q18",
    tipe: "pg",
    soal: "Rizky sering merasa lemas, mudah lelah, dan wajahnya pucat. Gangguan yang mungkin dialami Rizky adalah ....",
    opsi: ["Anemia", "Sakit gigi", "Rabun jauh", "Maag"],
    jawaban: 0,
    bahas: "Anemia terjadi karena kekurangan sel darah merah atau hemoglobin sehingga tubuh mudah lelah.",
    level: "HOTS",
  },
  {
    id: "q19",
    tipe: "pg",
    soal: "Jika pembuluh kapiler di kaki tersumbat, akibat yang paling mungkin terjadi adalah ....",
    opsi: [
      "Sel-sel di kaki kekurangan oksigen",
      "Kaki bertambah panjang",
      "Jantung berhenti berdetak selamanya",
      "Darah berubah warna menjadi hijau",
    ],
    jawaban: 0,
    bahas: "Kapiler adalah tempat oksigen berpindah ke sel. Jika tersumbat, sel kekurangan oksigen.",
    level: "HOTS",
  },
  {
    id: "q20",
    tipe: "pg",
    soal: "Kebiasaan berikut yang paling baik untuk menjaga kesehatan peredaran darah adalah ....",
    opsi: [
      "Sering makan gorengan setiap hari",
      "Berolahraga teratur dan makan sayur serta buah",
      "Tidur larut malam setiap hari",
      "Berada di dekat asap rokok",
    ],
    jawaban: 1,
    bahas: "Olahraga teratur dan makanan bergizi menjaga jantung serta pembuluh darah tetap sehat.",
    level: "Mudah",
  },
  {
    id: "q21",
    tipe: "bs",
    soal: "Darah yang kembali dari seluruh tubuh pertama kali masuk ke serambi kanan jantung.",
    jawaban: true,
    bahas: "Benar. Darah dari tubuh masuk melalui vena menuju serambi kanan.",
    level: "HOTS",
  },
  {
    id: "q22",
    tipe: "pg",
    soal: "Mengapa dinding arteri dibuat lebih tebal dan elastis dibandingkan vena?",
    opsi: [
      "Karena arteri lebih panjang",
      "Karena arteri menahan dorongan darah yang kuat dari jantung",
      "Karena arteri menyimpan makanan",
      "Karena arteri berada di luar tubuh",
    ],
    jawaban: 1,
    bahas: "Arteri langsung menerima dorongan kuat dari jantung sehingga dindingnya tebal dan elastis.",
    level: "HOTS",
  },
];

export const PESAN_MOTIVASI = (persen: number) => {
  if (persen >= 90)
    return "Luar biasa! Kamu sudah seperti peneliti cilik sistem peredaran darah. Pertahankan ya!";
  if (persen >= 75)
    return "Hebat! Kamu semakin memahami perjalanan darah di dalam tubuh. Sedikit lagi menuju sempurna!";
  if (persen >= 60)
    return "Bagus! Pemahamanmu sudah baik. Baca kembali materi jantung dan pembuluh darah agar makin mantap.";
  if (persen >= 40)
    return "Kamu sudah berusaha dengan baik. Yuk pelajari lagi materinya, lalu coba kuis sekali lagi!";
  return "Jangan menyerah! Pelajari kembali materi dan simulasi perjalanan darah, lalu coba lagi. Kamu pasti bisa!";
};
