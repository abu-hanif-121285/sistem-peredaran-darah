import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Lights, Tube } from "./parts";
import AnatomicalHeart, { HEART_ANCHORS as A } from "./AnatomicalHeart";
import { CapillaryBed, RealisticBody, RealisticLungs } from "./RealisticBody";

type V3 = [number, number, number];

/* ===== penempatan jantung di dalam tubuh ===== */
const HEART_POS: V3 = [-0.25, 1.4, 0.15];
const HS = 0.3;
const H = (p: V3): V3 => [HEART_POS[0] + p[0] * HS, HEART_POS[1] + p[1] * HS, HEART_POS[2] + p[2] * HS];
const LUNG_POS: V3 = [0.05, 1.6, -0.05];

export const CHECKPOINTS: { judul: string; teks: string; warna: string }[] = [
  {
    judul: "Bilik Kanan",
    teks: "Bilik kanan memompa darah yang banyak mengandung karbon dioksida menuju paru-paru melalui arteri pulmonalis.",
    warna: "sky",
  },
  {
    judul: "Paru-paru",
    teks: "Di kapiler paru-paru darah melepaskan karbon dioksida dan mengambil oksigen. Warnanya berubah menjadi merah terang!",
    warna: "rose",
  },
  {
    judul: "Serambi Kiri",
    teks: "Darah kaya oksigen kembali ke jantung melalui vena pulmonalis dan masuk ke serambi kiri.",
    warna: "rose",
  },
  {
    judul: "Bilik Kiri",
    teks: "Bilik kiri yang berdinding paling tebal memompa darah ke seluruh tubuh melalui aorta. Inilah awal peredaran darah besar.",
    warna: "rose",
  },
  {
    judul: "Kapiler Tubuh",
    teks: "Darahlah yang membawa oksigen dan berbagai zat yang dibutuhkan tubuh. Di kapiler, oksigen diberikan kepada sel dan karbon dioksida diambil.",
    warna: "violet",
  },
  {
    judul: "Serambi Kanan",
    teks: "Darah yang membawa karbon dioksida kembali ke jantung melalui vena kava, masuk ke serambi kanan. Satu putaran selesai!",
    warna: "sky",
  },
];

/* ===================== JALUR (koordinat dunia) ===================== */
const PULMO_COMMON: V3[] = [
  H(A.serambiKanan),
  H(A.katupTrikuspid),
  H(A.bilikKanan),
  H(A.pangkalTrunkus),
  H([-0.16, 0.9, 0.42]),
  H([-0.02, 1.25, 0.28]),
  H(A.percabanganParu),
];
const LUNG_LEFT_LOOP: V3[] = [
  H([0.42, 1.3, 0.1]),
  H([0.85, 1.3, -0.22]),
  H(A.ujungArteriParuKiri),
  [0.38, 1.8, 0.02],
  [0.65, 1.9, 0.05],
  [0.9, 1.72, 0.0],
  [0.86, 1.45, -0.02],
  [0.58, 1.38, -0.04],
  H(A.ujungVenaParuKiri),
  H(A.serambiKiri),
];
const LUNG_RIGHT_LOOP: V3[] = [
  H([-0.35, 1.32, -0.15]),
  H([-0.7, 1.25, -0.4]),
  H(A.ujungArteriParuKanan),
  [-0.7, 1.82, 0.0],
  [-0.95, 1.7, 0.02],
  [-0.96, 1.42, 0.0],
  [-0.7, 1.36, -0.04],
  H(A.ujungVenaParuKanan),
  H(A.serambiKiri),
];
const LEFT_HEART: V3[] = [
  H(A.katupMitral),
  H(A.bilikKiri),
  H([0.4, -0.6, 0.0]),
  H([0.2, 0.0, 0.05]),
  H(A.akarAorta),
  H([0.12, 1.05, 0.0]),
  H([0.18, 1.5, -0.12]),
];
const ARCH_TO_DESC: V3[] = [
  H(A.puncakLengkungAorta),
  H([0.52, 1.82, -0.66]),
  H([0.56, 1.45, -0.86]),
  H([0.5, 0.9, -0.95]),
  H([0.42, 0.1, -0.98]),
  H([0.36, -0.7, -0.95]),
  H(A.ujungAorta),
];
const SVC_IN: V3[] = [H(A.ujungVenaKavaAtas), H([-0.62, 1.7, -0.02]), H([-0.6, 1.15, -0.05]), H([-0.6, 0.8, -0.08])];
const IVC_IN: V3[] = [H(A.ujungVenaKavaBawah), H([-0.6, -0.9, -0.6]), H([-0.62, -0.2, -0.5]), H([-0.6, 0.35, -0.3])];

