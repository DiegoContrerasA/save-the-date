"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMessages } from "../../lib/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Photo = { src?: string; position?: string };

// Fotos en /public/photos (4:5, 960px de ancho o más). `position` es el punto
// de enfoque (object-position) para que no se corten las caras en el formato
// horizontal de escritorio.
const PHOTOS: Photo[] = [
  {
    src: "/photos/1.jpg",
    position: "50% 38%",
  },
  {
    src: "/photos/2.jpg",
    position: "50% 35%",
  },
  {
    src: "/photos/3.jpg",
    position: "50% 40%",
  },
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
  const m = useMessages();
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

        const imgs = gsap.utils.toArray<HTMLElement>("[data-card-img]");
        const dims = gsap.utils.toArray<HTMLElement>("[data-card-dim]");

        // la primera foto se "asienta": zoom suave que se acerca a su tamaño
        tl.fromTo(imgs[0], { scale: 1.12 }, { scale: 1, duration: 1 }, 0);

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
          // efecto: llega con zoom y desenfoque que se aclaran al asentarse
          tl.fromTo(
            imgs[i],
            { scale: 1.3, filter: "blur(5px)" },
            { scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 },
            i - 1,
          );
          // la anterior se queda asomando con una pequeña rotación y se oscurece
          tl.to(
            cards[i - 1],
            { rotate: -dir * 6, scale: 0.96, duration: 1 },
            i - 1,
          );
          tl.to(dims[i - 1], { opacity: 0.55, duration: 1 }, i - 1);
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
            <>
              <div data-card-img className="absolute inset-0">
                <Image
                  src={photo.src}
                  alt={m.photos.alts[i]}
                  fill
                  sizes="(min-width: 768px) 52rem, 90vw"
                  priority={i === 0}
                  className="object-cover brightness-[0.82] saturate-[0.9]"
                  style={{ objectPosition: photo.position }}
                  draggable={false}
                />
              </div>
              {/* capa negra como la del hero: más densa arriba y abajo */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
              {/* oscurece la foto cuando otra queda encima */}
              <div
                data-card-dim
                className="pointer-events-none absolute inset-0 bg-black opacity-0"
              />
            </>
          ) : (
            <div
              role="img"
              aria-label={m.photos.alts[i]}
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
