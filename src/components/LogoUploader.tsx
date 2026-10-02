import { useEffect, useRef, useState, type DragEvent } from "react";
import { Button, Modal } from "./ui";
import BrandLogo from "./BrandLogo";
import { useBrand } from "@/store/brand";
import { cn } from "@/utils/cn";
import { sfx } from "@/lib/audio";

/**
 * Pengunggah logo asli. Empat cara: pilih berkas, seret-lepas, tempel (Ctrl+V), atau tautan.
 * Berkas disimpan & ditampilkan apa adanya — tidak digambar ulang, dipotong, atau diubah warnanya.
 */
export function LogoUploader({ compact = false, onSaved }: { compact?: boolean; onSaved?: () => void }) {
  const { logoUrl, isOriginal, busy, error, notice, saveLogo, saveFromUrl, removeLogo } = useBrand();
  const [drag, setDrag] = useState(false);
  const [url, setUrl] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File | Blob | undefined | null) => {
    if (!f) return;
    const ok = await saveLogo(f as File);
    if (ok) {
      sfx.correct();
      onSaved?.();
    } else sfx.wrong();
  };

  // tempel gambar dari clipboard
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const it of Array.from(items)) {
        if (it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) {
            e.preventDefault();
            void handleFile(f);
            return;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
    else {
      const link = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
      if (link) void saveFromUrl(link).then((ok) => ok && onSaved?.());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className={cn("shrink-0", compact ? "h-16 w-28" : "h-24 w-44")}>
          <BrandLogo />
        </div>
        <div className="min-w-[180px] flex-1 text-sm font-semibold text-slate-600">
          {isOriginal ? (
            <p className="text-emerald-700">✓ Logo asli sudah terpasang dan ditampilkan utuh.</p>
          ) : (
            <p>
              Saat ini tampil <b>versi vektor sementara</b>. Pasang berkas logo asli agar tampil persis
              seperti aslinya.
            </p>
          )}
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        className={cn(
          "press cursor-pointer rounded-2xl border-4 border-dashed p-4 text-center transition-colors",
          drag ? "border-sky-500 bg-sky-50" : "border-sky-200 bg-white hover:border-sky-400",
        )}
      >
        <p className="text-3xl">🖼️</p>
        <p className="mt-1 font-black text-slate-800">
          {busy ? "Menyimpan logo asli..." : "Klik untuk pilih berkas logo"}
        </p>
        <p className="text-xs font-bold text-slate-500">
          atau seret berkas ke sini · atau tekan <kbd className="rounded bg-slate-100 px-1">Ctrl</kbd>+
          <kbd className="rounded bg-slate-100 px-1">V</kbd> untuk menempel gambar
        </p>
        <p className="mt-1 text-[11px] font-semibold text-slate-400">PNG · JPG · WebP · SVG · maks. 15 MB</p>
        <input
          ref={input}
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.webp,.svg"
          className="sr-only"
          aria-label="Pilih berkas logo asli WAH Official"
          onChange={(e) => {
            const f = e.target.files?.[0];
            void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!url.trim()) return;
          const ok = await saveFromUrl(url);
          if (ok) {
            sfx.correct();
            setUrl("");
            onSaved?.();
          } else sfx.wrong();
        }}
        className="flex flex-wrap gap-2"
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Atau tempel tautan gambar logo (https://...)"
          className="min-w-[200px] flex-1 rounded-2xl border-2 border-slate-200 p-3 text-sm font-bold focus:border-sky-400 focus:outline-none"
        />
        <Button type="submit" variant="sky" size="md" disabled={busy || !url.trim()}>
          Pakai tautan
        </Button>
      </form>

      {notice && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700" role="status">
          ✅ {notice}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700" role="alert">
          ⚠️ {error}
        </p>
      )}

      {logoUrl && (
        <button
          type="button"
          onClick={() => void removeLogo()}
          className="press text-xs font-black text-slate-500 underline underline-offset-4 hover:text-rose-600"
        >
          Hapus logo yang tersimpan
        </button>
      )}
    </div>
  );
}

export function LogoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <p className="text-xl font-black text-slate-800">Pasang Logo Asli WAH Official</p>
      <p className="mb-3 text-sm font-semibold text-slate-500">
        Logo akan tampil di layar pembuka, header, beranda, dan footer tanpa diubah sedikit pun.
      </p>
      <LogoUploader onSaved={() => setTimeout(onClose, 900)} />
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  );
}
