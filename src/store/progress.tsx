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
import { BADGES, EXPLORE_SPOTS, LEVELS, MISSIONS, MATERI } from "@/data/content";
import { sfx, setAudioEnabled } from "@/lib/audio";

export type QuizAttempt = {
  date: string;
  score: number;
  correct: number;
  wrong: number;
  percent: number;
  timeSec: number;
};

export type SaveData = {
  name: string;
  avatar: "putra" | "putri";
  xp: number;
  badges: string[];
  missions: string[];
  materiRead: string[];
  explored: string[];
  simDone: boolean;
  latihan: Record<string, { best: number; total: number }>;
  quiz: QuizAttempt[];
  audio: boolean;
  createdAt: string;
};

const KEY = "wah_jelajah_darah_v1";

const EMPTY: SaveData = {
  name: "",
  avatar: "putra",
  xp: 0,
  badges: [],
  missions: [],
  materiRead: [],
  explored: [],
  simDone: false,
  latihan: {},
  quiz: [],
  audio: true,
  createdAt: new Date().toISOString(),
};

function load(): SaveData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function save(data: SaveData) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* localStorage penuh / diblokir - abaikan */
  }
}

export type Toast = { id: number; icon: string; title: string; desc?: string; tone: "xp" | "badge" | "level" | "info" };

type Ctx = {
  data: SaveData;
  level: (typeof LEVELS)[number];
  nextLevel: (typeof LEVELS)[number] | null;
  levelProgress: number;
  progress: {
    materi: number;
    eksplorasi: number;
    simulasi: number;
    misi: number;
    latihan: number;
    kuis: number;
    total: number;
  };
  bestQuiz: number;
  toasts: Toast[];
  setName: (n: string, avatar: "putra" | "putri") => void;
  addXp: (amount: number, reason?: string) => void;
  completeMission: (id: string) => void;
  markMateri: (id: string) => void;
  markExplored: (id: string) => void;
  markSim: () => void;
  saveLatihan: (id: string, best: number, total: number) => void;
  addQuiz: (a: QuizAttempt) => void;
  awardBadge: (id: string) => void;
  toggleAudio: () => void;
  resetAll: () => void;
  patch: (p: Partial<SaveData>) => void;
};

const ProgressCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SaveData>(() => load());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);
  const prevLevel = useRef<number>(0);

  useEffect(() => {
    save(data);
  }, [data]);

  useEffect(() => {
    setAudioEnabled(data.audio);
  }, [data.audio]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = toastId.current++;
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3400);
  }, []);

  const level = useMemo(() => {
    let found = LEVELS[0];
    for (const l of LEVELS) if (data.xp >= l.minXp) found = l;
    return found;
  }, [data.xp]);

  const nextLevel = useMemo(() => LEVELS.find((l) => l.minXp > data.xp) ?? null, [data.xp]);

  const levelProgress = useMemo(() => {
    if (!nextLevel) return 100;
    const span = nextLevel.minXp - level.minXp;
    return Math.min(100, Math.round(((data.xp - level.minXp) / span) * 100));
  }, [data.xp, level, nextLevel]);

  useEffect(() => {
    if (prevLevel.current === 0) {
      prevLevel.current = level.id;
      return;
    }
    if (level.id > prevLevel.current) {
      prevLevel.current = level.id;
      sfx.levelUp();
      pushToast({
        icon: "🎉",
        title: `NAIK LEVEL ${level.id}!`,
        desc: level.title,
        tone: "level",
      });
    }
  }, [level, pushToast]);

  const bestQuiz = useMemo(
    () => data.quiz.reduce((m, q) => Math.max(m, q.score), 0),
    [data.quiz],
  );

  const progress = useMemo(() => {
    const materi = Math.round((data.materiRead.length / MATERI.length) * 100);
    const ditemukan = data.explored.filter((e) => EXPLORE_SPOTS.includes(e)).length;
    const eksplorasi = Math.min(100, Math.round((ditemukan / EXPLORE_SPOTS.length) * 100));
    const simulasi = data.simDone ? 100 : 0;
    const misi = Math.round((data.missions.length / MISSIONS.length) * 100);
    const latihanIds = Object.keys(data.latihan).length;
    const latihan = Math.min(100, Math.round((latihanIds / 6) * 100));
    const kuis = data.quiz.length ? Math.max(...data.quiz.map((q) => q.percent)) : 0;
    const total = Math.round((materi + eksplorasi + simulasi + misi + latihan + kuis) / 6);
    return { materi, eksplorasi, simulasi, misi, latihan, kuis, total };
  }, [data]);

  const addXp = useCallback(
    (amount: number, reason?: string) => {
      if (amount <= 0) return;
      setData((d) => ({ ...d, xp: d.xp + amount }));
      pushToast({ icon: "⚡", title: `+${amount} XP`, desc: reason, tone: "xp" });
    },
    [pushToast],
  );

  const awardBadge = useCallback(
    (id: string) => {
      setData((d) => {
        if (d.badges.includes(id)) return d;
        const b = BADGES.find((x) => x.id === id);
        if (b) {
          sfx.badge();
          window.setTimeout(
            () => pushToast({ icon: b.icon, title: "BADGE BARU!", desc: b.name, tone: "badge" }),
            350,
          );
        }
        return { ...d, badges: [...d.badges, id] };
      });
    },
    [pushToast],
  );

  const completeMission = useCallback(
    (id: string) => {
      setData((d) => {
        if (d.missions.includes(id)) return d;
        const m = MISSIONS.find((x) => x.id === id);
        if (!m) return d;
        sfx.mission();
        window.setTimeout(
          () =>
            pushToast({
              icon: "⭐",
              title: "Misi selesai!",
              desc: `${m.title} · +${m.xp} XP`,
              tone: "xp",
            }),
          200,
        );
        const nextMissions = [...d.missions, id];
        const nextBadges = [...d.badges];
        if (nextMissions.length >= MISSIONS.length && !nextBadges.includes("penjelajah-misi"))
          nextBadges.push("penjelajah-misi");
        return { ...d, missions: nextMissions, xp: d.xp + m.xp, badges: nextBadges };
      });
    },
    [pushToast],
  );

  const markMateri = useCallback(
    (id: string) => {
      setData((d) => {
        if (d.materiRead.includes(id)) return d;
        const list = [...d.materiRead, id];
        const badges = [...d.badges];
        if (list.length >= MATERI.length && !badges.includes("kutu-buku")) badges.push("kutu-buku");
        return { ...d, materiRead: list, xp: d.xp + 25, badges };
      });
      pushToast({ icon: "📚", title: "+25 XP", desc: "Materi dipelajari", tone: "xp" });
    },
    [pushToast],
  );

  const markExplored = useCallback((id: string) => {
    setData((d) => {
      if (d.explored.includes(id)) return d;
      return { ...d, explored: [...d.explored, id], xp: d.xp + 15 };
    });
  }, []);

  const markSim = useCallback(() => {
    setData((d) => (d.simDone ? d : { ...d, simDone: true, xp: d.xp + 60 }));
  }, []);

  const saveLatihan = useCallback((id: string, best: number, total: number) => {
    setData((d) => {
      const prev = d.latihan[id];
      const bestScore = prev ? Math.max(prev.best, best) : best;
      return { ...d, latihan: { ...d.latihan, [id]: { best: bestScore, total } } };
    });
  }, []);

  const addQuiz = useCallback((a: QuizAttempt) => {
    setData((d) => {
      const badges = [...d.badges];
      if (a.percent >= 80 && !badges.includes("juara-kuis")) badges.push("juara-kuis");
      return { ...d, quiz: [a, ...d.quiz].slice(0, 20), xp: d.xp + Math.round(a.score * 1.5), badges };
    });
  }, []);

  const setName = useCallback((n: string, avatar: "putra" | "putri") => {
    setData((d) => ({ ...d, name: n.trim() || "Penjelajah", avatar }));
  }, []);

  const toggleAudio = useCallback(() => setData((d) => ({ ...d, audio: !d.audio })), []);

  const resetAll = useCallback(() => {
    setData((d) => ({ ...EMPTY, name: d.name, avatar: d.avatar, audio: d.audio, createdAt: new Date().toISOString() }));
    prevLevel.current = 1;
  }, []);

  const patch = useCallback((p: Partial<SaveData>) => setData((d) => ({ ...d, ...p })), []);

  const value: Ctx = {
    data,
    level,
    nextLevel,
    levelProgress,
    progress,
    bestQuiz,
    toasts,
    setName,
    addXp,
    completeMission,
    markMateri,
    markExplored,
    markSim,
    saveLatihan,
    addQuiz,
    awardBadge,
    toggleAudio,
    resetAll,
    patch,
  };

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress() {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error("useProgress harus dipakai di dalam ProgressProvider");
  return c;
}
