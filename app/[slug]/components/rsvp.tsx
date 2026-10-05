"use client";

import { useState, useTransition } from "react";
import { saveRsvp } from "../actions";

type Props = {
  slug: string;
  confirmed: boolean | null;
  vegetarian: boolean;
  restrictions: string | null;
};

const BUTTON =
  "border border-white px-6 py-3 font-cormorant text-xl uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black";
const LINK =
  "px-4 py-2 font-cormorant text-xl text-white transition-colors duration-300 hover:underline hover:underline-offset-4";

/** Pregunta Sí/No con dos botones (aria-pressed). */
function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-cormorant text-[clamp(1.1rem,2.2vw,1.4rem)]">
        {label}
      </p>
      <div className="flex gap-3">
        {[
          { text: "Sí", v: true },
          { text: "No", v: false },
        ].map(({ text, v }) => (
          <button
            key={text}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`w-24 border border-white py-2 font-cormorant text-xl transition-colors duration-300 ${
              value === v ? "bg-white text-black" : "text-white hover:bg-white/15"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Formulario de confirmación. Sin responder (o editando) muestra el formulario;
 * ya respondido, lo oculta y deja un botón para cambiar la respuesta.
 */
export default function Rsvp({
  slug,
  confirmed,
  vegetarian: savedVegetarian,
  restrictions: savedRestrictions,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [vegetarian, setVegetarian] = useState(savedVegetarian);
  const [hasRestrictions, setHasRestrictions] = useState(!!savedRestrictions);
  const [restrictions, setRestrictions] = useState(savedRestrictions ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showForm = confirmed === null || editing;

  function submit(attending: boolean) {
    const text = restrictions.trim();
    if (attending && hasRestrictions && !text) {
      setError("Cuéntanos cuál es tu restricción o alergia.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await saveRsvp({
        slug,
        confirmed: attending,
        vegetarian: attending && vegetarian,
        restrictions: attending && hasRestrictions ? text : null,
      });
      if (res.ok) setEditing(false);
      else setError(res.error);
    });
  }

  function cancel() {
    setVegetarian(savedVegetarian);
    setHasRestrictions(!!savedRestrictions);
    setRestrictions(savedRestrictions ?? "");
    setError(null);
    setEditing(false);
  }

  return (
    <section className="flex flex-col items-center gap-10 bg-black px-5 py-24 text-center text-white">
      <h2 className="font-pinyon text-[clamp(3rem,14vw,7rem)] leading-[1.05]">
        Confirma tu asistencia
      </h2>

      {showForm ? (
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <YesNo
            label="¿Eres vegetariano?"
            value={vegetarian}
            onChange={setVegetarian}
          />

          <YesNo
            label="¿Tienes alguna restricción o alergia alimentaria?"
            value={hasRestrictions}
            onChange={setHasRestrictions}
          />

          {hasRestrictions && (
            <textarea
              aria-label="Restricciones o alergias"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Cuéntanos cuál"
              className="w-full resize-none border border-white/50 bg-transparent p-3 font-cormorant text-xl text-white outline-none placeholder:text-white/40 focus:border-white"
            />
          )}

          {error && (
            <p role="alert" className="font-cormorant text-lg text-[#ff8a8a]">
              {error}
            </p>
          )}

          {isPending ? (
            <div className="flex h-24 items-center gap-1" aria-label="Guardando">
              <span className="h-3 w-3 animate-bounce rounded-full bg-white/70 [animation-delay:0ms]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-white/70 [animation-delay:150ms]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-white/70 [animation-delay:300ms]" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => submit(true)} className={BUTTON}>
                Confirmar asistencia
              </button>
              <button onClick={() => submit(false)} className={LINK}>
                No podré asistir
              </button>
              {confirmed !== null && (
                <button onClick={cancel} className={`${LINK} text-white/60`}>
                  Cancelar
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex max-w-md flex-col items-center gap-6 font-cormorant">
          {confirmed ? (
            <>
              <p className="text-[clamp(1.5rem,4vw,2rem)]">
                ¡Gracias por confirmar tu asistencia! ✨
              </p>
              <p className="text-[clamp(1.1rem,2.2vw,1.4rem)] italic text-white/80">
                Nos hace muy felices saber que nos acompañarás en este día tan
                especial.
              </p>
              <p className="text-lg text-white/60">
                {savedVegetarian ? "Vegetariano" : "No vegetariano"}
                {savedRestrictions && ` · ${savedRestrictions}`}
              </p>
            </>
          ) : (
            <>
              <p className="text-[clamp(1.5rem,4vw,2rem)]">
                Entendemos que no puedas acompañarnos
              </p>
              <p className="text-[clamp(1.1rem,2.2vw,1.4rem)] italic text-white/80">
                Gracias por estar presente de corazón 🤍
              </p>
            </>
          )}
          <button onClick={() => setEditing(true)} className={LINK}>
            Cambiar mi respuesta
          </button>
        </div>
      )}
    </section>
  );
}
