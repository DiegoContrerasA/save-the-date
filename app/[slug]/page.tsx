import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuestBySlug } from "../lib/guests";
import Envelopes from "./components/envelopes";
import Intro from "./components/intro";
import Personal from "./components/personal";
import PhotoStack from "./components/photo-stack";
import Venue from "./components/venue";

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
      <Intro name={guest.name} />

      <Venue />
      <PhotoStack />
      <Personal name={guest.name} hasRole={guest.hasRole} />
      <Envelopes />
    </main>
  );
}
