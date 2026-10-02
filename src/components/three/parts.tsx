import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ============ util: cek dukungan WebGL ============ */
export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* ============ gelombang detak jantung (lub–dub) ============ */
export function beatWave(t: number) {
  const x = t % 1;
  const p1 = Math.exp(-Math.pow((x - 0.1) / 0.055, 2));
  const p2 = 0.55 * Math.exp(-Math.pow((x - 0.33) / 0.07, 2));
  return p1 + p2;
}

/* ============ TUBE (pembuluh darah) ============ */
export function Tube({
  points,
  color,
  radius = 0.055,
  opacity = 1,
  emissive = 0.25,
  children,
  ...rest
}: {
  points: [number, number, number][];
  color: string;
  radius?: number;
  opacity?: number;
  emissive?: number;
  children?: ReactNode;
} & Record<string, unknown>) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 64, radius, 10, false);
  }, [points, radius]);
  return (
    <mesh geometry={geo} {...rest}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.04}
        clearcoat={0.6}
        clearcoatRoughness={0.18}
        emissive={color}
        emissiveIntensity={emissive}
        transparent={opacity < 1}
        opacity={opacity}
      />
      {children}
    </mesh>
  );
}

/* Jalur pembuluh pada model jantung (konstanta modul agar geometri tidak dibuat ulang) */
const HEART_AORTA: [number, number, number][] = [
  [0.1, 0.85, 0],
  [0.18, 1.3, -0.05],
  [-0.2, 1.75, -0.1],
];
const HEART_VENA_A: [number, number, number][] = [
  [-0.35, 0.9, -0.1],
  [-0.55, 1.35, -0.2],
  [-0.95, 1.6, -0.25],
];
const HEART_VENA_B: [number, number, number][] = [
  [0.55, 0.85, -0.1],
  [0.85, 1.25, -0.15],
  [1.15, 1.5, -0.2],
];

/* ============ JANTUNG STILASI (ramah anak) ============ */
export function Heart({
  beating = true,
  speed = 1,
  scale = 1,
  color = "#ef4b63",
  onBeat,
  ...rest
}: {
  beating?: boolean;
  speed?: number;
  scale?: number;
  color?: string;
  onBeat?: () => void;
} & Record<string, unknown>) {
  const g = useRef<THREE.Group>(null);
  const last = useRef(0);
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.95);
    shape.bezierCurveTo(-0.58, -0.5, -1.18, 0.07, -1.03, 0.69);
    shape.bezierCurveTo(-0.91, 1.26, -0.23, 1.27, 0, 0.78);
    shape.bezierCurveTo(0.23, 1.27, 0.91, 1.26, 1.03, 0.69);
    shape.bezierCurveTo(1.18, 0.07, 0.58, -0.5, 0, -0.95);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.19,
      bevelThickness: 0.26,
      curveSegments: 24,
      steps: 1,
    });
    geometry.translate(0, 0, -0.23);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useFrame((state) => {
    if (!g.current) return;
    if (!beating) {
      g.current.scale.setScalar(scale);
      return;
    }
    const t = state.clock.elapsedTime * speed;
    const b = beatWave(t);
    g.current.scale.setScalar(scale * (1 + 0.075 * b));
    const cyc = Math.floor(t);
    if (cyc !== last.current) {
      last.current = cyc;
      onBeat?.();
    }
  });

  return (
    <group ref={g} {...rest}>
      <mesh geometry={heartGeometry} castShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.28}
          metalness={0.02}
          clearcoat={0.7}
          clearcoatRoughness={0.18}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[-0.47, 0.72, 0.46]} rotation={[0, 0, -0.5]} scale={[0.24, 0.1, 0.04]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#ffe5ec" transparent opacity={0.55} />
      </mesh>
      {/* pembuluh keluar-masuk jantung */}
      <Tube points={HEART_AORTA} color="#f87171" radius={0.11} />
      <Tube points={HEART_VENA_A} color="#60a5fa" radius={0.095} />
      <Tube points={HEART_VENA_B} color="#60a5fa" radius={0.09} />
    </group>
  );
}

