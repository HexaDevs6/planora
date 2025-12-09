import Details from "@/components/events/Details";

import React, { useEffect, useState } from "react";
import WhyAttend from "@/components/events/WhyAttend";
import HostInfo from "@/components/events/HostInfo";
import Location from "@/components/events/Location";
import EventCountdown from "@/components/events/EventCountdown";
import { Copy, Facebook, Instagram, MessageCircleMore, Twitter } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import DetailsHero from "@/components/DetailsHero";
import { useParams } from "react-router-dom";
import Spinner from "@/components/SpinnerLoader";
import { supabase } from "@/lib/supabaseClient";
import { getPublicUrl } from "@/lib/storage";
import loremImg from "@/assets/lorem.jfif";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const EventDetails = () => {
  const { lang } = useDirection();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) throw error;
        setEvent(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, user?.id]);

  const handleThumbnail = (el) => {
    if (!el) return loremImg;
    if (typeof el === "string" && el.startsWith("http")) return el;
    if (typeof el === "string") return getPublicUrl("events", el);
    return loremImg;
  };

  const shareOnFacebook = () => {
    const eventUrl = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      eventUrl
    )}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  //share on whatsapp
  const shareOnWhatsApp = () => {
    const eventUrl = window.location.href;
    const eventTitle = lang === "ar" ? event?.name_ar : event?.name;
    const text = `${lang === "ar" ? "تحقق من هذا الحدث" : "Check out this event"
      }: ${eventTitle} - ${eventUrl}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text
    )}`;
    window.open(whatsappShareUrl, "_blank", "width=600,height=400");
  };


  const shareOnTwitter = () => {
    const eventUrl = window.location.href;
    const eventTitle = lang === "ar" ? event?.name_ar : event?.name;
    const text = `${lang === "ar" ? "تحقق من هذا الحدث" : "Check out this event"
      }: ${eventTitle}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(eventUrl)}`;
    window.open(twitterShareUrl, "_blank", "width=600,height=400");
  };

  const copyEventLink = () => {
    // Instagram doesn't support direct web sharing, so we copy the link instead
    const eventUrl = window.location.href;
    navigator.clipboard
      .writeText(eventUrl)
      .then(() => {
        toast.success(
          lang === "ar"
            ? `تم نسخ رابط ${event?.name_ar} إلى الحافظة!`
            : `Link to ${event?.name} copied to clipboard!`
        );
      })
      .catch(() => {
        toast.error(
          lang === "ar"
            ? "فشل نسخ الرابط. جرب مرة أخرى"
            : "Failed to copy link. Please try again"
        );
      });
  };

  if (loading) {
    return (
      <Spinner
        message={lang === "ar" ? "جاري تحميل الحدث..." : "Loading event..."}
      />
    );
  }

  return (
    <main>
      <div className="container">
        {/* hero */}
        <DetailsHero
          lang={lang}
          img={handleThumbnail(event?.thumbnail)}
          title={lang === "ar" ? event.name_ar : event.name || event.name}
        />

        {/* details */}
        <Details lang={lang} details={event} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
                {lang === "en" ? "About the Event" : "حول الحدث"}
              </h3>
              <p className="text-foreground leading-relaxed">
                {lang === "ar" ? event.description_ar : event.description}
              </p>
            </section>
            <Location 
              lang={lang} 
              address={event?.location || "Egypt"}
              latitude={event?.latitude}
              longitude={event?.longitude}
            />
            <WhyAttend lang={lang} eventCategoryId={event.category_id} />
            <HostInfo lang={lang} hostId={event.host_id} />
          </div>

          {/* RIGHT SECTION */}
          <div className="lg:col-span-1 space-y-8">
            {/* Countdown */}
            <EventCountdown
              details={event}
              eventId={event?.id}
              hostId={event?.host_id}
              user={user}
              lang={lang}
            />

            <div className="gradient-card rounded-xl p-6 text-center">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {lang === "en" ? "Share This Event" : "شارك هذا الحدث"}
              </h4>
              <div className="flex justify-center gap-4">
                <button
                  onClick={shareOnFacebook}
                  className="p-3 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform"
                  aria-label="Share on Facebook"
                  title="Share on Facebook"
                >
                  <Facebook />
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="p-3 rounded-full bg-green-600 text-white hover:scale-110 transition-transform"
                  aria-label="Share on WhatsApp"
                  title="Share on WhatsApp"
                >
                  <MessageCircleMore />
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="p-3 rounded-full bg-black text-white hover:scale-110 transition-transform"
                  aria-label="Share on X"
                  title="Share on X"
                >
                  <Twitter />
                </button>
                <button
                  onClick={copyEventLink}
                  className="p-3 rounded-full bg-amber-300/80 text-white hover:scale-110 transition-transform"
                  aria-label="Copy link to clipboard"
                  title="Copy link to clipboard"
                >
                  <Copy />
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
