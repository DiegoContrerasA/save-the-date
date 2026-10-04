"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Look = { label: string; alt: string; src?: string };

// Reemplazar `src` cuando lleguen las imágenes (van en /public/dress-code/...).
// Mientras no haya `src` se muestra un cuadro de relleno.
const LOOKS: Look[] = [
  { label: "Ellos", alt: "Vestimenta sugerida para hombres" },
  { label: "Ellas", alt: "Vestimenta sugerida para mujeres" },
];

/** Código de vestimenta: una imagen para hombres, otra para mujeres y una nota. */
export default function DressCode() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-reveal]", {
          opacity: 0,
          y: 32,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="flex min-h-screen flex-col items-center justify-center gap-10 bg-black px-5 py-24 text-center text-white"
    >
      <h2
        data-reveal
        className="font-pinyon text-[clamp(3rem,14vw,7rem)] leading-[1.05]"
      >
        Vestimenta
      </h2>

      <div className="flex w-full max-w-5xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center">
        {LOOKS.map((look) => (
          <figure
            key={look.label}
            data-reveal
            className="flex w-[min(100%,24rem)] flex-col items-center gap-4"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm ring-1 ring-white/15">
              {look.src ? (
                <Image
                  src={look.src}
                  alt={look.alt}
                  fill
                  sizes="(min-width: 640px) 24rem, 90vw"
                  className="object-cover"
                  draggable={false}
                />
              ) : (
                <div
                  role="img"
                  aria-label={look.alt}
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3b3b3b] to-[#8a8a8a]"
                >
                  <span className="font-cormorant text-2xl uppercase tracking-[0.3em] text-white/70">
                    {look.label}
                  </span>
                </div>
              )}
            </div>
            <figcaption className="font-cormorant text-sm uppercase tracking-[0.4em] text-white/60">
              {look.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <p
        data-reveal
        className="max-w-md font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-white/80"
      >
        A las niñas les recomendamos llevar tenis para la fiesta.
      </p>
    </section>
  );
}