const BR_HEAD: V3[] = [
  H(A.puncakLengkungAorta),
  H([0.34, 2.2, -0.4]),
  H([0.36, 2.5, -0.42]),
  [-0.12, 2.52, 0.06],
  [-0.08, 2.85, 0.14],
  [0.05, 3.12, 0.26],
  [0.24, 2.98, 0.2],
  [0.1, 2.8, 0.32],
  [-0.2, 2.7, 0.24],
  [-0.38, 2.45, 0.17],
  ...SVC_IN,
];
const BR_ARM_L: V3[] = [
  H(A.puncakLengkungAorta),
  H([0.48, 1.84, -0.56]),
  H([0.6, 2.15, -0.6]),
  H([0.78, 2.4, -0.62]),
  [0.5, 2.12, 0.0],
  [0.95, 2.02, 0.0],
  [1.12, 1.4, 0.05],
  [1.22, 0.7, 0.08],
  [1.3, 0.3, 0.12],
  [1.44, 0.1, 0.12],
  [1.3, -0.02, 0.22],
  [1.24, 0.72, 0.16],
  [1.15, 1.42, 0.13],
  [0.95, 2.06, 0.13],
  [0.4, 2.26, 0.2],
  ...SVC_IN,
];
const BR_ARM_R: V3[] = [
  H([0.2, 1.72, -0.22]),
  H([0.05, 2.1, -0.2]),
  H([-0.08, 2.45, -0.2]),
  [-0.6, 2.12, 0.0],
  [-0.95, 2.02, 0.0],
  [-1.12, 1.4, 0.05],
  [-1.22, 0.7, 0.08],
  [-1.3, 0.3, 0.12],
  [-1.44, 0.1, 0.12],
  [-1.3, -0.02, 0.22],
  [-1.24, 0.72, 0.16],
  [-1.15, 1.42, 0.13],
  [-0.95, 2.06, 0.13],
  [-0.64, 2.3, 0.15],
  ...SVC_IN,
];
const BR_ABDOMEN: V3[] = [
  ...ARCH_TO_DESC,
  [-0.15, 0.5, -0.15],
  [-0.12, 0.0, -0.05],
  [0.1, -0.25, 0.2],
  [0.36, -0.1, 0.26],
  [0.26, 0.12, 0.3],
  [-0.05, 0.06, 0.26],
  [-0.3, 0.0, 0.06],
  [-0.4, 0.5, -0.04],
  ...IVC_IN,
];
const legBranch = (s: 1 | -1): V3[] => [
  ...ARCH_TO_DESC,
  [-0.15, 0.5, -0.15],
  [-0.12, -0.1, -0.1],
  [-0.05, -0.6, -0.05],
  [s * 0.3, -0.9, 0.0],
  [s * 0.4, -1.9, 0.05],
  [s * 0.42, -2.8, 0.05],
  [s * 0.44, -3.2, 0.25],
  [s * 0.5, -3.3, 0.55],
  [s * 0.38, -3.15, 0.45],
  [s * 0.47, -2.8, 0.12],
  [s * 0.47, -1.9, 0.12],
  [s * 0.46, -0.9, 0.08],
  [-0.2, -0.6, 0.0],
  [-0.35, -0.2, 0.0],
  [-0.4, 0.4, -0.03],
  ...IVC_IN,
];

