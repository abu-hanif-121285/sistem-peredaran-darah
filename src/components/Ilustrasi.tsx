import { IMG } from "@/assets/images";

/** Ilustrasi soal tetap jelas secara sains, dengan pencahayaan dan kedalaman seperti objek 3D. */
export default function Ilustrasi({ jenis, size = 180 }: { jenis: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 120 120" } as const;
  switch (jenis) {
    case "jantung":
      return (
        <img
          src={IMG.jantungRealistis}
          width={size}
          height={size}
          alt="Ilustrasi 3D organ jantung"
          className="rounded-3xl object-cover"
          style={{ width: size, height: size }}
        />
      );
    case "selMerah":
      return (
        <svg {...common} role="img" aria-label="Gambar sel darah merah">
          <defs>
            <radialGradient id="redCellFill" cx="32%" cy="24%">
              <stop offset="0%" stopColor="#ff9ca5" />
              <stop offset="55%" stopColor="#f04459" />
              <stop offset="100%" stopColor="#a91b3b" />
            </radialGradient>
            <radialGradient id="redCellDip">
              <stop offset="0%" stopColor="#9c1839" />
              <stop offset="100%" stopColor="#e83d57" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#fff1f3" />
          {[
            [40, 45, 1],
            [78, 52, 0.85],
            [55, 82, 0.9],
          ].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} style={{ filter: "drop-shadow(2px 5px 3px #721c3a55)" }}>
              <ellipse rx="21" ry="18" fill="url(#redCellFill)" />
              <ellipse rx="9" ry="7" fill="url(#redCellDip)" />
              <ellipse cx="-7" cy="-8" rx="6" ry="2.5" fill="#ffe3e7" opacity="0.6" transform="rotate(-25 -7 -8)" />
            </g>
          ))}
        </svg>
      );
    case "selPutih":
      return (
        <svg {...common} role="img" aria-label="Gambar sel darah putih">
          <defs>
            <radialGradient id="whiteCellFill" cx="30%" cy="22%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#e8e7fa" />
              <stop offset="100%" stopColor="#b7b9dc" />
            </radialGradient>
            <linearGradient id="whiteNucleus" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#c8a8fa" />
              <stop offset="100%" stopColor="#7e55c0" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#f1f5f9" />
          <circle cx="60" cy="58" r="30" fill="url(#whiteCellFill)" stroke="#cbd5e1" strokeWidth="2" style={{ filter: "drop-shadow(2px 6px 4px #7482a677)" }} />
          <path d="M48 52 q10 -12 20 0 q10 12 -4 16 q-16 4 -16 -16 Z" fill="url(#whiteNucleus)" />
          <ellipse cx="49" cy="41" rx="9" ry="3" fill="#fff" opacity="0.8" transform="rotate(-30 49 41)" />
          <circle cx="36" cy="88" r="9" fill="#e2e8f0" />
          <circle cx="88" cy="40" r="7" fill="#e2e8f0" />
        </svg>
      );
    case "kapiler":
      return (
        <svg {...common} role="img" aria-label="Gambar pembuluh kapiler">
          <defs>
            <linearGradient id="kapilerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ed6384" />
              <stop offset="55%" stopColor="#b892ed" />
              <stop offset="100%" stopColor="#46a8df" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#faf5ff" />
          <path d="M10 60 h26" stroke="#ed6384" strokeWidth="9" strokeLinecap="round" style={{ filter: "drop-shadow(1px 3px 2px #a45b9a77)" }} />
          <path d="M110 60 h-26" stroke="#46a8df" strokeWidth="9" strokeLinecap="round" style={{ filter: "drop-shadow(1px 3px 2px #4982bd77)" }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M36 60 C50 ${30 + i * 14} 70 ${30 + i * 14} 84 60`}
              stroke="url(#kapilerGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </svg>
      );
    case "paru":
      return (
        <svg {...common} role="img" aria-label="Gambar paru-paru">
          <defs>
            <radialGradient id="lungFill" cx="32%" cy="24%">
              <stop stopColor="#ffe1e8" />
              <stop offset="70%" stopColor="#f3aabd" />
              <stop offset="100%" stopColor="#dc789b" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#fdf2f8" />
          <rect x="56" y="22" width="8" height="28" rx="4" fill="#ef9db6" />
          <path d="M57 44 C40 46 30 60 30 78 C30 92 40 98 50 94 C58 90 57 70 57 44 Z" fill="url(#lungFill)" stroke="#e889a6" strokeWidth="2" style={{ filter: "drop-shadow(2px 5px 3px #a5547a55)" }} />
          <path d="M63 44 C80 46 90 60 90 78 C90 92 80 98 70 94 C62 90 63 70 63 44 Z" fill="url(#lungFill)" stroke="#e889a6" strokeWidth="2" style={{ filter: "drop-shadow(2px 5px 3px #a5547a55)" }} />
          <path d="M38 68 C41 59 46 56 50 56" stroke="#fff" opacity="0.6" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "keping":
      return (
        <svg {...common} role="img" aria-label="Gambar keping darah">
          <defs>
            <linearGradient id="plateletFill" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff1a8" />
              <stop offset="52%" stopColor="#fbc83f" />
              <stop offset="100%" stopColor="#e8991c" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#fffbeb" />
          {[
            [45, 50, 0],
            [74, 58, 35],
            [58, 80, 70],
            [38, 76, 20],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} style={{ filter: "drop-shadow(1px 4px 2px #a85f1777)" }}>
              <path d="M-12 0 L-5 -9 L8 -7 L12 3 L3 11 L-8 8 Z" fill="url(#plateletFill)" stroke="#e59216" strokeWidth="2" />
              <path d="M-6 -4 L3 -6" stroke="#fff6c5" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );
    default:
      return null;
  }
}
