import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";
import { useProgress } from "@/store/progress";
import { NAV_ITEMS, useNav } from "@/store/nav";
import { ProgressBar } from "./ui";
import Avatar from "./Avatar";
import BrandLogo from "./BrandLogo";

function NavButton({
  icon,
  label,
  desc,
  active,
  onClick,
  compact,
}: {
  icon: string;
  label: string;
  desc?: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={() => {
        sfx.click();
        onClick();
      }}
      title={desc}
      aria-current={active ? "page" : undefined}
      className={cn(
        "press group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300",
        active
          ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30"
          : "text-slate-600 hover:bg-rose-50 hover:text-rose-600",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-colors",
          active ? "bg-white/25" : "bg-slate-100 group-hover:bg-white",
        )}
      >
        {icon}
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-extrabold">{label}</span>
          {desc && (
            <span
              className={cn(
                "block truncate text-[11px] font-semibold",
                active ? "text-white/80" : "text-slate-400",
              )}
            >
              {desc}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { route, go } = useNav();
  const { data, level, levelProgress, nextLevel, toasts, toggleAudio } = useProgress();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(1200px_600px_at_80%_-10%,#ffe4e9_0%,transparent_55%),radial-gradient(900px_500px_at_0%_0%,#dbeafe_0%,transparent_50%)] bg-[#eef3fb]">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-sky-400/15 bg-[#07172d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-3 py-2.5 sm:px-5">
          <button
            onClick={() => {
              sfx.click();
              setOpen((o) => !o);
            }}
            aria-label="Buka menu"
            className="press flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl text-white lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>

          <button
            onClick={() => {
              sfx.click();
              go("beranda");
            }}
            className="press flex min-w-0 items-center gap-3 text-left"
            aria-label="Kembali ke Beranda WAH Official"
          >
            <span className="flex h-12 w-[104px] shrink-0 items-center justify-center sm:h-[58px] sm:w-[132px]">
              <BrandLogo />
            </span>
            <span className="hidden border-l border-white/20 pl-3 text-sm leading-tight font-extrabold text-white/90 xl:block">
              Jelajah Sistem<br />Peredaran Darah 3D
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* XP chip */}
            <div className="hidden items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 sm:flex">
              <span className="text-lg">⚡</span>
              <div className="w-28">
                <p className="text-[10px] leading-none font-black text-amber-700">
                  {data.xp.toLocaleString("id-ID")} XP
                </p>
                <ProgressBar
                  value={levelProgress}
                  height="h-1.5"
                  color="from-amber-400 to-orange-500"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 md:flex">
              <span className="text-lg">{level.icon}</span>
              <div className="leading-none">
                <p className="text-[10px] font-black text-slate-400">LEVEL {level.id}</p>
                <p className="max-w-[140px] truncate text-xs font-black text-slate-700">
                  {level.title}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                toggleAudio();
                if (!data.audio) setTimeout(() => sfx.correct(), 60);
              }}
              title={data.audio ? "Audio ON — klik untuk mematikan" : "Audio OFF — klik untuk menyalakan"}
              aria-label={data.audio ? "Matikan audio" : "Nyalakan audio"}
              className="press flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-xl hover:border-rose-300"
            >
              {data.audio ? "🔊" : "🔇"}
            </button>

            <button
              onClick={() => {
                sfx.click();
                go("guru");
              }}
              title="Mode Guru"
              aria-label="Mode Guru"
              className={cn(
                "press hidden h-11 items-center justify-center gap-1.5 rounded-2xl border-2 px-3 text-sm font-black sm:flex",
                route === "guru"
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300",
              )}
            >
              <span className="text-lg">🧑‍🏫</span>
              <span className="hidden xl:inline">Guru</span>
            </button>

            <button
              onClick={() => {
                sfx.click();
                go("progres");
              }}
              className="press flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-1 pr-3 pl-1 hover:border-rose-300"
              title="Buka dashboard progres"
            >
              <Avatar type={data.avatar} size={34} />
              <span className="hidden max-w-[110px] truncate text-sm font-black text-slate-700 sm:block">
                {data.name || "Siswa"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px] flex-1 gap-5 px-3 py-4 sm:px-5">
        {/* ===== SIDEBAR DESKTOP ===== */}
        <aside className="sticky top-[76px] hidden h-[calc(100vh-100px)] w-[250px] shrink-0 flex-col gap-1 overflow-y-auto rounded-3xl border border-white bg-white/85 p-3 shadow-[0_10px_30px_-12px_rgba(23,37,84,0.25)] backdrop-blur lg:flex">
          {NAV_ITEMS.map((n) => (
            <NavButton
              key={n.route}
              icon={n.icon}
              label={n.label}
              desc={n.desc}
              active={route === n.route}
              onClick={() => go(n.route)}
            />
          ))}
          <div className="mt-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-3 text-white">
            <p className="text-[10px] font-black tracking-widest text-rose-300">LEVEL {level.id}</p>
            <p className="text-sm font-black">{level.title}</p>
            <ProgressBar value={levelProgress} height="h-2" color="from-rose-400 to-amber-400" className="mt-2" />
            <p className="mt-1.5 text-[11px] font-bold text-white/70">
              {nextLevel ? `${nextLevel.minXp - data.xp} XP lagi menuju Level ${nextLevel.id}` : "Level tertinggi tercapai!"}
            </p>
          </div>
        </aside>

        {/* ===== DRAWER MOBILE ===== */}
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <nav className="anim-slide absolute top-0 left-0 flex h-full w-[82%] max-w-[300px] flex-col gap-1 overflow-y-auto bg-white p-3 shadow-2xl">
              <div className="mb-2 rounded-2xl bg-[#07172d] px-3 py-3">
                <div className="flex h-[75px] w-[125px] items-center">
                  <BrandLogo />
                </div>
                <p className="mt-1 text-xs font-black text-white/70">Jelajah Peredaran Darah 3D</p>
              </div>
              {NAV_ITEMS.map((n) => (
                <NavButton
                  key={n.route}
                  icon={n.icon}
                  label={n.label}
                  desc={n.desc}
                  active={route === n.route}
                  onClick={() => {
                    go(n.route);
                    setOpen(false);
                  }}
                />
              ))}
              <NavButton
                icon="🧑‍🏫"
                label="Mode Guru"
                desc="Khusus bapak/ibu guru"
                active={route === "guru"}
                onClick={() => {
                  go("guru");
                  setOpen(false);
                }}
              />
            </nav>
          </div>
        )}

        {/* ===== KONTEN ===== */}
        <main className="min-w-0 flex-1 pb-4">{children}</main>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-sky-400/15 bg-[#07172d] px-4 py-6 text-center">
        <div className="mx-auto mb-2 flex h-[75px] w-[125px] items-center justify-center">
          <BrandLogo />
        </div>
        <p className="text-sm font-black text-white/85">
          WAH Official — Belajar, Bereksplorasi, dan Bertumbuh.
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-sky-200/65">
          Media Pembelajaran IPAS • Sistem Peredaran Darah Manusia • Fase C Kurikulum Merdeka
        </p>
      </footer>

      {/* ===== TOAST ===== */}
      <div className="pointer-events-none fixed right-3 bottom-3 z-[99] flex w-[min(92vw,330px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "anim-pop flex items-center gap-3 rounded-2xl border-2 p-3 shadow-xl",
              t.tone === "level"
                ? "border-amber-300 bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                : t.tone === "badge"
                  ? "border-violet-300 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white"
                  : "border-white bg-white text-slate-800",
            )}
          >
            <span className="text-2xl">{t.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-black">{t.title}</p>
              {t.desc && <p className="truncate text-xs font-bold opacity-80">{t.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
