import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import Image from "next/image";
import "./globals.css";

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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Save the Date · Diego & Andrea · 08.01.2027",
  description: "Save the date",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="h-dvh flex flex-col">
        <div className="fixed inset-0 bg-[#0a0806]">
          <div className="absolute inset-[-40px]">
            <Image
              draggable={false}
              src="/couple.avif"
              alt=""
              fill
              aria-hidden
              className="object-cover object-[50%_30%] blur-[48px] brightness-[0.22] saturate-[1.4] scale-[1.08]"
            />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
