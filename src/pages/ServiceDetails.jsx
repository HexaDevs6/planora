import React from "react";
import DetailsHero from "@/components/DetailsHero";
import { useDirection } from "@/hooks/useDirection";
import ProviderCard from "@/components/services/ProviderCard";
import ServiceGallery from "@/components/services/ServiceGallery";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "@/components/SpinnerLoader";
import { getPublicUrl } from "@/lib/storage";

import { useSelector } from "react-redux";
import { createOrGetConversation } from "@/lib/chatService";

const ServiceDetails = () => {
  const { lang } = useDirection();
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // get current logged-in user from redux
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // fetch service details
  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId);

      if (error) {
        console.error(error);
      } else {
        setService(data[0]);
      }
      setLoading(false);
    };

    fetchService();
  }, [serviceId]);

  // handle thumbnail helper
  const handleThumbnail = (el) => {
    if (!el) return "";
    if (typeof el === "string" && el.startsWith("http")) return el;
    if (typeof el === "string") return getPublicUrl("services", el);
    return "";
  };

  // send message (create conversation → go to user messages)
  const handleMessageHost = async () => {
    if (!user?.id) {
      return alert("You must be logged in to message the host.");
    }

    if (!service?.client_id) {
      return alert("Host ID not found for this service.");
    }

    try {
      const convoId = await createOrGetConversation(user.id, service.client_id);
      //use search params to pass conversation id???
      navigate(`/user/messages?cid=${convoId}`);
    } catch (err) {
      console.error("Failed to start conversation:", err.message);
      alert("Cannot start conversation right now.");
    }
  };

  const getImages = (images) => {
    if (!images) return [];

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        return parsed.map((img) => getPublicUrl("services", img.path));
      } catch {
        return [];
      }
    }

    if (Array.isArray(images)) {
      return images.map((img) => getPublicUrl("services", img.path));
    }

    return [];
  };

  if (loading) return <Spinner />;

  return (
    <main className="container">
      <DetailsHero
        lang={lang}
        img={handleThumbnail(service?.thumbnail)}
        title={lang === "ar" ? service.name_ar : service.name}
      />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-8">

        {/* LEFT SIDE - Provider Info */}
        <div className="md:col-span-2">
          <ProviderCard provider_id={service.client_id} />

          {/* >>>>>>>>>> ADD MESSAGE BUTTON HERE <<<<<<<<<< */}
          <button
            onClick={handleMessageHost}
            className="mt-4 w-full px-6 py-3 bg-violet text-white rounded-lg font-bold shadow-md hover:bg-violet/80 transition"
          >
            {lang === "ar" ? "مراسلة مقدم الخدمة" : "Message Provider"}
          </button>
        </div>

        {/* RIGHT SIDE - Details */}
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
        </div>
      </div>
    </main>
  );
};

export default ServiceDetails;
