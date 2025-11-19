import { useState } from "react";
import { useDirection } from "@/hooks/useDirection";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, EffectFade } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import 'swiper/css/effect-fade';

const ServiceGallery = ({ images }) => {
   const [thumbsSwiper, setThumbsSwiper] = useState(null);
   const { lang } = useDirection();
   return (
      <section className="flex flex-col gap-4 py-12 md:py-16">
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Gallery" : "المعرض"}
         </h3>
         <Swiper
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Thumbs, EffectFade]}
            className="mySwiper2 rounded-lg max-w-full"
            effect={'fade'}
            dir="ltr"
         >
            {images.map((image, index) => (
               <SwiperSlide key={index} className="aspect-video">
                  <img
                     src={image}
                     alt={`Image ${index}`}
                     className="w-full h-full object-cover"
                  />
               </SwiperSlide>
            ))}
         </Swiper>
         <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            modules={[Navigation, Thumbs]}
            className="mySwiper w-full"
            breakpoints={{
               768: {
                  slidesPerView: 3,
               },
               1024: {
                  slidesPerView: 5,
               },
            }}
            dir="ltr"
         >
            {images.map((image, index) => (
               <SwiperSlide key={index} className="aspect-video rounded-md overflow-hidden">
                  <img
                     src={image}
                     alt={`Image ${index}`}
                     className="object-cover w-full h-full"
                  />
               </SwiperSlide>
            ))}
         </Swiper>
      </section>
   );
};

export default ServiceGallery;
