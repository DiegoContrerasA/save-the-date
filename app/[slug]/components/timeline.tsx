"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EVENT } from "../../lib/event";
import { useMessages } from "../../lib/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  // puerta abierta
  reception: (
    <>
      <path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" />
      <path d="M3 21h18" />
      <path d="M13 12h.01" />
    </>
  ),
  // dos anillos
  ceremony: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
      <path d="m7 5 2 2 2-2-1-2H8z" />
    </>
  ),
  // copa de cóctel
  cocktail: (
    <>
      <path d="M4 4h16l-8 9z" />
      <path d="M12 13v8" />
      <path d="M8 21h8" />
    </>
  ),
  // cubiertos
  dinner: (
    <>
      <path d="M6 3v7a2 2 0 0 0 2 2v9" />
      <path d="M10 3v7a2 2 0 0 1-2 2" />
      <path d="M18 21V3c-2 2-3 5-3 8h3" />
    </>
  ),
  // nota musical
  party: (
    <>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </>
  ),
};

/** Minuto a minuto: línea de tiempo vertical con entrada escalonada. */
export default function Timeline() {
  const m = useMessages();
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
          stagger: 0.2,
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
      className="flex flex-col items-center gap-12 bg-white px-5 py-24 text-center text-black"
    >
      <h2
        data-reveal
        className="font-pinyon text-[clamp(3rem,14vw,7rem)] leading-[1.05]"
      >
        {m.timeline.title}
      </h2>

      <ol className="relative flex w-full max-w-sm flex-col gap-10 border-l border-black/30 pl-10 text-left">
        {EVENT.schedule.map(({ id, time }) => (
          <li key={id} data-reveal className="relative">
            <span
              aria-hidden
              className="absolute top-0 -left-[3.25rem] flex h-10 w-10 items-center justify-center rounded-full border border-black/40 bg-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                {ICONS[id]}
              </svg>
            </span>
            <p className="font-cormorant text-[clamp(1.1rem,3vw,1.5rem)] uppercase tracking-[0.3em] text-black/80">
              {time}
            </p>
            <p className="font-cormorant text-[clamp(1.5rem,4vw,2.25rem)]">
              {m.timeline.items[id]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
