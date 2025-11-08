import React from "react";
import DetailsHero from "@/components/DetailsHero";
import { useDirection } from "@/hooks/useDirection";
import ProviderCard from "@/components/services/ProviderCard";
import ServiceGallery from "@/components/services/ServiceGallery";
// import ServiceReviews from "@/components/services/ServiceReviews";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "@/components/SpinnerLoader";

const ServiceDetails = () => {
   const { lang } = useDirection();
   const { serviceId } = useParams();
   const [service, setService] = useState(null);

   // const [service, setService] = useState(null);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      const fetchService = async () => {
         setLoading(true);
         const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("id", serviceId);
         if (error) {
            console.error(error);
            return;
         } else {
            setLoading(false);
            setService(data[0]);
            console.log(data[0]);
         }
      };
      fetchService();
   }, [serviceId]);
   if (loading) {
      return <Spinner />;
   }
   const getImages = (images) => {
      if (images.type === "string") {
         return JSON.parse(images);
      }
      return images;
   };
   return (
      <main className="container">
         <DetailsHero
            lang={lang}
            img={service.thumbnail}
            title={lang === "ar" ? service.name_ar : service.name}
         />
         <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-8">
            <div className="md:col-span-2">
               <ProviderCard provider_id={service.client_id} />
            </div>
            <div className="md:col-span-4">
               <section className="py-8 md:py-12">
                  <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
                     {lang === "en" ? "About the Service" : "حول الخدمة"}
                  </h3>
                  <p className="text-foreground leading-8 text-lg">
                     {lang === "ar"
                        ? service.description_ar
                        : service.description}
                  </p>
               </section>
               {service.images.length > 0 && (
                  <ServiceGallery images={getImages(service.images)} />
               )}
               {/* <ServiceReviews reviews={service.reviews_list} /> */}
            </div>
         </div>
      </main>
   );
};

export default ServiceDetails;
