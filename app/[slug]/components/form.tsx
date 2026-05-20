"use client";

import { useTransition } from "react";
import { confirmAttendance } from "../actions";

type Props = {
  id: string;
  confirmed: boolean | null;
};

export default function AttendanceForm({ id, confirmed }: Props) {
  const [isPending, startTransition] = useTransition();

  function handle(value: boolean) {
    startTransition(() => confirmAttendance(id, value));
  }

    if(isPending) {
    return (
      <div className="flex gap-1 items-center">
          <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
    );
  }

  if (confirmed === true) {
    return (
      <div className="text-center font-cormorant text-white">
          <p className="text-2xl">¡Gracias por confirmar! ✨</p>
          <p className="text-lg text-white/80 mt-1">
            Nos hace muy felices saber que nos acompañarán en este día tan especial.
          </p>
        </div>
    );
  }

  if (confirmed === false) {
    return (
      <div className="text-center font-cormorant text-white">
          <p className="text-2xl">Aunque no puedan acompañarnos,</p>
          <p className="text-lg text-white/80 mt-1">
            gracias por estar presentes de corazón 🤍
          </p>
        </div>
    );
  }



  return (
    <div className="flex flex-col gap-2 items-center">
          <button
            onClick={() => handle(true)}
            className="text-white text-xl border-white border w-fit px-4 py-2 duration-300 font-cormorant transition-colors hover:bg-white hover:text-black"
          >
            Confirmar asistencia
          </button>
          <button
            onClick={() => handle(false)}
            className="text-white text-xl px-4 py-2 duration-300 font-cormorant transition-colors hover:underline hover:underline-offset-3"
          >
            No podré asistir
          </button>
        </div>
  );

}
