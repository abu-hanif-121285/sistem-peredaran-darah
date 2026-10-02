import { cn } from "@/utils/cn";
import { useBrand } from "@/store/brand";
import LogoWah from "./LogoWah";

/**
 * Menampilkan logo WAH Official di atas pelat putih agar selalu kontras.
 * Jika berkas logo asli sudah dipasang → ditampilkan utuh (object-contain, tanpa crop).
 * Jika belum → versi vektor sementara.
 */
export default function BrandLogo({
  className,
  plain = false,
}: {
  className?: string;
  /** tanpa pelat putih (dipakai saat latar sudah terang) */
  plain?: boolean;
}) {
  const { logoUrl } = useBrand();
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden",
        !plain && "rounded-2xl bg-white px-2 py-1.5 shadow-sm",
        className,
      )}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo WAH Official"
          draggable={false}
          className="block h-full w-full object-contain"
        />
      ) : (
        <LogoWah className="block h-full w-full" />
      )}
    </span>
  );
}
