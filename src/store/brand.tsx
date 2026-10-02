import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Penyimpanan logo asli WAH Official.
 * Berkas disimpan APA ADANYA (tanpa crop/kompresi/filter) dengan beberapa lapis cadangan:
 *   1) memori sesi (selalu berhasil)      2) localStorage (data URL)
 *   3) IndexedDB (Blob)                   4) berkas statis /images/logo-wah-official.png
 */
const LS_KEY = "wah_logo_dataurl_v1";
const LS_REMOTE = "wah_logo_remote_v1";
const DB_NAME = "wah-official-assets";
const STORE = "originals";
const KEY = "logo";
const STATIC_PATH = "/images/logo-wah-official.png";
const MAX_BYTES = 15 * 1024 * 1024;

type BrandCtx = {
  logoUrl: string | null;
  isOriginal: boolean;
  busy: boolean;
  error: string | null;
  notice: string | null;
  saveLogo: (file: Blob & { name?: string }) => Promise<boolean>;
  saveFromUrl: (url: string) => Promise<boolean>;
  removeLogo: () => Promise<void>;
};

const Ctx = createContext<BrandCtx | null>(null);

/* ---------- IndexedDB (opsional) ---------- */
function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof indexedDB === "undefined") throw new Error("no idb");
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}
async function idbGet(): Promise<Blob | null> {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const rq = tx.objectStore(STORE).get(KEY);
    rq.onsuccess = () => resolve(rq.result instanceof Blob ? rq.result : null);
    rq.onerror = () => reject(rq.error);
    tx.oncomplete = () => db.close();
  });
}
async function idbPut(blob: Blob | null): Promise<void> {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const st = tx.objectStore(STORE);
    if (blob) st.put(blob, KEY);
    else st.delete(KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/* ---------- util ---------- */
function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
function lsGet(k: string) {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string | null) {
  try {
    if (v === null) window.localStorage.removeItem(k);
    else window.localStorage.setItem(k, v);
    return true;
  } catch {
    return false;
  }
}
function looksLikeImage(file: Blob & { name?: string }) {
  if (file.type && file.type.startsWith("image/")) return true;
  const n = (file.name ?? "").toLowerCase();
  return /\.(png|jpe?g|webp|gif|svg|bmp|avif)$/.test(n);
}
function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im.naturalWidth > 0);
    im.onerror = () => resolve(false);
    im.src = url;
  });
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isOriginal, setIsOriginal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const objUrl = useRef<string | null>(null);

  const show = useCallback((url: string | null, original: boolean) => {
    if (objUrl.current && objUrl.current !== url) {
      URL.revokeObjectURL(objUrl.current);
      objUrl.current = null;
    }
    setLogoUrl(url);
    setIsOriginal(original && !!url);
  }, []);

  /* muat logo tersimpan */
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = lsGet(LS_KEY);
      if (data && alive) {
        show(data, true);
        return;
      }
      try {
        const blob = await idbGet();
        if (blob && alive) {
          objUrl.current = URL.createObjectURL(blob);
          show(objUrl.current, true);
          return;
        }
      } catch {
        /* IndexedDB tidak tersedia — lanjut */
      }
      const remote = lsGet(LS_REMOTE);
      if (remote && alive && (await probeImage(remote))) {
        show(remote, true);
        return;
      }
      if (alive && (await probeImage(STATIC_PATH))) show(STATIC_PATH, true);
    })();
    return () => {
      alive = false;
    };
  }, [show]);

  const saveLogo = useCallback(
    async (file: Blob & { name?: string }) => {
      setError(null);
      setNotice(null);
      if (!looksLikeImage(file)) {
        setError("Berkas yang dipilih bukan gambar. Gunakan PNG, JPG, WebP, atau SVG logo asli.");
        return false;
      }
      if (file.size === 0 || file.size > MAX_BYTES) {
        setError("Ukuran berkas harus antara 1 byte dan 15 MB.");
        return false;
      }
      setBusy(true);
      try {
        const dataUrl = await readAsDataUrl(file);
        // 1) tampil segera (memori sesi)
        show(dataUrl, true);
        // 2) simpan permanen bila browser mengizinkan
        const okLs = lsSet(LS_KEY, dataUrl);
        let okIdb = false;
        try {
          await idbPut(file);
          okIdb = true;
        } catch {
          okIdb = false;
        }
        lsSet(LS_REMOTE, null);
        setNotice(
          okLs || okIdb
            ? "Logo asli tersimpan dan tampil di seluruh aplikasi."
            : "Logo asli tampil untuk sesi ini. Penyimpanan browser diblokir, jadi unggah ulang jika halaman dimuat kembali.",
        );
        return true;
      } catch {
        setError("Berkas tidak dapat dibaca. Coba pilih berkas logo yang lain.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [show],
  );

  const saveFromUrl = useCallback(
    async (url: string) => {
      setError(null);
      setNotice(null);
      const u = url.trim();
      if (!/^https?:\/\//i.test(u) && !u.startsWith("data:image/")) {
        setError("Tautan harus diawali http:// atau https://");
        return false;
      }
      setBusy(true);
      try {
        try {
          const res = await fetch(u, { mode: "cors" });
          if (res.ok) {
            const blob = await res.blob();
            if (blob.type.startsWith("image/")) {
              setBusy(false);
              return await saveLogo(blob);
            }
          }
        } catch {
          /* CORS diblokir → pakai tautan langsung */
        }
        if (await probeImage(u)) {
          show(u, true);
          lsSet(LS_REMOTE, u);
          lsSet(LS_KEY, null);
          setNotice("Logo ditampilkan dari tautan. Pastikan tautan tetap aktif.");
          return true;
        }
        setError("Gambar pada tautan tersebut tidak dapat dimuat.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [saveLogo, show],
  );

  const removeLogo = useCallback(async () => {
    lsSet(LS_KEY, null);
    lsSet(LS_REMOTE, null);
    try {
      await idbPut(null);
    } catch {
      /* abaikan */
    }
    show(null, false);
    setNotice("Logo dihapus dari perangkat ini.");
    setError(null);
  }, [show]);

  const value = useMemo<BrandCtx>(
    () => ({ logoUrl, isOriginal, busy, error, notice, saveLogo, saveFromUrl, removeLogo }),
    [logoUrl, isOriginal, busy, error, notice, saveLogo, saveFromUrl, removeLogo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrand() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBrand harus dipakai di dalam BrandProvider");
  return c;
}