/* ============ PARU-PARU ============ */
export function Lungs({ onClick, highlight }: { onClick?: () => void; highlight?: boolean }) {
  return (
    <group onClick={onClick}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.58, 1.95, -0.05]} scale={[0.42, 0.66, 0.4]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial
            color={highlight ? "#ff9fb4" : "#ffc2cf"}
            transparent
            opacity={0.45}
            roughness={0.5}
            clearcoat={0.3}
            emissive="#ff8fa6"
            emissiveIntensity={highlight ? 0.5 : 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============ TUBUH TRANSPARAN (ramah anak, tidak menyeramkan) ============ */
export function BodySilhouette({ opacity = 0.16 }: { opacity?: number }) {
  const mat = (
    <meshStandardMaterial
      color="#9ad2ff"
      transparent
      opacity={opacity}
      roughness={0.15}
      metalness={0.1}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  );
  return (
    <group>
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.6, 28, 28]} />
        {mat}
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.4, 16]} />
        {mat}
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <capsuleGeometry args={[0.78, 1.35, 8, 24]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.35, 0]} scale={[0.8, 0.5, 0.55]}>
        <sphereGeometry args={[1, 20, 20]} />
        {mat}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`arm${s}`} position={[s * 1.0, 1.45, 0]} rotation={[0, 0, s * 0.16]}>
          <capsuleGeometry args={[0.19, 1.55, 6, 16]} />
          {mat}
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`leg${s}`} position={[s * 0.36, -1.25, 0]}>
          <capsuleGeometry args={[0.25, 1.8, 6, 16]} />
          {mat}
        </mesh>
      ))}
    </group>
  );
}

/* ============ JARINGAN PEMBULUH ARTERI & VENA ============ */
export const ARTERI_PATHS: [number, number, number][][] = [
  [
    [-0.1, 1.95, 0.12],
    [0.08, 2.4, 0.12],
    [0.16, 2.9, 0.08],
    [0.26, 3.3, 0.04],
  ],
  [
    [0.0, 2.1, 0.12],
    [0.66, 2.24, 0.1],
    [1.02, 1.62, 0.1],
    [1.2, 0.72, 0.08],
    [1.26, 0.05, 0.05],
  ],
  [
    [-0.16, 1.55, 0.14],
    [-0.04, 0.95, 0.14],
    [0.14, 0.25, 0.12],
    [0.33, -0.7, 0.1],
    [0.42, -1.85, 0.08],
    [0.44, -2.55, 0.05],
  ],
];

export const VENA_PATHS: [number, number, number][][] = [
  [
    [-0.34, 3.3, -0.12],
    [-0.3, 2.85, -0.14],
    [-0.26, 2.4, -0.14],
    [-0.3, 1.95, -0.12],
  ],
  [
    [-1.26, 0.05, -0.1],
    [-1.18, 0.75, -0.12],
    [-1.0, 1.62, -0.12],
    [-0.62, 2.2, -0.12],
    [-0.36, 2.05, -0.12],
  ],
  [
    [-0.42, -2.55, -0.1],
    [-0.4, -1.85, -0.12],
    [-0.3, -0.7, -0.14],
    [-0.16, 0.25, -0.14],
    [-0.3, 0.95, -0.14],
    [-0.4, 1.5, -0.12],
  ],
];

