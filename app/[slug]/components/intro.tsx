"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  name: string;
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
export default function Intro({ name }: Props) {
  const root = useRef<HTMLElement>(null);
  // Una palabra por línea: nombres compuestos o largos hacen salto de línea
  const words = name.trim().split(/\s+/);

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
      className="relative isolate h-screen w-full overflow-hidden bg-black [contain:paint] !max-w-full !w-full motion-safe:!h-screen motion-safe:!max-h-screen motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:overflow-visible"
    >
      {/* BIENVENIDA (debajo; se ve solo a través de las letras).
          Foto de la pareja con blur y capa negra para que el texto se lea
          aunque la foto tenga mucha luz. */}
      <div className="absolute inset-0 z-10 overflow-hidden bg-black motion-reduce:relative motion-reduce:min-h-screen">
        <Image
          src="/photos/hero.jpg"
          alt="Diego y Andrea"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-[45%_50%] blur-[3px] brightness-[0.7] saturate-[0.9]"
          draggable={false}
        />
        {/* Capa negra: más densa arriba y abajo, donde va el texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80" />

        <div className="relative flex h-full flex-col items-center justify-evenly p-5 text-center text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.6)] motion-reduce:min-h-screen">
          {/* Fecha */}
          <div>
            <div className="flex items-center justify-center gap-[2vw] font-cormorant text-[clamp(2.5rem,7vw,6rem)] font-light leading-none tracking-[0.05em]">
              <span>08</span>
              <span className="inline-block h-[0.8em] w-px bg-white" />
              <span>01</span>
              <span className="inline-block h-[0.8em] w-px bg-white" />
              <span>2027</span>
            </div>
            <p className="mt-[1.5vh] font-cormorant text-[clamp(0.75rem,1.3vw,1.1rem)] uppercase tracking-[0.35em] text-white/80">
              Viernes, 8 de enero de 2027 · Medellín, Colombia
            </p>
          </div>

          {/* Nombres */}
          <p className="font-cormorant text-[clamp(1.75rem,4.2vw,3.5rem)] font-semibold uppercase leading-tight tracking-[0.08em]">
            <span className="block">Diego Contreras</span>
            <span className="block font-pinyon text-[1.4em] font-normal normal-case leading-none">
              &
            </span>
            <span className="block">Andrea Cardona</span>
          </p>

          {/* Bienvenida + mensaje (texto provisional, se puede cambiar) */}
          <div className="flex flex-col items-center">
            <h2 className="text-balance font-pinyon text-[clamp(2rem,5vw,4.5rem)] leading-[1.05]">
              Bienvenidos a nuestra boda
            </h2>
            <div className="mt-[2vh] max-w-[min(90vw,36rem)] space-y-[1.5vh] font-cormorant text-[clamp(1rem,1.7vw,1.4rem)] italic leading-snug text-white/90">
              <p>
                Después de tantos caminos compartidos, decidimos recorrer el
                resto juntos. Queremos vivir el día más importante de nuestras
                vidas rodeados de las personas que más amamos.
              </p>
              <p>
                Gracias por ser parte de nuestra historia y por acompañarnos a
                celebrar el comienzo de la siguiente.
              </p>
            </div>
          </div>
        </div>
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
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-neutral-900 px-5 mix-blend-multiply motion-reduce:relative motion-reduce:order-first motion-reduce:h-screen motion-reduce:mix-blend-normal"
      >
        <div data-hero-in className="w-full text-center">
          <h1
            data-hero-name
            aria-label={name}
            className="relative font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,15vw,15rem)] [overflow-wrap:anywhere] font-black uppercase leading-[0.95] tracking-tight text-white"
          >
            {words.map((word, wi) => (
              <span key={wi} aria-hidden className="block">
                {Array.from(word).map((c, ci) => (
                  <span key={ci} data-char>
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Textos de apoyo, fuera del blend para que se lean */}
      <div
        data-hero-ui
        className="pointer-events-none absolute inset-0 z-30 motion-reduce:bottom-auto motion-reduce:h-screen"
      >
        <div data-hero-in className="absolute inset-x-0 top-[14vh] text-center">
          <p className="font-cormorant text-[clamp(0.75rem,1.4vw,1.25rem)] uppercase tracking-[0.4em] text-white/60">
            Con mucho cariño para
          </p>
        </div>
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
