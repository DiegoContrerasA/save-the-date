import { notFound } from "next/navigation";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { guests } from "../guests";
import SaveTheDateClient from "./SaveTheDateClient";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-pinyon",
  weight: "400",
});

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
    <SaveTheDateClient
      guestName={guestName}
      fontClassName={`${cormorant.variable} ${pinyon.variable}`}
    />
  );
}
