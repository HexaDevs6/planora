import React from "react";
import { CalendarDays } from "lucide-react";
import { Search } from 'lucide-react';
import { Store } from 'lucide-react';
import { BellRing } from 'lucide-react';
import { BrainCircuit } from 'lucide-react';
import { StarHalf } from 'lucide-react';

export default function PlanSection() {
  return (
    <section className="py-16 bg-[linear-gradient(to_right,#99248D_0%,var(--color-violet-dark)_100%)]">
      <div className="container">
        <div className="plan__header text-center">
          <h2 className="font-bold text-4xl text-white text-shadow-lg">
            Why Should you plan with Planora
          </h2>
          <p className="font-medium text-xl mt-6 text-amber">
            Connecting People with smart and joy
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div
            className="group flex flex-col text-center justify-center items-center gap-5 rounded-sm p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50"
          >
            <CalendarDays
              size={72}
              strokeWidth={1.2}
              className="text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2"
            />

            <h4 className="font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300">
              Easy Booking
            </h4>

            <p className="text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
              Fast & secure ticketing
            </p>
          </div>
          <div
            className="group flex flex-col text-center justify-center items-center gap-5 rounded-sm p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50"
          >
            <Search
              size={72}
              strokeWidth={1.2}
              className="text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2"
            />

            <h4 className="font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300">
              Smart Search
            </h4>

            <p className="text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
              Find events instantly 
            </p>
          </div>
          <div
            className="group flex flex-col text-center justify-center items-center gap-5 rounded-sm p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50"
          >
            <Store
              size={72}
              strokeWidth={1.2}
              className="text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2"
            />

            <h4 className="font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300">
              Services Marketplace 
            </h4>

            <p className="text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
              Hire photographers, planners, decorators & more..
            </p>
          </div>
          <div
            className="group flex flex-col text-center justify-center items-center gap-5 rounded-sm p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50"
          >
            <BellRing 
              size={72}
              strokeWidth={1.2}
              className="text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2"
            />

            <h4 className="font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300">
              Notifications
            </h4>

            <p className="text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
              Stay updated & never miss out
            </p>
          </div>
          <div
            className="group flex flex-col text-center justify-center items-center gap-5 rounded-sm p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50"
          >
            <BrainCircuit
              size={72}
              strokeWidth={1.2}
              className="text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2"
            />

            <h4 className="font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300">
              AI Powered
            </h4>

            <p className="text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
              Ai Suggestions and Helper
            </p>
          </div>
          <div
            className="group text-center flex flex-col text-center justify-center items-center gap-5 rounded-sm p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50"
          >
            <StarHalf
              size={72}
              strokeWidth={1.2}
              className="text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2"
            />

            <h4 className="font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300">
              Rating & Blog
            </h4>

            <p className="text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
              feedback for events & service providers
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
