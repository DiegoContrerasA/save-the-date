import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found · Diego & Andrea",
};

export default function NotFound() {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0a0806]`}
    >
      <div className="relative flex flex-col items-center px-8 text-center">
        <div className="font-cormorant mb-4 text-[180px] font-light leading-none tracking-[0.12em] text-[#fbf6ef]">
          404
        </div>
        <div className="font-cormorant text-xl uppercase tracking-[0.32em] text-[#fbf6ef]">
          Invitation not found
        </div>
      </div>
    </div>
  );
}