type Circuit = { pts: V3[]; lung: V3; bed: V3 };
const CIRCUITS: Circuit[] = [
  { pts: [...PULMO_COMMON, ...LUNG_LEFT_LOOP, ...LEFT_HEART, ...legBranch(1)], lung: [0.75, 1.65, 0], bed: [0.44, -3.3, 0.4] },
  { pts: [...PULMO_COMMON, ...LUNG_RIGHT_LOOP, ...LEFT_HEART, ...BR_HEAD], lung: [-0.85, 1.6, 0], bed: [0.05, 3.0, 0.25] },
  { pts: [...PULMO_COMMON, ...LUNG_LEFT_LOOP, ...LEFT_HEART, ...BR_ARM_R], lung: [0.75, 1.65, 0], bed: [-1.35, 0.1, 0.15] },
  { pts: [...PULMO_COMMON, ...LUNG_RIGHT_LOOP, ...LEFT_HEART, ...BR_ABDOMEN], lung: [-0.85, 1.6, 0], bed: [0.12, -0.05, 0.25] },
  { pts: [...PULMO_COMMON, ...LUNG_LEFT_LOOP, ...LEFT_HEART, ...BR_ARM_L], lung: [0.75, 1.65, 0], bed: [1.35, 0.1, 0.15] },
  { pts: [...PULMO_COMMON, ...LUNG_RIGHT_LOOP, ...LEFT_HEART, ...legBranch(-1)], lung: [-0.85, 1.6, 0], bed: [-0.44, -3.3, 0.4] },
];

type Built = { curve: THREE.CatmullRomCurve3; len: number; tLung: number; tBed: number };

function nearestT(curve: THREE.CatmullRomCurve3, target: V3, samples = 600) {
  const tv = new THREE.Vector3(...target);
  let best = 0;
  let bd = Infinity;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const d = curve.getPointAt(t).distanceToSquared(tv);
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  return best;
}

function buildCircuits(): Built[] {
  return CIRCUITS.map((c) => {
    const curve = new THREE.CatmullRomCurve3(c.pts.map((p) => new THREE.Vector3(...p)), true, "centripetal");
    curve.arcLengthDivisions = 400;
    const len = curve.getLength();
    return { curve, len, tLung: nearestT(curve, c.lung), tBed: nearestT(curve, c.bed) };
  });
}

/* ===================== SEL DARAH (instanced, bikonkaf) ===================== */
const RED = new THREE.Color("#d8313f");
const BLUE = new THREE.Color("#6b63c9");
const tmpColor = new THREE.Color();

