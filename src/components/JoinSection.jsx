import React from "react";

export default function JoinSection() {
  return (
    <section className="static md:relative flex justify-center items-center">
      <div className="static md:absolute min-w-full md:min-w-70 -top-0 md:-top-50  drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-secondary py-12 px-2 md:px-30 rounded-0 md:rounded-sm text-center flex justify-center items-center flex-col gap-6">
        <h1 className="font-bold text-violet text-2xl md:text-3xl">
          Ready to Transform Your Events?
        </h1>
        <p className="text-[16px] md:text-xl text-primary">
          Join event hosts and attendees who trust Planora
        </p>
        <form className="flex rounded-sm overflow-hidden">
          <input
            type="email"
            placeholder="Your Email"
            className="bg-violet-200 text-violet placeholder-violet/70 px-4 py-3 outline-none focus:bg-violet-100 pr-1"
            required
          />
          <button
            type="submit"
            className="bg-violet text-white px-6 py-3 font-medium hover:bg-violet"
          >
            Join
          </button>
        </form>
      </div>
      
    </section>
  );
}
