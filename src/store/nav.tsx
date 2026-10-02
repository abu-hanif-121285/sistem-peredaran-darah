import { createContext, useContext, useState, type ReactNode } from "react";

export type Route =
  | "beranda"
  | "peta"
  | "materi"
  | "eksplorasi"
  | "simulasi"
  | "misi"
  | "latihan"
  | "kuis"
  | "progres"
  | "guru";

type NavCtx = {
  route: Route;
  go: (r: Route, payload?: string) => void;
  payload: string | null;
  clearPayload: () => void;
};

const Ctx = createContext<NavCtx | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>("beranda");
  const [payload, setPayload] = useState<string | null>(null);

  const go = (r: Route, p?: string) => {
    setRoute(r);
    setPayload(p ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Ctx.Provider value={{ route, go, payload, clearPayload: () => setPayload(null) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNav() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNav harus dipakai di dalam NavProvider");
  return c;
}

export const NAV_ITEMS: { route: Route; icon: string; label: string; desc: string }[] = [
  { route: "beranda", icon: "🏠", label: "Beranda", desc: "Halaman utama petualangan" },
  { route: "peta", icon: "🗺️", label: "Peta Belajar", desc: "Jalur perjalanan belajarmu" },
  { route: "materi", icon: "📚", label: "Materi", desc: "Bacaan lengkap bergambar" },
  { route: "eksplorasi", icon: "🫀", label: "Eksplorasi 3D", desc: "Jelajahi tubuh 3 dimensi" },
  { route: "simulasi", icon: "🩸", label: "Simulasi", desc: "Perjalanan darah bergerak" },
  { route: "misi", icon: "🎯", label: "Misi", desc: "Tantangan penjelajah darah" },
  { route: "latihan", icon: "📝", label: "Latihan", desc: "6 aktivitas seru" },
  { route: "kuis", icon: "🏆", label: "Kuis", desc: "Uji pemahamanmu" },
  { route: "progres", icon: "👤", label: "Progres", desc: "Dashboard & badge" },
];
