"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Aviso amable: la fiesta es solo para adultos. */
export default function NoKids() {
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
      className="flex flex-col items-center gap-8 bg-black px-5 py-24 text-center text-white"
    >
      <h2
        data-reveal
        className="font-pinyon text-[clamp(3rem,14vw,7rem)] leading-[1.05]"
      >
        Solo adultos
      </h2>

      <span data-reveal className="h-px w-12 bg-white/40" />

      <p
        data-reveal
        className="max-w-md font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-white/80"
      >
        Queremos que este día sea una noche para disfrutar sin preocupaciones.
        Por eso no podremos recibir niños en la fiesta. Gracias por entender.
      </p>
    </section>
  );
}
