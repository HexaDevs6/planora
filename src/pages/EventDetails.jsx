import EventHero from "@/components/DetailsHero";
import Details from "@/components/events/Details";

import React from "react";
import WhyAttend from "@/components/events/WhyAttend";
import Highlights from "@/components/events/Highlights";
import HostInfo from "@/components/events/HostInfo";
import Location from "@/components/events/Location";
import EventCountdown from "@/components/events/EventCountdown";
// import QuickInfo from "@/components/events/QuickInfo";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import DetailsHero from "@/components/DetailsHero";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "@/components/SpinnerLoader";
import { supabase } from "@/lib/supabaseClient";
const details = {
   start_date: "2025-11-01T18:00:00Z",
   end_date: "2025-11-03T21:00:00Z",
   price: 299,
   address: {
      ar: "العنوان بالعربي",
      en: "English Address",
   },
}
const highlights = [
   {
      title: {
         ar: "السخي  سيب سيم ث شسيمس يكسحخيمء",
         en: "sak sls oiefwmnclk fljsd kjiisjfs",
      },
      description: {
         ar: "السخي  سيب سيم ث شسيمس يكسحخيمء ههيةسيخؤو خسيخيوث نبه  بنب",
         en: "sak sls oiefwmnclk fljsd kjiisjfs dsdi cmems .xw, mxksam ew uuyed",
      },
   },
   {
      title: {
         ar: "السخي  سيب سيم ث شسيمس يكسحخيمء",
         en: "sak sls oiefwmnclk fljsd kjiisjfs",
      },
      description: {
         ar: "السخي  سيب سيم ث شسيمس يكسحخيمء ههيةسيخؤو خسيخيوث نبه  بنب",
         en: "sak sls oiefwmnclk fljsd kjiisjfs dsdi cmems .xw, mxksam ew uuyed",
      },
   },
   {
      title: {
         ar: "السخي  سيب سيم ث شسيمس يكسحخيمء",
         en: "sak sls oiefwmnclk fljsd kjiisjfs",
      },
      description: {
         ar: "السخي  سيب سيم ث شسيمس يكسحخيمء ههيةسيخؤو خسيخيوث نبه  بنب",
         en: "sak sls oiefwmnclk fljsd kjiisjfs dsdi cmems .xw, mxksam ew uuyed",
      },
   },
]
const location = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3418.8272013926735!2d30.466650274469004!3d31.031063671155543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f66bd729891573%3A0x4f36bd676063305c!2sInternational%20Academy%20of%20Information%20Technology%20and%20Languages!5e0!3m2!1sen!2seg!4v1761057016093!5m2!1sen!2seg"
const EventDetails = () => {
   const { lang } = useDirection();
   const { eventId } = useParams();
   const [event, setEvent] = useState(null);
   
   // const [service, setService] = useState(null);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      const fetchEvent = async () => {
         setLoading(true);
         const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId);
         if (error) {
            console.error(error);
            return;
         } else {
            setLoading(false);
            setEvent(data[0]);
         }
      };
      fetchEvent();
   }, [eventId]);
   if (loading) {
      return <Spinner />;
   }
   return (
      <main>
         <div className="container">
            {/* hero */}
            <DetailsHero lang={lang} img={event.thumbnail} title={lang === "ar" ? event.name_ar : event.name} />
            {/* details */}
            <Details lang={lang} details={details} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-10">
                  <section>
                     <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
                        {lang === "en" ? "About the Event" : "حول الحدث"}
                     </h3>
                     <p className="text-foreground leading-relaxed">
                        {lang === "ar" ? event.description_ar : event.description}
                     </p>
                  </section>
                  <Highlights lang={lang} highlights={highlights} />
                  <Location lang={lang} />
                  <WhyAttend lang={lang} />
                  <HostInfo lang={lang} />
                  <section className="gradient-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <h3 className="text-2xl font-bold text-gradient-amber">
                           {lang === "en" ? "Ready to Innovate?" : "هل أنت مستعد للابتكار؟"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                           {lang === "en" ? "Secure your spot at the summit today." : "احجز مكانك في القمة اليوم."}
                           
                        </p>
                     </div>
                     <div className="flex-shrink-0 flex gap-4">
                        <button className="px-6 py-3 rounded-lg bg-violet text-white font-bold shadow-lg hover:bg-violet/80 transition-all transform">
                           {lang === "en" ? "Book Now" : "احجز الآن"}
                           
                        </button>
                        <button className="px-6 py-3 rounded-lg bg-violet/15 text-gray-800 dark:text-gray-200 font-bold border border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                           {lang === "en" ? "Share " : "مشاركه"}
                           
                        </button>
                     </div>
                  </section>
               </div>
               <div className="md:col-span-1 space-y-8">
                  <EventCountdown details={details} lang={lang} />
                  {/* <QuickInfo /> */}
                  <div className="gradient-card rounded-xl p-6 text-center">
                     <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {lang === "en"?"Share This Event" : "شارك هذا الحدث"}
                     </h4>
                     <div className="flex justify-center gap-4">
                        <button className="p-3 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform">
                           <Facebook />
                        </button>
                        <button className="p-3 rounded-full bg-blue-400 text-white hover:scale-110 transition-transform">
                           <Twitter />
                        </button>
                        <button className="p-3 rounded-full bg-red-600 text-white hover:scale-110 transition-transform">
                           <Instagram />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
};

export default EventDetails;
