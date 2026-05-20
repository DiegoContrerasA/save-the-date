import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Not Found · Diego & Andrea",
};

export default function NotFound() {
  return (
    <div
      className={`${cormorant.variable} ${pinyon.variable} fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0a0806]`}
    >
      {/* Content */}
      <div className="relative flex flex-col items-center px-8 text-center">
        <div className="font-cormorant mb-4 text-[180px] font-light leading-none tracking-[0.12em] text-[#fbf6ef]">
          404
        </div>

        <div className="mb-6 h-px w-10 bg-[rgba(166,124,82,0.5)]" />

        <div className="font-cormorant text-xl uppercase tracking-[0.32em] text-[#fbf6ef]">
          Invitation not found
        </div>
      </div>
    </div>
  );
}
