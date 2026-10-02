import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Tube } from "./parts";

/* =====================================================================
 *  JANTUNG ANATOMIS REALISTIS (prosedural, tanpa aset eksternal)
 *  Sumbu: +x = kiri pasien (kanan penonton), +y = atas, +z = depan.
 * ===================================================================== */

type V3 = [number, number, number];

/* ---------- noise bernilai periodik (untuk tekstur otot) ---------- */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number, period: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const x0 = ((xi % period) + period) % period;
  const x1 = (x0 + 1) % period;
  const a = hash(x0, yi);
  const b = hash(x1, yi);
  const c = hash(x0, yi + 1);
  const d = hash(x1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number, period: number, oct = 4) {
  let v = 0;
  let amp = 0.5;
  let f = 1;
  let norm = 0;
  for (let i = 0; i < oct; i++) {
    v += amp * vnoise(x * f, y * f, period * f);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return v / norm;
}
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

let texCache: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

/** Tekstur otot jantung: serat merah gelap-terang, pembuluh halus, lemak epikardial di pangkal. */
function heartTextures() {
  if (texCache) return texCache;
  const S = 512;
  const cm = document.createElement("canvas");
  const cb = document.createElement("canvas");
  cm.width = cm.height = cb.width = cb.height = S;
  const ctxm = cm.getContext("2d")!;
  const ctxb = cb.getContext("2d")!;
  const im = ctxm.createImageData(S, S);
  const ib = ctxb.createImageData(S, S);
  const P = 6;
  for (let y = 0; y < S; y++) {
    const v = y / S; // 0 = pangkal (atas), 1 = apeks (bawah)
    for (let x = 0; x < S; x++) {
      const u = x / S;
      const n1 = fbm(u * P, v * 5, P, 4);
      const n2 = fbm(u * P + 11.3, v * 9 + 4.7, P, 3);
      const n3 = fbm(u * P + 3.9, v * 3 + 8.2, P, 3);
      const fiber = 0.5 + 0.5 * Math.sin((u * 48 + n1 * 6) * Math.PI); // serat otot halus
      const streak = Math.pow(1 - Math.min(1, Math.abs(n2 - 0.5) * 3.4), 9); // pembuluh kecil
      const fat = sstep(0.42, 0.04, v) * sstep(0.48, 0.74, n3) * 0.9;

      let r = 128 + 72 * n1 + 10 * fiber;
      let g = 28 + 34 * n1 + 6 * fiber;
      let b = 40 + 30 * n1;
      // lemak kekuningan
      r = r + (236 - r) * fat;
      g = g + (200 - g) * fat;
      b = b + (122 - b) * fat;
      // pembuluh halus lebih gelap
      r -= 48 * streak;
      g -= 16 * streak;
      b -= 18 * streak;

      const i = (y * S + x) * 4;
      im.data[i] = r;
      im.data[i + 1] = g;
      im.data[i + 2] = b;
      im.data[i + 3] = 255;

      const h = 128 + 60 * (n1 - 0.5) + 26 * (fiber - 0.5) - 70 * streak + 55 * fat;
      ib.data[i] = ib.data[i + 1] = ib.data[i + 2] = h;
      ib.data[i + 3] = 255;
    }
  }
  ctxm.putImageData(im, 0, 0);
  ctxb.putImageData(ib, 0, 0);
  const map = new THREE.CanvasTexture(cm);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  const bump = new THREE.CanvasTexture(cb);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  texCache = { map, bump };
  return texCache;
}

/* ---------- deformasi bola → massa ventrikel (apeks ke kiri bawah pasien) ---------- */
function deform(x: number, y: number, z: number): V3 {
  let X = x * 1.0;
  let Y = y * 1.2;
  let Z = z * 0.9;
  if (y < 0) {
    const k = -y;
    const taper = 1 - 0.56 * Math.pow(k, 1.6);
    X *= taper;
    Z *= taper;
    X += 0.44 * Math.pow(k, 1.3); // apeks mengarah ke kiri pasien
    Y -= 0.1 * k * k;
  } else {
    X += 0.1 * y;
    Y -= 0.08 * y * y; // pangkal agak datar
  }
  // tonjolan ventrikel kanan di depan-kanan pasien
  if (Z > 0 && X < 0.1 && Y > -0.7) Z += 0.08 * Math.exp(-Math.pow((X + 0.45) / 0.45, 2));
  // sulkus interventrikular anterior (alur tempat arteri koroner LAD)
  if (Z > 0) {
    const gx = -0.14 + (0.55 - Y) * 0.3;
    const d = X - gx;
    const groove = Math.exp(-(d * d) / 0.02) * Math.min(1, Math.max(0, Z / 0.5));
    Z -= 0.075 * groove;
    X -= 0.02 * groove * Math.sign(d || 1);
  }
  // sulkus koroner (batas serambi–bilik) sedikit mencekung
  const av = Math.exp(-Math.pow((Y - 0.5) / 0.09, 2));
  X *= 1 - 0.04 * av;
  Z *= 1 - 0.04 * av;
  return [X, Y, Z];
}

function makeVentricles() {
  const g = new THREE.SphereGeometry(1, 80, 60);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const [X, Y, Z] = deform(pos.getX(i), pos.getY(i), pos.getZ(i));
    pos.setXYZ(i, X, Y, Z);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

/** titik pada permukaan ventrikel ke arah (x,y,z), diangkat sedikit agar pembuluh koroner menempel */
function surf(x: number, y: number, z: number, lift = 0.02): V3 {
  const l = Math.hypot(x, y, z) || 1;
  const [X, Y, Z] = deform(x / l, y / l, z / l);
  return [X + (x / l) * lift, Y + (y / l) * lift, Z + (z / l) * lift];
}

/* ---------- jalur pembuluh besar (koordinat lokal jantung) ---------- */
export const HEART_PATHS = {
  aorta: [
    [0.08, 0.55, 0.05],
    [0.12, 1.05, 0.0],
    [0.18, 1.5, -0.12],
    [0.32, 1.86, -0.36],
    [0.52, 1.82, -0.66],
    [0.56, 1.45, -0.86],
    [0.5, 0.9, -0.95],
    [0.42, 0.1, -0.98],
    [0.36, -0.7, -0.95],
    [0.32, -1.35, -0.9],
  ] as V3[],
  cabang1: [
    [0.2, 1.72, -0.22],
    [0.05, 2.1, -0.2],
    [-0.08, 2.45, -0.2],
  ] as V3[],
  cabang2: [
    [0.34, 1.86, -0.38],
    [0.34, 2.2, -0.4],
    [0.36, 2.5, -0.42],
  ] as V3[],
  cabang3: [
    [0.48, 1.84, -0.56],
    [0.6, 2.15, -0.6],
    [0.78, 2.4, -0.62],
  ] as V3[],
  trunkusParu: [
    [-0.22, 0.5, 0.42],
    [-0.16, 0.9, 0.42],
    [-0.02, 1.25, 0.28],
    [-0.05, 1.35, 0.2],
  ] as V3[],
  arteriParuKiri: [
    [-0.05, 1.35, 0.2],
    [0.42, 1.3, 0.1],
    [0.85, 1.3, -0.22],
    [1.15, 1.25, -0.45],
  ] as V3[],
  arteriParuKanan: [
    [-0.05, 1.35, 0.2],
    [-0.35, 1.32, -0.15],
    [-0.7, 1.25, -0.4],
    [-1.1, 1.15, -0.5],
  ] as V3[],
  venaKavaAtas: [
    [-0.62, 2.45, -0.02],
    [-0.62, 1.7, -0.02],
    [-0.6, 1.15, -0.05],
    [-0.6, 0.8, -0.08],
  ] as V3[],
  venaKavaBawah: [
    [-0.6, 0.35, -0.3],
    [-0.62, -0.2, -0.5],
    [-0.6, -0.9, -0.6],
    [-0.56, -1.4, -0.62],
  ] as V3[],
  venaParu: [
    [
      [1.05, 0.95, -0.62],
      [0.82, 0.88, -0.6],
      [0.6, 0.82, -0.58],
    ],
    [
      [1.05, 0.55, -0.7],
      [0.82, 0.55, -0.66],
      [0.6, 0.55, -0.62],
    ],
    [
      [-0.75, 0.95, -0.62],
      [-0.4, 0.86, -0.6],
      [-0.1, 0.8, -0.6],
    ],
    [
      [-0.75, 0.6, -0.72],
      [-0.4, 0.57, -0.68],
      [-0.1, 0.55, -0.65],
    ],
  ] as V3[][],
};

/** titik acuan (lokal) untuk label dan jalur simulasi */
export const HEART_ANCHORS = {
  serambiKanan: [-0.62, 0.55, -0.05] as V3,
  serambiKiri: [0.3, 0.6, -0.5] as V3,
  bilikKanan: [-0.42, -0.05, 0.3] as V3,
  bilikKiri: [0.32, -0.2, -0.1] as V3,
  apeks: [0.44, -1.05, 0.0] as V3,
  katupTrikuspid: [-0.45, 0.25, 0.1] as V3,
  katupMitral: [0.3, 0.25, -0.3] as V3,
  akarAorta: [0.08, 0.55, 0.05] as V3,
  puncakLengkungAorta: [0.32, 1.86, -0.36] as V3,
  ujungAorta: [0.32, -1.35, -0.9] as V3,
  ujungVenaKavaAtas: [-0.62, 2.45, -0.02] as V3,
  ujungVenaKavaBawah: [-0.56, -1.4, -0.62] as V3,
  pangkalTrunkus: [-0.22, 0.5, 0.42] as V3,
  percabanganParu: [-0.05, 1.35, 0.2] as V3,
  ujungArteriParuKiri: [1.15, 1.25, -0.45] as V3,
  ujungArteriParuKanan: [-1.1, 1.15, -0.5] as V3,
  ujungVenaParuKiri: [1.05, 0.75, -0.66] as V3,
  ujungVenaParuKanan: [-0.75, 0.78, -0.67] as V3,
};

/* ---------- arteri & vena koroner (menempel di permukaan) ---------- */
const CORONARY = {
  lad: [
    [-0.1, 0.62, 0.8],
    [-0.1, 0.3, 0.95],
    [-0.02, -0.08, 0.96],
    [0.1, -0.45, 0.86],
    [0.22, -0.75, 0.62],
    [0.34, -0.96, 0.3],
  ].map(([x, y, z]) => surf(x, y, z)),
  diag1: [
    [-0.06, 0.26, 0.96],
    [0.18, 0.1, 0.95],
    [0.42, -0.1, 0.85],
    [0.62, -0.36, 0.62],
  ].map(([x, y, z]) => surf(x, y, z, 0.016)),
  diag2: [
    [0.02, -0.14, 0.97],
    [0.26, -0.36, 0.86],
    [0.48, -0.62, 0.58],
  ].map(([x, y, z]) => surf(x, y, z, 0.016)),
  rca: [
    [-0.3, 0.5, 0.82],
    [-0.66, 0.44, 0.6],
    [-0.94, 0.34, 0.2],
    [-0.92, 0.22, -0.32],
    [-0.62, 0.02, -0.7],
  ].map(([x, y, z]) => surf(x, y, z)),
  marginal: [
    [-0.78, 0.14, 0.52],
    [-0.62, -0.28, 0.62],
    [-0.36, -0.66, 0.6],
  ].map(([x, y, z]) => surf(x, y, z, 0.016)),
  lcx: [
    [0.26, 0.56, 0.78],
    [0.66, 0.5, 0.5],
    [0.94, 0.4, 0.06],
    [0.86, 0.28, -0.44],
  ].map(([x, y, z]) => surf(x, y, z)),
  venaBesar: [
    [-0.24, 0.6, 0.78],
    [-0.24, 0.26, 0.94],
    [-0.14, -0.14, 0.96],
    [-0.02, -0.52, 0.84],
    [0.12, -0.8, 0.58],
  ].map(([x, y, z]) => surf(x, y, z, 0.014)),
  venaKecil: [
    [-0.42, 0.46, 0.76],
    [-0.76, 0.36, 0.5],
    [-0.96, 0.26, 0.1],
  ].map(([x, y, z]) => surf(x, y, z, 0.012)),
};

const FAT_SPOTS: V3[] = [
  surf(-0.5, 0.5, 0.72, 0.0),
  surf(0.5, 0.52, 0.68, 0.0),
  surf(-0.86, 0.4, 0.3, 0.0),
  surf(0.88, 0.4, 0.2, 0.0),
];

/* =====================================================================
 *  KOMPONEN
 * ===================================================================== */
export default function AnatomicalHeart({
  beating = true,
  speed = 1.15,
  scale = 1,
  translucent = false,
  showCoronaries = true,
  highlight = false,
  onBeat,
  ...rest
}: {
  beating?: boolean;
  speed?: number;
  scale?: number;
  translucent?: boolean;
  showCoronaries?: boolean;
  highlight?: boolean;
  onBeat?: () => void;
} & Record<string, unknown>) {
  const vent = useRef<THREE.Mesh>(null);
  const atria = useRef<THREE.Group>(null);
  const lastCycle = useRef(0);
  const geo = useMemo(() => makeVentricles(), []);
  const tex = useMemo(() => heartTextures(), []);

  useFrame((state) => {
    const t = beating ? state.clock.elapsedTime * speed : 0;
    const x = t % 1;
    // sistol ventrikel (mengecil & sedikit memuntir), serambi berkontraksi lebih dulu
    const sys = beating ? Math.exp(-Math.pow((x - 0.2) / 0.085, 2)) : 0;
    const xa = (x + 0.14) % 1;
    const atr = beating ? Math.exp(-Math.pow((xa - 0.2) / 0.07, 2)) : 0;
    if (vent.current) {
      vent.current.scale.set(1 - 0.07 * sys, 1 - 0.045 * sys, 1 - 0.07 * sys);
      vent.current.rotation.z = -0.035 * sys;
    }
    if (atria.current) atria.current.scale.setScalar(1 - 0.085 * atr + 0.025 * sys);
    const cyc = Math.floor(t);
    if (beating && cyc !== lastCycle.current) {
      lastCycle.current = cyc;
      onBeat?.();
    }
  });

  const opacity = translucent ? 0.78 : 1;
  const muscle = (
    <meshPhysicalMaterial
      map={tex.map}
      bumpMap={tex.bump}
      bumpScale={0.012}
      roughness={0.44}
      metalness={0}
      clearcoat={0.5}
      clearcoatRoughness={0.3}
      sheen={0.45}
      sheenColor="#ff9c9c"
      emissive={highlight ? "#ff2e4d" : "#2a0008"}
      emissiveIntensity={highlight ? 0.28 : 0.12}
      transparent={translucent}
      opacity={opacity}
    />
  );
  const atriumMat = (
    <meshPhysicalMaterial
      map={tex.map}
      bumpMap={tex.bump}
      bumpScale={0.01}
      color="#f3c9c9"
      roughness={0.48}
      clearcoat={0.45}
      clearcoatRoughness={0.3}
      sheen={0.4}
      sheenColor="#ffb3b3"
      emissive={highlight ? "#ff2e4d" : "#2a0008"}
      emissiveIntensity={highlight ? 0.28 : 0.1}
      transparent={translucent}
      opacity={opacity}
    />
  );

  const arteri = "#c0303c";
  const vena = "#5461b8";
  const paru = "#6a6fc4";
  const vOpacity = translucent ? 0.82 : 1;

  return (
    <group {...rest} scale={scale}>
      {/* ===== massa ventrikel ===== */}
      <mesh ref={vent} geometry={geo} castShadow receiveShadow>
        {muscle}
      </mesh>

      {/* ===== serambi & aurikula ===== */}
      <group ref={atria}>
        <mesh position={[-0.62, 0.55, -0.05]} scale={[1.05, 0.82, 0.95]}>
          <sphereGeometry args={[0.5, 40, 32]} />
          {atriumMat}
        </mesh>
        <mesh position={[-0.5, 0.64, 0.4]} rotation={[0.2, 0, 0.5]} scale={[1.4, 0.75, 0.8]}>
          <sphereGeometry args={[0.2, 24, 20]} />
          {atriumMat}
        </mesh>
        <mesh position={[0.3, 0.6, -0.5]} scale={[1.12, 0.78, 0.92]}>
          <sphereGeometry args={[0.55, 40, 32]} />
          {atriumMat}
        </mesh>
        <mesh position={[0.74, 0.5, 0.12]} rotation={[0.3, 0, -0.7]} scale={[1.3, 0.7, 0.8]}>
          <sphereGeometry args={[0.18, 24, 20]} />
          {atriumMat}
        </mesh>
      </group>

      {/* ===== pembuluh besar ===== */}
      <Tube points={HEART_PATHS.aorta} color={arteri} radius={0.2} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.cabang1} color={arteri} radius={0.08} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.cabang2} color={arteri} radius={0.07} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.cabang3} color={arteri} radius={0.07} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.trunkusParu} color={paru} radius={0.17} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.arteriParuKiri} color={paru} radius={0.11} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.arteriParuKanan} color={paru} radius={0.11} emissive={0.07} opacity={vOpacity} />
      <Tube points={HEART_PATHS.venaKavaAtas} color={vena} radius={0.15} emissive={0.06} opacity={vOpacity} />
      <Tube points={HEART_PATHS.venaKavaBawah} color={vena} radius={0.16} emissive={0.06} opacity={vOpacity} />
      {HEART_PATHS.venaParu.map((p, i) => (
        <Tube key={`pv${i}`} points={p} color={arteri} radius={0.07} emissive={0.06} opacity={vOpacity} />
      ))}

      {/* ===== pembuluh koroner & lemak epikardial ===== */}
      {showCoronaries && (
        <group>
          <Tube points={CORONARY.lad} color="#d8404c" radius={0.03} emissive={0.12} />
          <Tube points={CORONARY.diag1} color="#d8404c" radius={0.02} emissive={0.12} />
          <Tube points={CORONARY.diag2} color="#d8404c" radius={0.018} emissive={0.12} />
          <Tube points={CORONARY.rca} color="#d8404c" radius={0.03} emissive={0.12} />
          <Tube points={CORONARY.marginal} color="#d8404c" radius={0.02} emissive={0.12} />
          <Tube points={CORONARY.lcx} color="#d8404c" radius={0.028} emissive={0.12} />
          <Tube points={CORONARY.venaBesar} color="#5b6dc9" radius={0.022} emissive={0.1} />
          <Tube points={CORONARY.venaKecil} color="#5b6dc9" radius={0.018} emissive={0.1} />
          {FAT_SPOTS.map((p, i) => (
            <mesh key={`fat${i}`} position={p} scale={[1.3, 0.55, 0.9]}>
              <sphereGeometry args={[0.13, 16, 12]} />
              <meshPhysicalMaterial color="#e9c57c" roughness={0.6} clearcoat={0.3} transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
