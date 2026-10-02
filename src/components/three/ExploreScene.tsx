import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BloodCells, Capillaries, Lights, Tube, VesselNetwork } from "./parts";
import AnatomicalHeart from "./AnatomicalHeart";
import { RealisticBody, RealisticLungs } from "./RealisticBody";

export type ExploreMode = "tubuh" | "jantung" | "pembuluh" | "darah";
export type ViewPreset = "depan" | "samping" | "sistem";

const LANTAI_ARC: [number, number, number][] = [
  [-2.6, -3.3, 0],
  [0, -3.3, 1.2],
  [2.6, -3.3, 0],
];

/* ============ KAMERA HALUS (hanya bergerak saat preset berubah) ============ */
function CameraRig({
  pos,
  target,
  stamp,
}: {
  pos: [number, number, number];
  target: [number, number, number];
  stamp: string;
}) {
  const { camera, controls, gl } = useThree();
  const pv = useMemo(() => new THREE.Vector3(...pos), [pos]);
  const tv = useMemo(() => new THREE.Vector3(...target), [target]);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
  }, [stamp]);

  useEffect(() => {
    const stop = () => (active.current = false);
    const el = gl.domElement;
    el.addEventListener("pointerdown", stop);
    el.addEventListener("wheel", stop, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
    };
  }, [gl]);

  useFrame((_, dt) => {
    if (!active.current) return;
    const k = 1 - Math.pow(0.004, Math.min(dt, 0.05));
    camera.position.lerp(pv, k);
    const c = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (c?.target) {
      c.target.lerp(tv, k);
      c.update();
    }
    if (camera.position.distanceTo(pv) < 0.04) active.current = false;
  });
  return null;
}

