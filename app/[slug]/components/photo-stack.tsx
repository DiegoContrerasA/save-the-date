"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Photo = { src?: string; alt: string };

// Reemplazar `src` cuando lleguen las fotos (van en /public/photos/...).
// Mientras no haya `src` se muestra un cuadro de relleno.
const PHOTOS: Photo[] = [
  { alt: "Diego y Andrea, foto 1" },
  { alt: "Diego y Andrea, foto 2" },
  { alt: "Diego y Andrea, foto 3" },
];

const PLACEHOLDER_TINTS = [
  "from-[#7a1a1f] to-[#c1121f]",
  "from-[#3b3b3b] to-[#8a8a8a]",
  "from-[#5a4a3a] to-[#c9b8a0]",
];

/**
 * Pila de fotos con scroll: la sección queda fija y cada foto nueva sube desde
 * abajo, rotando, hasta quedar encima de la anterior; las anteriores quedan
 * asomando con una pequeña rotación.
 * Con `prefers-reduced-motion` no hay pin: las fotos se muestran en columna.
 */
export default function PhotoStack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${(cards.length - 1) * 100}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          if (i === 0) return;
          const dir = i % 2 ? 1 : -1;
          // la nueva foto sube desde abajo y se pone derecha encima
          tl.fromTo(
            card,
            { yPercent: 120, rotate: dir * 14 },
            { yPercent: 0, rotate: 0, ease: "power2.out", duration: 1 },
            i - 1,
          );
          // la anterior se queda asomando con una pequeña rotación
          tl.to(
            cards[i - 1],
            { rotate: -dir * 6, scale: 0.96, duration: 1 },
            i - 1,
          );
        });

        // pausa final con la última foto completa antes de soltar el pin
        tl.to({}, { duration: 0.4 }, cards.length - 1);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex h-screen items-center justify-center overflow-hidden bg-black p-5 motion-reduce:h-auto motion-reduce:flex-col motion-reduce:gap-8 motion-reduce:overflow-visible motion-reduce:py-20"
    >
      {PHOTOS.map((photo, i) => (
        <div
          key={i}
          data-card
          className="absolute aspect-[4/5] w-[min(100%-40px,26rem)] overflow-hidden rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/15 will-change-transform md:aspect-[3/2] md:w-[min(70%,52rem)] motion-reduce:relative"
          style={{ zIndex: i + 1 }}
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 52rem, 90vw"
              className="object-cover"
              draggable={false}
            />
          ) : (
            <div
              role="img"
              aria-label={photo.alt}
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${PLACEHOLDER_TINTS[i % PLACEHOLDER_TINTS.length]}`}
            >
              <span className="font-cormorant text-2xl uppercase tracking-[0.3em] text-white/70">
                Foto {i + 1}
              </span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
