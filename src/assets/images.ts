/**
 * Semua ilustrasi diimpor sebagai modul agar Vite meng-inline-kannya ke berkas HTML tunggal.
 * Dengan begitu gambar selalu tampil walaupun hanya dist/index.html yang disajikan.
 */
import heroSirkulasi from "./hero-sirkulasi-realistis.png";
import jantungRealistis from "./jantung-realistis.png";
import selDarahRealistis from "./sel-darah-realistis.png";
import pembuluhRealistis from "./pembuluh-realistis.png";
import guideHana from "./guide-hana-3d.png";
import guideRaka from "./guide-raka-3d.png";

export const IMG = {
  heroSirkulasi,
  jantungRealistis,
  selDarahRealistis,
  pembuluhRealistis,
  guideHana,
  guideRaka,
} as const;

/** Ilustrasi utama tiap bab materi */
export const MATERI_IMG: Record<string, string> = {
  pengenalan: heroSirkulasi,
  jantung: jantungRealistis,
  pembuluh: pembuluhRealistis,
  darah: selDarahRealistis,
  peredaran: heroSirkulasi,
  sehat: guideHana,
};
