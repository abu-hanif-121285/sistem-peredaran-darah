import { useEffect, useState } from "react";
import { NavProvider, useNav } from "@/store/nav";
import { ProgressProvider } from "@/store/progress";
import Shell from "@/components/Shell";
import Splash from "@/components/Splash";
import Beranda from "@/pages/Beranda";
import Peta from "@/pages/Peta";
import Materi from "@/pages/Materi";
import Eksplorasi from "@/pages/Eksplorasi";
import Simulasi from "@/pages/Simulasi";
import Misi from "@/pages/Misi";
import Latihan from "@/pages/Latihan";
import Kuis from "@/pages/Kuis";
import Progres from "@/pages/Progres";
import Guru from "@/pages/Guru";
import { unlockAudio } from "@/lib/audio";
import { BrandProvider } from "@/store/brand";

function Routes() {
  const { route } = useNav();
  switch (route) {
    case "beranda":
      return <Beranda />;
    case "peta":
      return <Peta />;
    case "materi":
      return <Materi />;
    case "eksplorasi":
      return <Eksplorasi />;
    case "simulasi":
      return <Simulasi />;
    case "misi":
      return <Misi />;
    case "latihan":
      return <Latihan />;
    case "kuis":
      return <Kuis />;
    case "progres":
      return <Progres />;
    case "guru":
      return <Guru />;
    default:
      return <Beranda />;
  }
}

function Inner() {
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    const h = () => unlockAudio();
    window.addEventListener("pointerdown", h, { once: true });
    return () => window.removeEventListener("pointerdown", h);
  }, []);

  return (
    <>
      {!siap && <Splash onDone={() => setSiap(true)} />}
      <Shell>
        <Routes />
      </Shell>
    </>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <ProgressProvider>
        <NavProvider>
          <Inner />
        </NavProvider>
      </ProgressProvider>
    </BrandProvider>
  );
}
