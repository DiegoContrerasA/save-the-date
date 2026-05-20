import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Shared blurred background */}
        <div className="fixed inset-0 bg-[#0a0806]">
          <div className="absolute inset-[-40px]">
            <Image
              src="/couple.avif"
              alt=""
              fill
              aria-hidden
              style={{
                objectFit: "cover",
                objectPosition: "50% 30%",
                filter: "blur(48px) brightness(0.22) saturate(1.4)",
                transform: "scale(1.08)",
              }}
            />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
