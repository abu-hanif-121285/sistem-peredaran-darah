import { useMemo } from "react";
import * as THREE from "three";
import { Tube } from "./parts";

type V3 = [number, number, number];

/* =====================================================================
 *  TUBUH MANUSIA TRANSPARAN (proporsi realistis, material kaca lembut)
 *  Tinggi ±6.8 unit: kepala di y≈3.4, kaki di y≈-3.4
 * ===================================================================== */
function GlassMat({ opacity = 0.13 }: { opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color="#8fcbff"
      transparent
      opacity={opacity}
      roughness={0.18}
      metalness={0.05}
      clearcoat={1}
      clearcoatRoughness={0.1}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  );
}

function Limb({
  from,
  to,
  radius,
  opacity,
}: {
  from: V3;
  to: V3;
  radius: number;
  opacity: number;
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    const pos = a.clone().add(b).multiplyScalar(0.5);
    return { pos, quat, len };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat}>
      <capsuleGeometry args={[radius, Math.max(0.05, len - radius * 1.2), 8, 20]} />
      <GlassMat opacity={opacity} />
    </mesh>
  );
}

export function RealisticBody({ opacity = 0.13 }: { opacity?: number }) {
  const torso = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0, 2.3),
      new THREE.Vector2(0.62, 2.28),
      new THREE.Vector2(0.9, 2.1),
      new THREE.Vector2(0.92, 1.75),
      new THREE.Vector2(0.82, 1.2),
      new THREE.Vector2(0.7, 0.6),
      new THREE.Vector2(0.7, 0.15),
      new THREE.Vector2(0.8, -0.3),
      new THREE.Vector2(0.7, -0.62),
      new THREE.Vector2(0.0, -0.72),
    ];
    return new THREE.LatheGeometry(pts, 44);
  }, []);

  const L = useMemo(
    () => ({
      lenganAtasKi: { from: [-1.0, 2.1, 0] as V3, to: [-1.16, 1.2, 0.02] as V3 },
      lenganBawahKi: { from: [-1.16, 1.2, 0.02] as V3, to: [-1.26, 0.35, 0.1] as V3 },
      lenganAtasKa: { from: [1.0, 2.1, 0] as V3, to: [1.16, 1.2, 0.02] as V3 },
      lenganBawahKa: { from: [1.16, 1.2, 0.02] as V3, to: [1.26, 0.35, 0.1] as V3 },
      pahaKi: { from: [-0.38, -0.6, 0] as V3, to: [-0.42, -1.9, 0.02] as V3 },
      betisKi: { from: [-0.42, -1.9, 0.02] as V3, to: [-0.44, -3.15, 0.04] as V3 },
      pahaKa: { from: [0.38, -0.6, 0] as V3, to: [0.42, -1.9, 0.02] as V3 },
      betisKa: { from: [0.42, -1.9, 0.02] as V3, to: [0.44, -3.15, 0.04] as V3 },
    }),
    [],
  );

  return (
    <group>
      {/* kepala & leher */}
      <mesh position={[0, 2.97, 0]} scale={[1, 1.14, 1.06]}>
        <sphereGeometry args={[0.42, 36, 28]} />
        <GlassMat opacity={opacity} />
      </mesh>
      <mesh position={[0, 2.42, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.42, 20]} />
        <GlassMat opacity={opacity} />
      </mesh>
      {/* badan */}
      <mesh geometry={torso} scale={[1, 1, 0.62]}>
        <GlassMat opacity={opacity} />
      </mesh>
      {/* bahu */}
      {[-1, 1].map((s) => (
        <mesh key={`bahu${s}`} position={[s * 0.92, 2.12, 0]}>
          <sphereGeometry args={[0.2, 20, 16]} />
          <GlassMat opacity={opacity} />
        </mesh>
      ))}
      {/* lengan */}
      <Limb {...L.lenganAtasKi} radius={0.16} opacity={opacity} />
      <Limb {...L.lenganBawahKi} radius={0.13} opacity={opacity} />
      <Limb {...L.lenganAtasKa} radius={0.16} opacity={opacity} />
      <Limb {...L.lenganBawahKa} radius={0.13} opacity={opacity} />
      {[-1, 1].map((s) => (
        <mesh key={`tangan${s}`} position={[s * 1.3, 0.14, 0.14]} scale={[0.7, 1.1, 0.4]}>
          <sphereGeometry args={[0.17, 18, 14]} />
          <GlassMat opacity={opacity} />
        </mesh>
      ))}
      {/* tungkai */}
      <Limb {...L.pahaKi} radius={0.23} opacity={opacity} />
      <Limb {...L.betisKi} radius={0.16} opacity={opacity} />
      <Limb {...L.pahaKa} radius={0.23} opacity={opacity} />
      <Limb {...L.betisKa} radius={0.16} opacity={opacity} />
      {[-1, 1].map((s) => (
        <mesh key={`kaki${s}`} position={[s * 0.44, -3.3, 0.22]} scale={[0.55, 0.32, 1]}>
          <sphereGeometry args={[0.3, 18, 14]} />
          <GlassMat opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

/* =====================================================================
 *  PARU-PARU REALISTIS: apeks menyempit, dasar datar (diafragma),
 *  lekuk jantung pada paru kiri, lobus dibatasi fisura, percabangan bronkus
 * ===================================================================== */
function makeLung(side: 1 | -1) {
  // side = +1 → paru kiri pasien (kanan penonton, punya lekuk jantung)
  const g = new THREE.SphereGeometry(1, 56, 44);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    if (y > 0) {
      const k = 1 - 0.4 * Math.pow(y, 1.6);
      x *= k;
      z *= k;
    }
    if (y < -0.55) y = -0.55 + (y + 0.55) * 0.35; // dasar datar
    // sisi medial (dekat jantung) lebih rata
    if (x * side < 0) x *= 0.7;
    // lekuk jantung pada paru kiri
    if (side === 1 && x < 0 && z > 0) {
      const notch = Math.exp(-Math.pow((y + 0.1) / 0.35, 2)) * Math.exp(-Math.pow(z - 0.5, 2) / 0.3);
      x += 0.35 * notch;
    }
    pos.setXYZ(i, x * 0.46, y * 0.72, z * 0.42);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

export function RealisticLungs({
  position = [0, 1.55, -0.05],
  scale = 1,
  highlight = false,
  onClick,
}: {
  position?: V3;
  scale?: number;
  highlight?: boolean;
  onClick?: () => void;
}) {
  const left = useMemo(() => makeLung(1), []);
  const right = useMemo(() => makeLung(-1), []);
  const color = highlight ? "#f59bb0" : "#e8a3ad";

  const mat = (
    <meshPhysicalMaterial
      color={color}
      roughness={0.58}
      clearcoat={0.35}
      clearcoatRoughness={0.4}
      sheen={0.5}
      sheenColor="#ffd3da"
      transparent
      opacity={0.6}
      depthWrite={false}
      emissive="#ff8da3"
      emissiveIntensity={highlight ? 0.3 : 0.08}
    />
  );

  const bronchi = useMemo(() => {
    const b: { p: V3[]; r: number }[] = [
      { p: [[0, 0.95, -0.02], [0, 0.55, -0.04], [0, 0.22, -0.05]], r: 0.06 },
      { p: [[0, 0.22, -0.05], [0.28, 0.08, -0.06], [0.5, -0.05, -0.06]], r: 0.045 },
      { p: [[0, 0.22, -0.05], [-0.28, 0.08, -0.06], [-0.5, -0.05, -0.06]], r: 0.045 },
      { p: [[0.5, -0.05, -0.06], [0.62, -0.32, -0.04], [0.66, -0.52, 0.0]], r: 0.03 },
      { p: [[0.5, -0.05, -0.06], [0.66, 0.15, -0.05], [0.7, 0.4, -0.02]], r: 0.03 },
      { p: [[-0.5, -0.05, -0.06], [-0.62, -0.32, -0.04], [-0.66, -0.52, 0.0]], r: 0.03 },
      { p: [[-0.5, -0.05, -0.06], [-0.66, 0.15, -0.05], [-0.7, 0.4, -0.02]], r: 0.03 },
      { p: [[-0.5, -0.05, -0.06], [-0.7, -0.1, 0.08], [-0.84, -0.2, 0.14]], r: 0.025 },
    ];
    return b;
  }, []);

  const fissure = (pts: V3[], key: string) => (
    <Tube key={key} points={pts} color="#c97a8a" radius={0.012} emissive={0.05} opacity={0.9} />
  );

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => onClick && (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh geometry={left} position={[0.66, 0, 0]}>
        {mat}
      </mesh>
      <mesh geometry={right} position={[-0.66, 0, 0]}>
        {mat}
      </mesh>
      {/* fisura (batas lobus): kanan 2 fisura (3 lobus), kiri 1 fisura (2 lobus) */}
      {fissure(
        [
          [-0.26, 0.42, 0.3],
          [-0.6, 0.1, 0.4],
          [-1.0, -0.2, 0.2],
        ],
        "fk1",
      )}
      {fissure(
        [
          [-0.3, -0.05, 0.4],
          [-0.7, -0.25, 0.38],
          [-1.05, -0.45, 0.1],
        ],
        "fk2",
      )}
      {fissure(
        [
          [0.3, 0.4, 0.3],
          [0.66, 0.05, 0.42],
          [1.05, -0.3, 0.15],
        ],
        "fki",
      )}
      {/* trakea & bronkus */}
      {bronchi.map((b, i) => (
        <Tube key={`br${i}`} points={b.p} color="#f6e3e3" radius={b.r} emissive={0.04} opacity={0.95} />
      ))}
    </group>
  );
}

/* =====================================================================
 *  JARING KAPILER PROSEDURAL (benang halus bercahaya)
 * ===================================================================== */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function CapillaryBed({
  position,
  radius = 0.3,
  count = 12,
  color = "#c084fc",
  highlight = false,
  seed = 1,
  onClick,
}: {
  position: V3;
  radius?: number;
  count?: number;
  color?: string;
  highlight?: boolean;
  seed?: number;
  onClick?: () => void;
}) {
  const threads = useMemo(() => {
    const rnd = seeded(seed * 7919 + 13);
    const out: V3[][] = [];
    for (let i = 0; i < count; i++) {
      const pts: V3[] = [];
      let x = (rnd() - 0.5) * radius;
      let y = (rnd() - 0.5) * radius;
      let z = (rnd() - 0.5) * radius * 0.6;
      for (let k = 0; k < 5; k++) {
        pts.push([x, y, z]);
        x += (rnd() - 0.5) * radius * 0.9;
        y += (rnd() - 0.5) * radius * 0.9;
        z += (rnd() - 0.5) * radius * 0.5;
        const l = Math.hypot(x, y, z);
        if (l > radius) {
          x *= radius / l;
          y *= radius / l;
          z *= radius / l;
        }
      }
      out.push(pts);
    }
    return out;
  }, [count, radius, seed]);

  return (
    <group
      position={position}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => onClick && (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {threads.map((p, i) => (
        <Tube
          key={i}
          points={p}
          color={color}
          radius={highlight ? 0.016 : 0.011}
          emissive={highlight ? 1.1 : 0.55}
        />
      ))}
      {/* halo lembut */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 20, 16]} />
        <meshBasicMaterial color={color} transparent opacity={highlight ? 0.16 : 0.07} depthWrite={false} />
      </mesh>
    </group>
  );
}
