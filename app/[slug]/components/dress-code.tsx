"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Colores reservados (no usar): blanco, rojo, naranjas/marrones y grises/beige cálidos.
const RESERVED_COLORS = [
  "#FFFFFF",
  "#C1121F",
  "#F8AE61",
  "#CA6A28",
  "#A7510E",
  "#883B0B",
  "#C6AE96",
  "#A5927F",
  "#897868",
  "#6F5C49",
];

/** Dress code: imagen de referencia, nota sobre tenis y colores reservados. */
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
      className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white px-5 py-24 text-center text-black"
    >
      <h2
        data-reveal
        className="font-pinyon text-[clamp(3.75rem,17vw,9rem)] leading-[1.05]"
      >
        Dress code
      </h2>

      <div
        data-reveal
        className="relative aspect-[433/577] w-[min(100%,26rem)]"
      >
        <Image
          src="/dress-code/dress-code.webp"
          alt="Ejemplos de vestimenta: arriba para hombres, abajo para mujeres, en tonos negro, azul, beige, blanco y verde."
          fill
          sizes="(min-width: 480px) 26rem, 90vw"
          className="object-contain"
          draggable={false}
        />
      </div>

      <p
        data-reveal
        className="max-w-md font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-black/80"
      >
        A las niñas les recomendamos llevar tenis para la fiesta.
      </p>

      <div data-reveal className="flex max-w-lg flex-col items-center gap-7">
        <span className="h-px w-12 bg-black/40" />
        <p className="font-cormorant text-base uppercase tracking-[0.4em] text-black/60">
          Colores reservados
        </p>
        <p className="font-cormorant text-[clamp(1.25rem,2.6vw,1.6rem)] italic leading-snug text-black/80">
          Estos colores están reservados (tonos tierra), te pedimos no usarlos.
        </p>
        <ul className="flex flex-wrap justify-center gap-5">
          {RESERVED_COLORS.map((color) => (
            <li
              key={color}
              title={color}
              aria-label={`Color reservado ${color}`}
              className="h-12 w-12 rounded-full ring-1 ring-black/30 ring-offset-2 ring-offset-white"
              style={{ backgroundColor: color }}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
