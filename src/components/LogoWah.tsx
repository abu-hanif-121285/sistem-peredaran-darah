/**
 * Versi vektor logo WAH Official (tampilan sementara).
 * Mengikuti desain asli: huruf WAH biru gradasi dengan garis swoosh di kiri,
 * buku terbuka & nyala emas di dalam huruf A, pita emas-biru berujung pesawat kertas
 * pada huruf H, tulisan "Official", dan slogan "Mendidik untuk Menggapai Ridho Allah".
 * Otomatis digantikan berkas logo asli begitu diunggah.
 */
export default function LogoWah({ className }: { className?: string }) {
  return (
    <svg
      viewBox="140 215 1300 625"
      className={className}
      role="img"
      aria-label="WAH Official — Mendidik untuk Menggapai Ridho Allah"
      style={{ fontFamily: '"Nunito","Arial Rounded MT Bold","Arial Black","Segoe UI",Arial,sans-serif' }}
    >
      <defs>
        <linearGradient id="wahBlue" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#3cb2ff" />
          <stop offset="0.5" stopColor="#1a74e0" />
          <stop offset="1" stopColor="#0a3b8e" />
        </linearGradient>
        <linearGradient id="wahGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd25a" />
          <stop offset="1" stopColor="#f29a0c" />
        </linearGradient>
        <linearGradient id="wahSwoosh" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4ec0ff" />
          <stop offset="1" stopColor="#0f4fb3" />
        </linearGradient>
      </defs>

      {/* swoosh di kiri huruf W */}
      <path d="M 168 318 C 240 282 335 300 412 388" stroke="url(#wahSwoosh)" strokeWidth="30" fill="none" strokeLinecap="round" />
      <path d="M 190 366 C 252 332 322 346 392 426" stroke="url(#wahSwoosh)" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M 222 412 C 268 388 318 398 374 456" stroke="url(#wahSwoosh)" strokeWidth="13" fill="none" strokeLinecap="round" />

      {/* WAH */}
      <text
        x="770"
        y="600"
        textAnchor="middle"
        fontSize="392"
        fontWeight="900"
        letterSpacing="-16"
        fill="url(#wahBlue)"
      >
        WAH
      </text>

      {/* buku terbuka & nyala emas di dalam huruf A */}
      <g>
        <path d="M 700 492 Q 742 462 775 486 L 775 556 Q 742 530 700 558 Z" fill="#fff" />
        <path d="M 850 492 Q 808 462 775 486 L 775 556 Q 808 530 850 558 Z" fill="#fff" />
        <path d="M 708 500 Q 744 474 770 494 L 770 544 Q 744 522 708 546 Z" fill="#1c6fdd" />
        <path d="M 842 500 Q 806 474 780 494 L 780 544 Q 806 522 842 546 Z" fill="#1c6fdd" />
        <polygon points="775,392 802,446 775,470 748,446" fill="url(#wahGold)" />
        <polygon points="775,392 802,446 775,470" fill="#e38f08" opacity="0.55" />
      </g>

      {/* pita & pesawat kertas pada huruf H */}
      <path d="M 1002 576 C 1120 560 1232 470 1332 332" stroke="url(#wahGold)" strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d="M 1002 540 C 1120 524 1232 434 1332 298" stroke="url(#wahSwoosh)" strokeWidth="22" fill="none" strokeLinecap="round" />
      <polygon points="1298,304 1424,232 1374,350" fill="url(#wahGold)" />
      <polygon points="1342,322 1424,232 1368,306" fill="#d98306" />

      {/* Official */}
      <text x="770" y="742" textAnchor="middle" fontSize="150" fontWeight="800" letterSpacing="-2" fill="#0b3f9a">
        Official
      </text>

      {/* slogan */}
      <line x1="232" y1="800" x2="328" y2="800" stroke="#f5a623" strokeWidth="6" strokeLinecap="round" />
      <line x1="1212" y1="800" x2="1308" y2="800" stroke="#f5a623" strokeWidth="6" strokeLinecap="round" />
      <text x="770" y="815" textAnchor="middle" fontSize="44" fontWeight="700" fill="#1d4a9a">
        Mendidik untuk Menggapai Ridho Allah
      </text>
    </svg>
  );
}
