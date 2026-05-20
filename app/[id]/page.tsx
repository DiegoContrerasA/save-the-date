import { notFound } from "next/navigation";
import { guests } from "../guests";
import Image from "next/image";
import AttendanceForm from "./components/form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!guests[id]) return {};
  return {
    title: "Save the Date · Diego & Andrea · 08.01.2027",
  };
}

export default async function SaveTheDatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guestName = guests[id];
  if (!guestName) notFound();

  return (
    <div className="w-full md:w-[460px] h-full md:my-10 relative z-10 mx-auto">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/couple.avif"
          alt="Diego & Andrea"
          fill
          priority
          className="absolute inset-0 object-cover object-[50%_30%] saturate-85 brightness-72 contrast-102"
          draggable={false}
        />
        <div className="absolute inset-0 overflow-auto flex flex-col justify-between text-shadow-2xs items-center bg-gradient-to-t from-black/80 to-transparent px-7 py-10">

          <div>
            <h2 className="font-cormorant text-2xl font-thin text-center text-white/80 mb-3">Angela Uribe & Alberto Cardona</h2>
            <h1 className="text-7xl font-pinyon text-white text-center">Save the date</h1>
          </div>

          <div>
            <div className="font-cormorant text-7xl tracking-[3px] flex gap-4.5 font-light text-white">
              <span>01</span>
              <span className="inline-block w-px h-14 bg-white" />
              <span>08</span>
              <span className="inline-block w-px h-14 bg-white" />
              <span>2027</span>
            </div>
            <p className="text-center uppercase font-cormorant font-semibold text-3xl mt-4">Diego <span className="font-pinyon">&</span> Andrea</p>
            <p className="text-center text-white/60 font-cormorant text-xs">Medellín · Colombia</p>
           <AttendanceForm />
          </div>
        </div>
      </div>
    </div>
  );
}