function BloodCells({
  running,
  speed,
  resetKey,
  onCheckpoint,
  onLap,
}: {
  running: boolean;
  speed: number;
  resetKey: number;
  onCheckpoint: (i: number) => void;
  onLap: () => void;
}) {
  const N = 150;
  const built = useMemo(buildCircuits, []);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const T = useRef(0);
  const prevT = useRef(0);
  const zAxis = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  const geo = useMemo(() => {
    const profile = [
      new THREE.Vector2(0, 0.012),
      new THREE.Vector2(0.018, 0.014),
      new THREE.Vector2(0.034, 0.024),
      new THREE.Vector2(0.048, 0.025),
      new THREE.Vector2(0.056, 0),
      new THREE.Vector2(0.048, -0.025),
      new THREE.Vector2(0.034, -0.024),
      new THREE.Vector2(0.018, -0.014),
      new THREE.Vector2(0, -0.012),
    ];
    const g = new THREE.LatheGeometry(profile, 20);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  const inst = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const c = i % built.length;
        const j = Math.floor(i / built.length);
        const per = Math.ceil(N / built.length);
        return {
          c,
          phase: (j / per + ((i * 0.6180339887) % 1) * 0.02) % 1,
          spin: 0.6 + (i % 7) * 0.25,
          s: 0.85 + ((i * 0.37) % 1) * 0.35,
        };
      }),
    [built.length],
  );

  // checkpoint pada sirkuit pemimpin (indeks 0)
  const cpT = useMemo(() => {
    const c0 = built[0].curve;
    return [
      nearestT(c0, H(A.bilikKanan)),
      built[0].tLung,
      nearestT(c0, H(A.serambiKiri)),
      nearestT(c0, H(A.bilikKiri)),
      built[0].tBed,
      nearestT(c0, H([-0.6, 0.35, -0.3])),
    ];
  }, [built]);

  useEffect(() => {
    T.current = 0;
    prevT.current = 0;
  }, [resetKey]);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < N; i++) m.setColorAt(i, RED);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    if (running) {
      const step = Math.min(dt, 0.05) * 0.06 * speed;
      T.current += step;
      if (T.current >= 1) {
        T.current -= 1;
        onLap();
      }
      const a = prevT.current;
      const b = T.current;
      cpT.forEach((ct, i) => {
        const crossed = a <= b ? ct > a && ct <= b : ct > a || ct <= b;
        if (crossed) onCheckpoint(i);
      });
      prevT.current = T.current;
    }
    const time = state.clock.elapsedTime;
    const baseLen = built[0].len;
    for (let i = 0; i < N; i++) {
      const k = inst[i];
      const b = built[k.c];
      const rate = baseLen / b.len;
      const tt = (((T.current * rate + k.phase) % 1) + 1) % 1;
      const p = b.curve.getPointAt(tt);
      const tan = b.curve.getTangentAt(tt);
      dummy.position.copy(p);
      dummy.quaternion.setFromUnitVectors(zAxis, tan);
      dummy.rotateZ(time * k.spin + i);
      dummy.rotateX(0.35 * Math.sin(time * 1.3 + i));
      dummy.scale.setScalar(k.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      // oksigenasi: merah terang setelah paru-paru, biru keunguan setelah kapiler tubuh
      const d1 = Math.min(1, Math.max(0, (tt - b.tLung) / 0.03));
      const d2 = Math.min(1, Math.max(0, (tt - b.tBed) / 0.03));
      const oxy = tt < b.tLung ? 0 : tt < b.tBed ? d1 : 1 - d2;
      tmpColor.copy(BLUE).lerp(RED, oxy);
      m.setColorAt(i, tmpColor);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, N]} frustumCulled={false}>
      <meshPhysicalMaterial color="#ffffff" roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.25} />
    </instancedMesh>
  );
}

