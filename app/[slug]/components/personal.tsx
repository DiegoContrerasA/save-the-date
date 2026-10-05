"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  name: string;
  hasRole: boolean;
  // null = sin responder
  confirmed: boolean | null;
};

/**
 * "Esta invitación es personal" + nombre del invitado.
 * Si el invitado tiene un rol especial (flag), debajo del nombre aparece un
 * mensaje cariñoso, el mismo para todos, sin revelar de qué se trata el rol.
 */
export default function Personal({ name, hasRole, confirmed }: Props) {
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
            start: "top 65%",
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
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black p-5 py-24 text-center text-white"
    >
      <p
        data-reveal
        className="font-cormorant text-sm uppercase tracking-[0.4em] text-white/60"
      >
        Esta invitación es personal
      </p>

      <h2
        data-reveal
        className="text-balance font-pinyon text-[clamp(3.5rem,18vw,10rem)] leading-[1.05] [overflow-wrap:anywhere]"
      >
        {name}
      </h2>

      {confirmed !== null && (
        <p
          data-reveal
          className="max-w-md font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-white/80"
        >
          {confirmed
            ? "¡Gracias por confirmar tu asistencia!"
            : "Entendemos que no puedas acompañarnos. Gracias por estar presente de corazón."}
        </p>
      )}

      {hasRole && (
        <div
          data-reveal
          className="flex max-w-md flex-col items-center gap-6 pt-4"
        >
          <span className="h-px w-12 bg-white/40" />
          <p className="font-[family-name:var(--font-playfair)] text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-tight">
            Tú no eres un invitado más
          </p>
          <p className="font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)] italic leading-snug text-white/80">
            Entre todas las personas que amamos, te elegimos a ti para tener un
            papel muy especial en nuestra boda. Tu energía hace la diferencia,
            por eso queremos que ese día vengas con la mejor actitud y las ganas
            de vivirlo con nosotros.
          </p>
        </div>
      )}
    </section>
  );
}
