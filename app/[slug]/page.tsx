import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuestBySlug } from "../lib/guests";
import Intro from "./components/intro";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  if (!guest) notFound();

  return (
    <main className="relative z-10 w-full overflow-x-clip">
      <Intro name={guest.name} roleMessage={guest.roleMessage} />

      {/* TEMPORAL: espacio para probar que el scroll continúa tras el pin */}
      <section className="flex h-screen items-center justify-center font-cormorant text-white/60">
        Siguiente sección…
      </section>
    </main>
  );
}
