"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EVENT } from "../../lib/event";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Lugar, fecha y hora, con botón para abrir Google Maps. */
export default function Venue() {
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
      <p
        data-reveal
        className="font-cormorant text-sm uppercase tracking-[0.4em] text-white/60"
      >
        Te esperamos en
      </p>

      <h2
        data-reveal
        className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,11vw,10rem)] font-black uppercase whitespace-nowrap leading-[0.95] tracking-tight"
      >
        {EVENT.venue.name}
      </h2>

      <div
        data-reveal
        className="flex flex-col items-center gap-2 font-cormorant text-[clamp(1.25rem,3vw,2rem)]"
      >
        <p>{EVENT.dateLabel}</p>
        <p className="text-white/70">Recepción · {EVENT.arrival}</p>
        <p className="text-white/70">{EVENT.city}</p>
      </div>

      <div data-reveal className="flex max-w-md flex-col items-center gap-5">
        <span className="h-px w-12 bg-white/40" />
        <p className="font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-white/80">
          Los parqueaderos son limitados. Te sugerimos venir con otros invitados
          en un mismo carro o llegar en Uber, así todos disfrutamos la noche con
          más tranquilidad.
        </p>
        <span className="h-px w-12 bg-white/40" />
      </div>

      <div
        data-reveal
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        {[
          { label: "Google Maps", href: EVENT.venue.mapsUrl },
          { label: "Waze", href: EVENT.venue.wazeUrl },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-64 border border-white px-6 py-3 text-center font-cormorant text-xl uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black sm:w-auto"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