export function VesselNetwork({
  showArteri = true,
  showVena = true,
  hiArteri,
  hiVena,
  onArteri,
  onVena,
}: {
  showArteri?: boolean;
  showVena?: boolean;
  hiArteri?: boolean;
  hiVena?: boolean;
  onArteri?: () => void;
  onVena?: () => void;
}) {
  return (
    <group>
      {showArteri &&
        ARTERI_PATHS.map((p, i) => (
          <Tube
            key={`a${i}`}
            points={p}
            color={hiArteri ? "#ff3b5c" : "#e8394f"}
            radius={hiArteri ? 0.075 : 0.06}
            emissive={hiArteri ? 0.85 : 0.25}
            onClick={(e: { stopPropagation: () => void }) => {
              e.stopPropagation();
              onArteri?.();
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
        ))}
      {showVena &&
        VENA_PATHS.map((p, i) => (
          <Tube
            key={`v${i}`}
            points={p}
            color={hiVena ? "#38bdf8" : "#2f7fd4"}
            radius={hiVena ? 0.075 : 0.06}
            emissive={hiVena ? 0.85 : 0.25}
            onClick={(e: { stopPropagation: () => void }) => {
              e.stopPropagation();
              onVena?.();
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
        ))}
    </group>
  );
}

/* ============ KAPILER (jaringan halus di ujung tubuh) ============ */
export function Capillaries({ onClick, highlight }: { onClick?: () => void; highlight?: boolean }) {
  const spots = useMemo<[number, number, number][]>(
    () => [
      [1.3, -0.15, 0.05],
      [-1.3, -0.15, -0.05],
      [0.45, -2.75, 0.05],
      [-0.45, -2.75, -0.05],
      [0.3, 3.45, 0],
    ],
    [],
  );
  const col = highlight ? "#f0abfc" : "#c084fc";
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {spots.map((s, i) => (
        <group key={i} position={s}>
          {Array.from({ length: 7 }).map((_, j) => {
            const a = (j / 7) * Math.PI * 2;
            return (
              <mesh
                key={j}
                position={[Math.cos(a) * 0.17, Math.sin(a) * 0.17, Math.sin(a * 2) * 0.08]}
                rotation={[0, 0, a]}
              >
                <capsuleGeometry args={[0.016, 0.22, 4, 6]} />
                <meshStandardMaterial
                  color={col}
                  emissive={col}
                  emissiveIntensity={highlight ? 0.9 : 0.35}
                />
              </mesh>
            );
          })}
          <mesh>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ============ SEL DARAH (mode DARAH) ============ */
export function BloodCells({
  onPickRed,
  onPickWhite,
  onPickPlatelet,
  onPickPlasma,
  highlight,
}: {
  onPickRed?: () => void;
  onPickWhite?: () => void;
  onPickPlatelet?: () => void;
  onPickPlasma?: () => void;
  highlight?: string | null;
}) {
  const grp = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (grp.current) grp.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.18) * 0.25;
  });

  const reds = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2;
        const r = 1.25 + (i % 3) * 0.42;
        return [Math.cos(a) * r, Math.sin(a * 1.4) * 0.85, Math.sin(a) * r * 0.7] as [
          number,
          number,
          number,
        ];
      }),
    [],
  );

  const redCellGeometry = useMemo(() => {
    const contour = [
      new THREE.Vector2(0, 0.035),
      new THREE.Vector2(0.07, 0.045),
      new THREE.Vector2(0.15, 0.105),
      new THREE.Vector2(0.22, 0.105),
      new THREE.Vector2(0.245, 0),
      new THREE.Vector2(0.22, -0.105),
      new THREE.Vector2(0.15, -0.105),
      new THREE.Vector2(0.07, -0.045),
      new THREE.Vector2(0, -0.035),
    ];
    const geometry = new THREE.LatheGeometry(contour, 24);
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }, []);

  const hover = (on: boolean) => (document.body.style.cursor = on ? "pointer" : "auto");

  return (
    <group ref={grp}>
      {/* plasma: medium cair */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onPickPlasma?.();
        }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <sphereGeometry args={[2.75, 32, 32]} />
        <meshStandardMaterial
          color="#fde68a"
          transparent
          opacity={highlight === "plasma" ? 0.3 : 0.14}
          roughness={0.1}
          depthWrite={false}
        />
      </mesh>

      {/* sel darah merah: cakram bikonkaf disederhanakan */}
      {reds.map((p, i) => (
        <group key={i} position={p} rotation={[i * 0.5, i * 0.9, i * 0.3]}>
          <mesh
            geometry={redCellGeometry}
            onClick={(e) => {
              e.stopPropagation();
              onPickRed?.();
            }}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
          >
            <meshPhysicalMaterial
              color={highlight === "merah" ? "#ff3355" : "#e23b52"}
              emissive="#ff6b7f"
              emissiveIntensity={highlight === "merah" ? 0.7 : 0.2}
              roughness={0.28}
              clearcoat={0.65}
            />
          </mesh>
        </group>
      ))}

      {/* sel darah putih */}
      {[
        [1.1, 1.15, 0.6],
        [-1.35, -0.75, -0.5],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          onClick={(e) => {
            e.stopPropagation();
            onPickWhite?.();
          }}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <sphereGeometry args={[0.33, 20, 20]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#e2e8f0"
            emissiveIntensity={highlight === "putih" ? 0.8 : 0.25}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* keping darah */}
      {[
        [0.2, -1.3, 0.9],
        [-0.6, 1.4, -0.9],
        [1.7, -0.4, -0.8],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          rotation={[i, i * 1.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onPickPlatelet?.();
          }}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={highlight === "keping" ? 0.8 : 0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============ PENCAHAYAAN STANDAR ============ */
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 6]} intensity={1.5} color="#fff4e7" />
      <directionalLight position={[-5, 2, -4]} intensity={0.8} color="#7dd3fc" />
      <pointLight position={[0, 1.6, 3]} intensity={15} distance={12} color="#ffd1dc" />
      <pointLight position={[3, -2, -3]} intensity={7} distance={10} color="#39bdf8" />
    </>
  );
}
