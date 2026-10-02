import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";

/* ================= BUTTON ================= */
type Variant = "primary" | "secondary" | "ghost" | "success" | "sky" | "amber" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:from-rose-400 hover:to-red-500 border-b-4 border-red-700/60",
  secondary:
    "bg-white text-slate-700 border-2 border-slate-200 hover:border-rose-300 hover:text-rose-600 shadow-sm",
  ghost: "bg-white/10 text-white hover:bg-white/20 border border-white/25",
  success:
    "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border-b-4 border-emerald-700/60",
  sky: "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 border-b-4 border-blue-700/60",
  amber:
    "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 border-b-4 border-orange-600/60",
  danger: "bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg border-b-4 border-black/40",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }) {
  return (
    <button
      {...rest}
      onClick={(e) => {
        sfx.click();
        onClick?.(e);
      }}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold tracking-wide transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "px-3.5 py-2 text-sm",
        size === "md" && "px-5 py-3 text-[15px]",
        size === "lg" && "px-7 py-4 text-lg",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ================= ICON BUTTON + TOOLTIP ================= */
export function IconButton({
  label,
  children,
  active,
  className,
  onClick,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
  return (
    <span className="group relative inline-flex">
      <button
        {...rest}
        aria-label={label}
        title={label}
        onClick={(e) => {
          sfx.click();
          onClick?.(e);
        }}
        className={cn(
          "press flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300",
          active
            ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30"
            : "border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-600",
          className,
        )}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute -bottom-9 left-1/2 z-50 -translate-x-1/2 scale-90 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

/* ================= CARD ================= */
export function Card({
  className,
  children,
  hover,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/80 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(23,37,84,0.25)]",
        hover && "card-3d hover:shadow-[0_22px_45px_-15px_rgba(23,37,84,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ================= PROGRESS BAR ================= */
export function ProgressBar({
  value,
  className,
  color = "from-rose-400 to-red-500",
  showLabel,
  height = "h-3.5",
}: {
  value: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
  height?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("w-full overflow-hidden rounded-full bg-slate-200/80", height)}
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", color)}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-11 shrink-0 text-right text-xs font-extrabold text-slate-600">{v}%</span>
      )}
    </div>
  );
}

/* ================= SECTION TITLE ================= */
export function PageTitle({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="anim-slide mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-3xl shadow-lg shadow-rose-500/30">
          <span>{icon}</span>
        </div>
        <div>
          <h1 className="text-2xl leading-tight font-black text-slate-800 sm:text-3xl">{title}</h1>
          {subtitle && <p className="text-sm font-semibold text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ================= MODAL ================= */
export function Modal({
  open,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "anim-pop relative max-h-[88vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl",
          wide ? "max-w-3xl" : "max-w-lg",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ================= FEEDBACK BANNER ================= */
export function Feedback({ status, text }: { status: "benar" | "salah" | null; text: string }) {
  if (!status) return null;
  return (
    <div
      className={cn(
        "anim-pop flex items-start gap-3 rounded-2xl border-2 p-4",
        status === "benar"
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : "border-amber-300 bg-amber-50 text-amber-800",
      )}
      role="status"
    >
      <span className="text-2xl">{status === "benar" ? "🎉" : "💡"}</span>
      <div>
        <p className="font-black">{status === "benar" ? "LUAR BIASA!" : "Belum tepat, ayo coba lagi!"}</p>
        <p className="text-sm font-semibold">{text}</p>
      </div>
    </div>
  );
}

/* ================= CONFETTI ================= */
export function Confetti({ show }: { show: boolean }) {
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 1.8 + Math.random() * 1.4,
      color: ["#f43f5e", "#fb923c", "#facc15", "#34d399", "#38bdf8", "#a78bfa"][i % 6],
      size: 7 + Math.random() * 8,
    })),
  );
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 1.6,
            animation: `confettiFall ${p.dur}s ease-in ${p.delay}s forwards`,
          }}
          className="absolute top-0 rounded-sm"
        />
      ))}
    </div>
  );
}

/* ================= STAT PILL ================= */
export function Stat({
  icon,
  label,
  value,
  color = "bg-rose-50 text-rose-600",
}: {
  icon: string;
  label: string;
  value: ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xl", color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
        <p className="truncate text-lg font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
