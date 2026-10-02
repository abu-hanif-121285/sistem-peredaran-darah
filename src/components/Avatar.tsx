import { cn } from "@/utils/cn";
import { IMG } from "@/assets/images";

const GUIDE_IMAGE = {
  putra: IMG.guideRaka,
  putri: IMG.guideHana,
} as const;

export default function Avatar({
  type = "putra",
  size = 40,
}: {
  type?: "putra" | "putri";
  size?: number;
}) {
  return (
    <span
      className="inline-block shrink-0 overflow-hidden rounded-full bg-[#d9eaf7]"
      style={{ width: size, height: size }}
    >
      <img
        src={GUIDE_IMAGE[type]}
        alt={`Avatar siswa ${type}`}
        className="h-full w-full object-cover"
        style={{ transform: "scale(1.9)", transformOrigin: "50% 20%" }}
      />
    </span>
  );
}

export function Guide({
  type = "putri",
  size = 150,
  className,
}: {
  type?: "putra" | "putri";
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={GUIDE_IMAGE[type]}
      width={size}
      height={Math.round(size * 1.42)}
      alt={type === "putri" ? "Hana, pemandu belajar 3D berhijab panjang dan bergamis" : "Raka, pemandu belajar 3D bercelana panjang"}
      loading="lazy"
      className={cn("shrink-0 rounded-2xl object-cover object-center", className)}
      style={{ width: size, height: Math.round(size * 1.42) }}
    />
  );
}

export function GuideBubble({
  text,
  type = "putri",
  className,
}: {
  text: string;
  type?: "putra" | "putri";
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-2", className)}>
      <Guide type={type} size={56} className="anim-float" />
      <div className="relative rounded-2xl rounded-bl-none border-2 border-sky-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 shadow-md">
        {text}
      </div>
    </div>
  );
}
