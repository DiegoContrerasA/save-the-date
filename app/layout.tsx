import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Pinyon_Script, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["800", "900"],
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
  title: "Invitación de boda · Diego & Andrea · 08.01.2027",
  description: "Nos casamos el 8 de enero de 2027 en Medellín, Colombia. ¡Te esperamos!",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${pinyon.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen touch-pan-y overflow-x-clip overscroll-x-none bg-black text-white">
        {children}
      </body>
    </html>
  );
}
