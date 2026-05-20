"use client";

export default function AttendanceForm() {
  return (
   <form className="flex flex-col gap-2 items-center mt-10">
    <button className="text-white text-xl border-white border w-fit px-4 py-2 duration-300 font-cormorant transition-colors hover:bg-white hover:text-black">Confirm Attendance</button>
    <button className=" text-white text-xl px-4 py-2 rounded-lg duration-300 font-cormorant transition-colors hover:underline hover:underline-offset-3">I`ll not be able to attend</button>
   </form>
  );
}   
