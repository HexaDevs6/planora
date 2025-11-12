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
import { getPublicUrl } from "@/lib/storage";

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

  // handle if thumb is local, remote, or from supabase storage
  const handleThumbnail = (el) => {
    //if no image
    if (!el) return loremImg;

    // if its from a remote url 
    if (typeof el === "string" && el.startsWith("http")) {
      return el;
    }

    // if its from supabase storage
    if (typeof el === "string") {

      return getPublicUrl("services", el);
    }

    // fallback
    return loremImg;
  };



  const getImages = (images) => {
    if (!images) return [];

    // in case images received as json string (rarley)
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        return parsed.map((img) => getPublicUrl("services", img.path));
      } catch {
        return [];
      }
    }

    // normal case as array of objects
    if (Array.isArray(images)) {
      return images.map((img) => getPublicUrl("services", img.path));
    }

    return [];
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="container">
      <DetailsHero
        lang={lang}
        img={handleThumbnail(service?.thumbnail)}
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
              {lang === "ar" ? service.description_ar : service.description}
            </p>
          </section>
          {service?.images?.length > 0 && (
            <ServiceGallery images={getImages(service.images)} />
          )}
          {/* <ServiceReviews reviews={service.reviews_list} /> */}
        </div>
      </div>
    </main>
  );
};

export default ServiceDetails;