/* ============ PENANDA HOTSPOT ============ */
function Marker({
  position,
  label,
  onClick,
  active,
  tone = "rose",
}: {
  position: [number, number, number];
  label: string;
  onClick: () => void;
  active?: boolean;
  tone?: "rose" | "sky" | "violet" | "amber";
}) {
  const colors: Record<string, string> = {
    rose: "bg-rose-500 border-rose-200",
    sky: "bg-sky-500 border-sky-200",
    violet: "bg-violet-500 border-violet-200",
    amber: "bg-amber-500 border-amber-100",
  };
  return (
    <Html position={position} center distanceFactor={9} zIndexRange={[20, 0]}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`press flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-[11px] font-black whitespace-nowrap text-white shadow-lg transition-transform hover:scale-110 ${
          colors[tone]
        } ${active ? "ring-4 ring-white/70" : ""}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        {label}
      </button>
    </Html>
  );
}

/* ============ ISI SCENE ============ */
function SceneContent({
  mode,
  selected,
  onSelect,
  beating,
}: {
  mode: ExploreMode;
  selected: string | null;
  onSelect: (id: string) => void;
  beating: boolean;
}) {
  const hover = (on: boolean) => (document.body.style.cursor = on ? "pointer" : "auto");

  if (mode === "jantung") {
    return (
      <group position={[0, -0.45, 0]}>
        <AnatomicalHeart beating={beating} scale={1.25} />
        <Marker position={[-1.35, 0.75, 0.55]} label="Serambi Kanan" tone="sky" active={selected === "serambi-kanan"} onClick={() => onSelect("serambi-kanan")} />
        <Marker position={[1.3, 0.95, -0.3]} label="Serambi Kiri" tone="rose" active={selected === "serambi-kiri"} onClick={() => onSelect("serambi-kiri")} />
        <Marker position={[-0.95, -0.55, 1.0]} label="Bilik Kanan" tone="sky" active={selected === "bilik-kanan"} onClick={() => onSelect("bilik-kanan")} />
        <Marker position={[1.05, -0.85, 0.75]} label="Bilik Kiri" tone="rose" active={selected === "bilik-kiri"} onClick={() => onSelect("bilik-kiri")} />
        <Marker position={[0.55, 2.55, -0.45]} label="Aorta" tone="rose" active={selected === "aorta"} onClick={() => onSelect("aorta")} />
        <Marker position={[-0.3, 1.75, 0.75]} label="Arteri Pulmonalis" tone="violet" active={selected === "arteri-paru"} onClick={() => onSelect("arteri-paru")} />
        <Marker position={[-1.15, 2.6, 0]} label="Vena Kava" tone="sky" active={selected === "vena-kava"} onClick={() => onSelect("vena-kava")} />
        <Marker position={[0.2, -0.1, 1.15]} label="Arteri Koroner" tone="amber" active={selected === "koroner"} onClick={() => onSelect("koroner")} />
        <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.4, 48]} />
          <meshStandardMaterial color="#1b2a4a" transparent opacity={0.3} />
        </mesh>
      </group>
    );
  }

  if (mode === "darah") {
    return (
      <group>
        <BloodCells
          highlight={
            selected === "sel-merah"
              ? "merah"
              : selected === "sel-putih"
                ? "putih"
                : selected === "keping"
                  ? "keping"
                  : selected === "plasma"
                    ? "plasma"
                    : null
          }
          onPickRed={() => onSelect("sel-merah")}
          onPickWhite={() => onSelect("sel-putih")}
          onPickPlatelet={() => onSelect("keping")}
          onPickPlasma={() => onSelect("plasma")}
        />
        <Marker position={[1.75, 1.0, 0.9]} label="Sel Darah Merah" tone="rose" active={selected === "sel-merah"} onClick={() => onSelect("sel-merah")} />
        <Marker position={[-1.9, -1.5, 0]} label="Sel Darah Putih" active={selected === "sel-putih"} tone="violet" onClick={() => onSelect("sel-putih")} />
        <Marker position={[0.4, -2.1, 1.1]} label="Keping Darah" tone="amber" active={selected === "keping"} onClick={() => onSelect("keping")} />
        <Marker position={[-1.1, 2.4, 0]} label="Plasma" tone="amber" active={selected === "plasma"} onClick={() => onSelect("plasma")} />
      </group>
    );
  }

  const vesselMode = mode === "pembuluh";
  return (
    <group position={[0, -0.3, 0]}>
      <RealisticBody opacity={vesselMode ? 0.07 : 0.13} />
      {!vesselMode && (
        <RealisticLungs
          position={[0.05, 1.6, -0.05]}
          highlight={selected === "paru"}
          onClick={() => onSelect("paru")}
        />
      )}
      <group
        position={[-0.25, 1.4, 0.18]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("jantung");
        }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <AnatomicalHeart beating={beating} scale={0.34} highlight={selected === "jantung"} showCoronaries={false} />
      </group>
      <VesselNetwork
        hiArteri={selected === "arteri"}
        hiVena={selected === "vena"}
        onArteri={() => onSelect("arteri")}
        onVena={() => onSelect("vena")}
      />
      <Capillaries highlight={selected === "kapiler"} onClick={() => onSelect("kapiler")} />

      <Marker position={[-1.0, 1.95, 0.6]} label="🫀 Jantung" active={selected === "jantung"} onClick={() => onSelect("jantung")} />
      <Marker position={[1.75, 1.3, 0.3]} label="Arteri" active={selected === "arteri"} onClick={() => onSelect("arteri")} />
      <Marker position={[-1.85, 0.55, -0.3]} label="Vena" tone="sky" active={selected === "vena"} onClick={() => onSelect("vena")} />
      <Marker position={[1.15, -2.35, 0]} label="Kapiler" tone="violet" active={selected === "kapiler"} onClick={() => onSelect("kapiler")} />
      {!vesselMode && (
        <Marker position={[1.25, 2.55, 0]} label="Paru-paru" tone="violet" active={selected === "paru"} onClick={() => onSelect("paru")} />
      )}

      {/* lantai lembut */}
      <mesh position={[0, -3.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#16305c" transparent opacity={0.3} />
      </mesh>
      <Tube points={LANTAI_ARC} color="#2563eb" radius={0.02} opacity={0.4} />
    </group>
  );
}

const CAM: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  "tubuh-depan": { pos: [0, -0.3, 10.6], target: [0, -0.3, 0] },
  "tubuh-samping": { pos: [10.2, -0.1, 1.4], target: [0, -0.3, 0] },
  "tubuh-sistem": { pos: [5.2, 2.8, 8.6], target: [0, -0.3, 0] },
  "pembuluh-depan": { pos: [0, -0.3, 9.8], target: [0, -0.3, 0] },
  "pembuluh-samping": { pos: [9.6, -0.1, 1.2], target: [0, -0.3, 0] },
  "pembuluh-sistem": { pos: [4.8, 2.6, 8], target: [0, -0.3, 0] },
  "jantung-depan": { pos: [0, 0.3, 6.8], target: [0, 0.3, 0] },
  "jantung-samping": { pos: [6.5, 0.4, 1], target: [0, 0.3, 0] },
  "jantung-sistem": { pos: [3.9, 2.6, 5.4], target: [0, 0.3, 0] },
  "darah-depan": { pos: [0, 0, 8.2], target: [0, 0, 0] },
  "darah-samping": { pos: [7.8, 0.5, 0.8], target: [0, 0, 0] },
  "darah-sistem": { pos: [4, 3.2, 6.2], target: [0, 0, 0] },
};

export default function ExploreScene({
  mode,
  view,
  selected,
  onSelect,
  beating,
  zoom = 1,
  autoRotate = false,
}: {
  mode: ExploreMode;
  view: ViewPreset;
  selected: string | null;
  onSelect: (id: string) => void;
  beating: boolean;
  zoom?: number;
  autoRotate?: boolean;
}) {
  const base = CAM[`${mode}-${view}`] ?? CAM["tubuh-depan"];
  const cam = useMemo(
    () => ({
      pos: [
        base.target[0] + (base.pos[0] - base.target[0]) / zoom,
        base.target[1] + (base.pos[1] - base.target[1]) / zoom,
        base.target[2] + (base.pos[2] - base.target[2]) / zoom,
      ] as [number, number, number],
      target: base.target,
    }),
    [base, zoom],
  );
  const ctrl = useRef(null);
  return (
    <Canvas
      camera={{ position: [0, -0.3, 10.6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onSelect("")}
    >
      <color attach="background" args={["#0b1b35"]} />
      <fog attach="fog" args={["#0b1b35", 12, 26]} />
      <Lights />
      <Suspense fallback={null}>
        <SceneContent mode={mode} selected={selected} onSelect={onSelect} beating={beating} />
      </Suspense>
      <OrbitControls
        ref={ctrl}
        makeDefault
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={16}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        maxPolarAngle={Math.PI * 0.92}
      />
      <CameraRig pos={cam.pos} target={cam.target} stamp={`${mode}-${view}-${zoom}`} />
    </Canvas>
  );
}
