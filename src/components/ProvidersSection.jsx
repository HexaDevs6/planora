import React from 'react'
import { AnimatedTestimonials } from './ui/shadcn-io/animated-testimonials'
import Royal_Halls from "../assets/Royal_Halls.jpg";
import Catering from "../assets/Catering.jpg";
import Dj from "../assets/Dj.jpg";

export default function ProvidersSection() {

    const testimonials = [
  {
    quote:
      "Experience the pinnacle of luxury and elegance in our Royal Halls — grand venues designed to host your most prestigious events with unmatched style, ambiance, and service.",
    name: "Royal Halls",
    designation: "Where Grandeur Meets Perfection",
    src: Royal_Halls,
  },
  {
    quote:
      "Delight your guests with world-class catering — exquisite flavors, elegant presentation, and flawless service for every occasion.",
    name: "Catering",
    designation: "Where Every Bite Tells a Story",
    src: Catering,
  },
  {
    quote:
      "Turn up the energy with our professional DJs — bringing the perfect beats to make every moment unforgettable.",
    name: "Disc Jockey (DJ)",
    designation: "Feel the Beat",
    src: Dj,
  },
  
];


  return (
    <section className='bg-[linear-gradient(to_left,#99248D_0%,var(--color-violet-dark)_100%)] py-16 overflow-hidden pb-0 md:pb-50'>
        <div className="container">
            <div className="provider__header text-center">
          <h2 className="font-bold text-4xl text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            Why Should you plan with Planora
          </h2>
        </div>
        <div className="provider__content">
            <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
        </div>
    </section>
  )
}