/* ===================== PERTUKARAN GAS DI PARU (partikel O₂) ===================== */
function OxygenSparkles({ running }: { running: boolean }) {
  const N = 140;
  const ref = useRef<THREE.Points>(null);
  const base = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const r = Math.random();
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.1;
      arr[i * 3] = LUNG_POS[0] + side * 0.7 + Math.cos(a) * 0.3 * r;
      arr[i * 3 + 1] = LUNG_POS[1] + y;
      arr[i * 3 + 2] = LUNG_POS[2] + Math.sin(a) * 0.25 * r;
    }
    return arr;
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(base.slice(), 3));
    return g;
  }, [base]);
  useFrame((state) => {
    if (!ref.current || !running) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      pos.setXYZ(
        i,
        base[i * 3] + Math.sin(t * 0.9 + i) * 0.03,
        base[i * 3 + 1] + ((t * 0.12 + i * 0.37) % 1.1) - 0.55,
        base[i * 3 + 2] + Math.cos(t * 0.7 + i) * 0.03,
      );
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#cdefff" size={0.04} transparent opacity={0.85} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/* ===================== PEMBULUH DI LUAR JANTUNG ===================== */
const ART = "#c62f3c";
const VEN = "#4f63c2";
const PUL_A = "#6a6fc4";
const VESSELS: { pts: V3[]; r: number; c: string }[] = [
  // arteri karotis & vena jugularis (kepala)
  { pts: [H([0.36, 2.5, -0.42]), [-0.12, 2.52, 0.06], [-0.08, 2.85, 0.14], [0.05, 3.12, 0.26]], r: 0.045, c: ART },
  { pts: [[0.1, 2.8, 0.32], [-0.2, 2.7, 0.24], [-0.38, 2.45, 0.17], H(A.ujungVenaKavaAtas)], r: 0.05, c: VEN },
  // lengan kiri pasien (kanan penonton)
  { pts: [H([0.78, 2.4, -0.62]), [0.5, 2.12, 0.0], [0.95, 2.02, 0.0], [1.12, 1.4, 0.05], [1.22, 0.7, 0.08], [1.3, 0.3, 0.12]], r: 0.045, c: ART },
  { pts: [[1.3, -0.02, 0.22], [1.24, 0.72, 0.16], [1.15, 1.42, 0.13], [0.95, 2.06, 0.13], [0.4, 2.26, 0.2], H(A.ujungVenaKavaAtas)], r: 0.05, c: VEN },
  // lengan kanan pasien
  { pts: [H([-0.08, 2.45, -0.2]), [-0.6, 2.12, 0.0], [-0.95, 2.02, 0.0], [-1.12, 1.4, 0.05], [-1.22, 0.7, 0.08], [-1.3, 0.3, 0.12]], r: 0.045, c: ART },
  { pts: [[-1.3, -0.02, 0.22], [-1.24, 0.72, 0.16], [-1.15, 1.42, 0.13], [-0.95, 2.06, 0.13], [-0.64, 2.3, 0.15], H(A.ujungVenaKavaAtas)], r: 0.05, c: VEN },
  // aorta turun → organ perut → tungkai
  { pts: [H(A.ujungAorta), [-0.15, 0.5, -0.15], [-0.12, -0.1, -0.1], [-0.05, -0.6, -0.05]], r: 0.075, c: ART },
  { pts: [[-0.12, 0.0, -0.05], [0.1, -0.25, 0.2]], r: 0.04, c: ART },
  { pts: [[-0.05, -0.6, -0.05], [0.3, -0.9, 0.0], [0.4, -1.9, 0.05], [0.42, -2.8, 0.05], [0.44, -3.2, 0.25]], r: 0.05, c: ART },
  { pts: [[-0.05, -0.6, -0.05], [-0.3, -0.9, 0.0], [-0.4, -1.9, 0.05], [-0.42, -2.8, 0.05], [-0.44, -3.2, 0.25]], r: 0.05, c: ART },
  // vena kava bawah & vena tungkai
  { pts: [[-0.2, -0.6, 0.0], [-0.35, -0.2, 0.0], [-0.4, 0.4, -0.03], H(A.ujungVenaKavaBawah)], r: 0.075, c: VEN },
  { pts: [[-0.3, 0.0, 0.06], [-0.35, -0.2, 0.0]], r: 0.04, c: VEN },
  { pts: [[0.38, -3.15, 0.45], [0.47, -2.8, 0.12], [0.47, -1.9, 0.12], [0.46, -0.9, 0.08], [-0.2, -0.6, 0.0]], r: 0.05, c: VEN },
  { pts: [[-0.38, -3.15, 0.45], [-0.47, -2.8, 0.12], [-0.47, -1.9, 0.12], [-0.46, -0.9, 0.08], [-0.2, -0.6, 0.0]], r: 0.05, c: VEN },
  // arteri & vena pulmonalis ke/dari paru
  { pts: [H(A.ujungArteriParuKiri), [0.38, 1.8, 0.02], [0.65, 1.9, 0.05]], r: 0.045, c: PUL_A },
  { pts: [H(A.ujungArteriParuKanan), [-0.7, 1.82, 0.0], [-0.95, 1.7, 0.02]], r: 0.045, c: PUL_A },
  { pts: [[0.58, 1.38, -0.04], H(A.ujungVenaParuKiri)], r: 0.04, c: ART },
  { pts: [[-0.7, 1.36, -0.04], H(A.ujungVenaParuKanan)], r: 0.04, c: ART },
];

/* ===================== SCENE ===================== */
export default function SimScene({
  running,
  speed,
  resetKey,
  onCheckpoint,
  onLap,
  showLabels = true,
}: {
  running: boolean;
  speed: number;
  resetKey: number;
  onCheckpoint: (i: number) => void;
  onLap: () => void;
  showLabels?: boolean;
}) {
  const label =
    "rounded-full border border-white/50 px-2.5 py-1 text-[11px] font-black text-white shadow-lg whitespace-nowrap backdrop-blur";
  return (
    <Canvas camera={{ position: [0, 0.4, 9.8], fov: 42 }} dpr={[1, 1.8]} gl={{ antialias: true }}>
      <color attach="background" args={["#07152b"]} />
      <fog attach="fog" args={["#07152b", 14, 30]} />
      <Lights />
      <hemisphereLight args={["#bfe3ff", "#1b2a4a", 0.5]} />

      <RealisticBody opacity={0.12} />
      <RealisticLungs position={LUNG_POS} />
      <AnatomicalHeart position={HEART_POS} scale={HS} beating={running} speed={1.15} translucent />

      {VESSELS.map((v, i) => (
        <Tube key={i} points={v.pts} color={v.c} radius={v.r} opacity={0.5} emissive={0.12} />
      ))}

      {/* kapiler jaringan */}
      <CapillaryBed position={[0.05, 3.0, 0.24]} radius={0.3} seed={1} color="#d8a0ff" />
      <CapillaryBed position={[1.36, 0.1, 0.16]} radius={0.2} seed={2} color="#d8a0ff" />
      <CapillaryBed position={[-1.36, 0.1, 0.16]} radius={0.2} seed={3} color="#d8a0ff" />
      <CapillaryBed position={[0.12, -0.05, 0.25]} radius={0.36} seed={4} color="#f0a0c8" count={16} />
      <CapillaryBed position={[0.44, -3.3, 0.4]} radius={0.22} seed={5} color="#d8a0ff" />
      <CapillaryBed position={[-0.44, -3.3, 0.4]} radius={0.22} seed={6} color="#d8a0ff" />
      {/* kapiler paru */}
      <CapillaryBed position={[0.7, 1.62, 0.0]} radius={0.3} seed={7} color="#ff9db0" count={14} />
      <CapillaryBed position={[-0.82, 1.58, 0.0]} radius={0.3} seed={8} color="#ff9db0" count={14} />

      <OxygenSparkles running={running} />

      <BloodCells running={running} speed={speed} resetKey={resetKey} onCheckpoint={onCheckpoint} onLap={onLap} />

      {/* lantai */}
      <mesh position={[0, -3.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 56]} />
        <meshStandardMaterial color="#12284d" transparent opacity={0.5} />
      </mesh>

      {showLabels && (
        <>
          <Html position={[-0.25, 0.78, 0.6]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-rose-600/90`}>🫀 Jantung</span>
          </Html>
          <Html position={[1.0, 2.4, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-pink-600/90`}>🫁 Paru-paru kiri</span>
          </Html>
          <Html position={[-1.05, 2.4, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-pink-600/90`}>🫁 Paru-paru kanan</span>
          </Html>
          <Html position={[0.35, 1.05, -0.2]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-red-700/90`}>Aorta</span>
          </Html>
          <Html position={[-0.95, 1.05, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-indigo-700/90`}>Vena kava</span>
          </Html>
          <Html position={[1.75, 0.1, 0.2]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-violet-600/90`}>Kapiler tangan</span>
          </Html>
          <Html position={[0.55, 3.35, 0.2]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-violet-600/90`}>Kapiler otak</span>
          </Html>
          <Html position={[-1.0, -3.3, 0.4]} center distanceFactor={10} zIndexRange={[20, 0]}>
            <span className={`${label} bg-violet-600/90`}>Kapiler kaki</span>
          </Html>
        </>
      )}

      <OrbitControls
        makeDefault
        target={[0, 0.1, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.2}
        maxDistance={16}
        maxPolarAngle={Math.PI * 0.88}
        minPolarAngle={Math.PI * 0.12}
      />
    </Canvas>
  );
}
