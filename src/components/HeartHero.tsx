import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Lights, hasWebGL } from "./three/parts";
import AnatomicalHeart from "./three/AnatomicalHeart";
import { IMG } from "@/assets/images";
import { sfx } from "@/lib/audio";

export default function HeartHero({ height = 260 }: { height?: number }) {
  const [beating, setBeating] = useState(true);
  const ok = useMemo(() => hasWebGL(), []);

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-3xl border border-sky-300/20 bg-[radial-gradient(circle_at_50%_40%,#294c78_0%,#101d38_63%,#07172d_100%)] shadow-[0_18px_45px_-18px_rgba(7,23,45,0.8)]"
        style={{ height }}
      >
        {ok ? (
          <Canvas camera={{ position: [0.4, 0.5, 6.4], fov: 42 }} dpr={[1, 1.8]}>
            <Lights />
            <hemisphereLight args={["#ffe4ea", "#13203a", 0.5]} />
            <AnatomicalHeart beating={beating} scale={1.05} position={[0, -0.45, 0]} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              target={[0, 0.2, 0]}
              autoRotate={beating}
              autoRotateSpeed={0.9}
              minPolarAngle={Math.PI * 0.25}
              maxPolarAngle={Math.PI * 0.75}
            />
          </Canvas>
        ) : (
          <img
            src={IMG.jantungRealistis}
            alt="Ilustrasi realistis jantung manusia"
            className="anim-heart h-full w-full object-contain p-4"
          />
        )}

        <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
          <span className={`h-2.5 w-2.5 rounded-full ${beating ? "bg-emerald-400" : "bg-slate-400"}`} />
          <span className="text-xs font-black text-white">
            {beating ? "Jantung sedang berdetak." : "Detak jantung dijeda."}
          </span>
        </div>

        <div className="absolute right-3 bottom-3 flex gap-2">
          <button
            onClick={() => {
              sfx.heartbeat();
              setBeating(true);
            }}
            disabled={beating}
            aria-label="Putar animasi detak jantung"
            title="Putar animasi detak jantung"
            className="press rounded-xl bg-white/90 px-3 py-2 text-sm font-black text-rose-600 shadow disabled:opacity-40"
          >
            ▶ Putar
          </button>
          <button
            onClick={() => {
              sfx.click();
              setBeating(false);
            }}
            disabled={!beating}
            aria-label="Jeda animasi detak jantung"
            title="Jeda animasi detak jantung"
            className="press rounded-xl bg-white/90 px-3 py-2 text-sm font-black text-slate-700 shadow disabled:opacity-40"
          >
            ⏸ Jeda
          </button>
        </div>
      </div>
    </div>
  );
}
