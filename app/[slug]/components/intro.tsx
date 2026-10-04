"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  name: string;
  roleMessage: string | null;
};

// Letras sin una zona sólida en su centro-izquierda: no sirven como punto de zoom
const BAD_ANCHORS = "AVWTYJ";

/**
 * Letra con trazo sólido más cercana al centro del nombre (en 2D).
 * Medimos con offsetLeft/Top, que ignoran transforms, así que funciona
 * aunque el nombre ya esté escalado.
 */
function findAnchor(h1: HTMLElement) {
  const cx = h1.offsetWidth / 2;
  const cy = h1.offsetHeight / 2;
  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  h1.querySelectorAll<HTMLElement>("[data-char]").forEach((el) => {
    const c = el.textContent ?? "";
    if (!/\p{L}/u.test(c) || BAD_ANCHORS.includes(c.toUpperCase())) return;
    const dx = el.offsetLeft + el.offsetWidth * 0.25 - cx;
    const dy = el.offsetTop + el.offsetHeight * 0.55 - cy;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      best = el;
      bestDist = dist;
    }
  });
  return best as HTMLElement | null;
}

/**
 * Hero + Bienvenida pineados, con el nombre como "ventana".
 *
 * 1. Carga: fondo negro, nombre en blanco.
 * 2. Primer scroll: la letra pasa de blanco a transparente (deja ver lo que
 *    hay debajo) y crece hasta salirse de la pantalla. El zoom se hace sobre
 *    el trazo sólido de una letra, así al final toda la pantalla queda dentro
 *    de la letra y el contenido se ve completo.
 * 3. El hero descubierto se queda fijo un rato antes de soltar el pin.
 *
 * Técnica: capa negra con el nombre en blanco y `mix-blend-mode: multiply`
 * (blanco = deja ver lo de abajo, negro = lo tapa) + una cubierta blanca que
 * se desvanece para que la letra empiece "blanca". La capa con blend debe ser
 * hija directa de la sección (sin wrapper con z-index) para que el multiply
 * vea la bienvenida que hay debajo.
 *
 * Con `prefers-reduced-motion` no hay animación: hero y bienvenida se apilan.
 */
export default function Intro({ name, roleMessage }: Props) {
  const root = useRef<HTMLElement>(null);
  const chars = Array.from(name);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nameEl = () =>
          root.current?.querySelector<HTMLElement>("[data-hero-name]") ?? null;
        // Punto de zoom (en px dentro del h1): trazo sólido de una letra central
        const anchorPoint = () => {
          const h1 = nameEl();
          const el = h1 && findAnchor(h1);
          if (!h1 || !el) return null;
          return {
            el,
            x: el.offsetLeft + el.offsetWidth * 0.25,
            y: el.offsetTop + el.offsetHeight * 0.55,
            cx: h1.offsetWidth / 2,
            cy: h1.offsetHeight / 2,
          };
        };

        // Entrada al cargar. Solo sobre wrappers (data-hero-in): si el mismo
        // elemento también se animara con el scroll, el timeline leería
        // opacity:0 como valor inicial y el efecto no se vería.
        gsap.from("[data-hero-in]", {
          opacity: 0,
          y: 24,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.2,
          delay: 0.2,
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=320%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true, // recalcula origen y escala al redimensionar
          },
        });

        tl.to("[data-hero-ui]", { opacity: 0, duration: 0.12 }, 0)
          // la letra blanca pasa a transparente desde el primer scroll
          .to("[data-hero-cover]", { opacity: 0, duration: 0.25 }, 0)
          // la letra crece sobre el trazo de una letra hasta llenar la pantalla
          .to(
            "[data-hero-name]",
            {
              scale: () => {
                const p = anchorPoint();
                if (!p) return 40;
                return (
                  Math.max(
                    window.innerWidth / (p.el.offsetWidth * 0.22),
                    window.innerHeight / (p.el.offsetHeight * 0.5),
                  ) * 1.15
                );
              },
              // el zoom es sobre la letra, pero ese punto viaja al centro de la
              // pantalla: se siente como acercarse de frente, sin irse a un lado
              transformOrigin: () => {
                const p = anchorPoint();
                return p ? `${p.x}px ${p.y}px` : "50% 55%";
              },
              x: () => {
                const p = anchorPoint();
                return p ? p.cx - p.x : 0;
              },
              y: () => {
                const p = anchorPoint();
                return p ? p.cy - p.y : 0;
              },
              ease: "power2.in",
              duration: 1.2,
            },
            0,
          )
          // seguro: si algún borde de la letra aún tapa, la capa se retira
          .to("[data-hero-mask]", { opacity: 0, duration: 0.2 }, 1)
          // pausa: el hero ya descubierto se queda fijo antes de soltar el pin
          .to({}, { duration: 0.6 }, 1.2);
      });

      // Las fuentes cambian el tamaño del texto: recalcular posiciones
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-dvh w-full overflow-hidden bg-black motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:overflow-visible"
    >
      {/* BIENVENIDA (placeholder, debajo; se ve solo a través de las letras).
          Fondo rojo plano temporal para poder ver el efecto; el contenido real
          (foto, nombres, fecha) se agrega en el siguiente paso. */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#c1121f] motion-reduce:relative motion-reduce:h-dvh">
        <p className="font-playfair text-[clamp(6rem,30vw,28rem)] font-black leading-none text-white">
          X
        </p>
      </div>

      {/* Cubierta blanca: hace que la letra se vea blanca al inicio. Con el
          primer scroll se desvanece y la letra pasa a ser transparente. */}
      <div
        data-hero-cover
        className="pointer-events-none absolute inset-0 z-[15] bg-white motion-reduce:hidden"
      />

      {/* Capa negra con el nombre en blanco: multiply = ventana con forma de letra */}
      <div
        data-hero-mask
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black px-[4vw] mix-blend-multiply motion-reduce:relative motion-reduce:order-first motion-reduce:h-dvh motion-reduce:mix-blend-normal"
      >
        <div data-hero-in className="w-full text-center">
          <h1
            data-hero-name
            aria-label={name}
            className="relative text-balance font-playfair text-[clamp(4rem,15vw,15rem)] font-black uppercase leading-[0.95] tracking-tight text-white"
          >
            {chars.map((c, i) => (
              <span key={i} aria-hidden data-char>
                {c}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Textos de apoyo, fuera del blend para que se lean */}
      <div
        data-hero-ui
        className="pointer-events-none absolute inset-0 z-30 motion-reduce:bottom-auto motion-reduce:h-dvh"
      >
        <div data-hero-in className="absolute inset-x-0 top-[14vh] text-center">
          <p className="font-cormorant text-[clamp(0.75rem,1.4vw,1.25rem)] uppercase tracking-[0.4em] text-white/60">
            Con mucho cariño para
          </p>
        </div>
        {roleMessage && (
          <div
            data-hero-in
            className="absolute inset-x-0 bottom-[16vh] flex justify-center px-6 text-center"
          >
            <p className="max-w-[min(90vw,40rem)] font-cormorant text-[clamp(1.25rem,2.4vw,2rem)] italic text-white/80">
              {roleMessage}
            </p>
          </div>
        )}
        <div
          data-hero-in
          className="absolute inset-x-0 bottom-[5vh] text-center"
        >
          <p className="font-cormorant text-xs uppercase tracking-[0.35em] text-white/50">
            Desliza
          </p>
        </div>
      </div>
    </section>
  );
}
