"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Posición horizontal (%) y tamaño (px) de los sobres que caen
const RAIN = [
  { left: 6, size: 30 },
  { left: 18, size: 42 },
  { left: 30, size: 28 },
  { left: 44, size: 36 },
  { left: 57, size: 30 },
  { left: 69, size: 44 },
  { left: 80, size: 32 },
  { left: 92, size: 38 },
];

function MiniEnvelope({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 40 28"
      aria-hidden
      className="block"
    >
      <rect x="1" y="1" width="38" height="26" rx="3" fill="#f3eadb" />
      <polyline
        points="1,2 20,16 39,2"
        fill="none"
        stroke="#c9b8a0"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="16" r="3" fill="#c1121f" />
    </svg>
  );
}

/** Sobre grande que se abre (la solapa se levanta y sube la carta). */
function BigEnvelope() {
  return (
    <svg
      viewBox="0 -25 200 175"
      role="img"
      aria-label="Sobre"
      className="w-[min(70vw,16rem)] overflow-visible"
    >
      {/* fondo */}
      <rect x="10" y="40" width="180" height="100" rx="6" fill="#d9ccb4" />
      {/* solapa abierta (detrás de la carta) */}
      <polygon
        data-open-flap
        points="10,40 190,40 100,-18"
        fill="#e6dac3"
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      />
      {/* carta */}
      <g data-letter>
        <rect x="26" y="52" width="148" height="84" rx="3" fill="#fffdf8" />
        <rect x="46" y="72" width="108" height="4" rx="2" fill="#d9ccb4" />
        <rect x="46" y="86" width="108" height="4" rx="2" fill="#d9ccb4" />
        <rect x="46" y="100" width="70" height="4" rx="2" fill="#d9ccb4" />
      </g>
      {/* bolsillo frontal */}
      <polygon
        points="10,42 100,100 190,42 190,134 184,140 16,140 10,134"
        fill="#eadfca"
      />
      <polyline
        points="10,140 100,92 190,140"
        fill="none"
        stroke="#d3c4a8"
        strokeWidth="2"
      />
      {/* solapa cerrada */}
      <g
        data-closed-flap
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
      >
        <polygon
          points="10,40 190,40 100,104"
          fill="#f7efe0"
          stroke="#d3c4a8"
        />
        <circle cx="100" cy="96" r="9" fill="#c1121f" />
      </g>
    </svg>
  );
}

/** Regalo: lluvia de sobres. */
export default function Envelopes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Estado inicial de las piezas que se animan
        gsap.set("[data-open-flap]", { scaleY: 0 });
        gsap.set("[data-letter]", { y: 0 });

        // Texto: entra al llegar a la sección
        gsap.from("[data-reveal]", {
          opacity: 0,
          y: 32,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            once: true,
          },
        });

        // Sobre: se abre y sube la carta
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 55%",
              once: true,
            },
          })
          .to("[data-closed-flap]", {
            scaleY: 0,
            duration: 0.45,
            ease: "power2.in",
          })
          .to("[data-open-flap]", {
            scaleY: 1,
            duration: 0.45,
            ease: "power2.out",
          })
          .to(
            "[data-letter]",
            { y: -42, duration: 0.8, ease: "power3.out" },
            "-=0.1",
          );

        // Lluvia: cae sin parar mientras la sección está a la vista
        const drops = gsap.utils.toArray<HTMLElement>("[data-drop]");
        gsap.fromTo(
          drops,
          { y: -80, rotate: () => gsap.utils.random(-35, 35) },
          {
            y: () => (root.current?.offsetHeight ?? 800) + 80,
            rotate: () => gsap.utils.random(-60, 60),
            duration: () => gsap.utils.random(5, 9),
            delay: () => gsap.utils.random(0, 5),
            ease: "none",
            repeat: -1,
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
              invalidateOnRefresh: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-black p-5 py-24 text-center text-white"
    >
      {/* Lluvia de sobres (decorativa, detrás del contenido) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 motion-reduce:hidden"
      >
        {RAIN.map((d, i) => (
          <div
            key={i}
            data-drop
            className="absolute top-0"
            style={{ left: `${d.left}%` }}
          >
            <MiniEnvelope size={d.size} />
          </div>
        ))}
      </div>

      <div data-reveal>
        <BigEnvelope />
      </div>

      <h2
        data-reveal
        className="font-pinyon text-[clamp(3rem,14vw,7rem)] leading-[1.05]"
      >
        Lluvia de sobres
      </h2>

      <p
        data-reveal
        className="max-w-md font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-white/80"
      >
        Para nuestro regalo hemos elegido una lluvia de sobres.
      </p>
    </section>
  );
}
