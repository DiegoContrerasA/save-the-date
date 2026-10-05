import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getGuestBySlug } from "../lib/guests";
import { I18nProvider } from "../lib/i18n";
import { getMessages } from "../lib/messages";
import DressCode from "./components/dress-code";
import Envelopes from "./components/envelopes";
import Intro from "./components/intro";
import NoKids from "./components/no-kids";
import Personal from "./components/personal";
import PhotoStack from "./components/photo-stack";
import Rsvp from "./components/rsvp";
import Timeline from "./components/timeline";
import Venue from "./components/venue";

// Una sola consulta por petición (la usan la página y generateMetadata)
const getGuest = cache(getGuestBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guest = await getGuest(slug);
  const m = getMessages(guest?.language ?? "es");
  return {
    title: m.meta.title,
    description: m.meta.description,
    robots: { index: false, follow: false },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = await getGuest(slug);
  if (!guest) notFound();

  return (
    <I18nProvider lang={guest.language}>
      <main className="relative z-10 w-full overflow-x-clip">
        <Intro name={guest.name} />

        <Venue />
        <Timeline />
        <PhotoStack />
        <Personal
          name={guest.name}
          hasRole={guest.hasRole}
          confirmed={guest.confirmed}
        />
        <Envelopes />
        <DressCode />
        <NoKids />
        <Rsvp
          slug={guest.slug}
          confirmed={guest.confirmed}
          vegetarian={guest.vegetarian}
          restrictions={guest.restrictions}
        />
      </main>
    </I18nProvider>
  );
}
