import React from "react";
import DetailsHero from "@/components/DetailsHero";
import { useDirection } from "@/hooks/useDirection";
import ProviderCard from "@/components/services/ProviderCard";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceReviews from "@/components/services/ServiceReviews";

const service = {
   id: 1,
   // Demo data for testing purposes - Photo & Video Session Service
   img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
   title: {
      ar: "خدمة جلسات التصوير والفيديو",
      en: "Photo & Video Sessions Service",
   },
   description: {
      ar: `احصل على أفضل جلسات التصوير الفوتوغرافي والفيديو بمعدات احترافية وفريق مميز يوثق أجمل لحظاتك. 
استمتع بتجربة فريدة في أماكن متنوعة، سواء داخل الاستوديو أو في الهواء الطلق، مع فن الإضاءة والديكور لإخراج صورك بأجمل شكل. 
نضمن لك جودة عالية في الصور والفيديو مع معالجة احترافية وتقديم ألبومات مطبوعة أو نسخ رقمية حسب الرغبة. 
نوفر أيضًا خدمة التصوير للحفلات والمناسبات والتخرج وغيرها، لتظل ذكرياتك محفوظة بأعلى جودة من الإبداع والاهتمام بالتفاصيل.`,
      en: `Experience top-quality photo and video sessions with professional equipment and a talented team to capture your best moments.
Enjoy a unique experience at various locations, whether in the studio or outdoors, with artistic lighting and setups to present your images in the best way.
We guarantee you high-resolution photos and videos with professional editing, offering printed albums or digital copies as you prefer.
We also provide photography for parties, events, graduations, and more—so your memories are preserved with the highest standards of creativity and attention to detail.`,
   },
   provider_data: {
      id: 1,
      name: "ريم عبد الرحمن",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      bio: "مصورة محترفة بخبرة أكثر من 8 سنوات في جلسات التصوير الشخصية والعائلية وحفلات الزفاف.",
      rating: 4.9,
   },
   reviews_list: [
      {
         rating: 5,
         comment:
            "The photos were stunning and the team made us feel comfortable throughout the session. We received a large number of edited shots, all beautifully lit and captured. The attention to detail was impressive, and the photographers listened to our preferences. We loved the mix of candid and posed images. Highly recommended for anyone seeking a professional and fun experience!",
         user: "Layla Al-Farsi",
         date: "2024-02-14",
      },
      {
         rating: 4,
         comment:
            "عمل احترافي وتسليم سريع. أنصح بها بشدة للفعاليات التي لا تُنسى. الفريق كان على درجة عالية من المهنية وساعدنا في اختيار أفضل المواقع لالتقاط الصور. جودة الصور والفيديو كانت رائعة، وأعجبني التزامهم بالمواعيد وتعاونهم الدائم معنا طوال الحدث. سأستعين بخدماتهم مرة أخرى بلا تردد!",
         user: "عمر سليم",
         date: "2024-01-08",
      },
      {
         rating: 5,
         comment:
            "Amazing video quality, and the photographer had great creative ideas! They even brought props and helped us feel at ease during the shoot. The final album exceeded our expectations, with both digital and printed copies provided. Everyone commented on how artistic the shots were—couldn't have asked for a better service!",
         user: "Jessica King",
         date: "2024-03-05",
      },
      {
         rating: 4,
         comment:
            "Lovely experience! The team was punctual and very creative with the compositions. Communication before and during the shoot was excellent, making the process smooth and enjoyable. Our family portraits look amazing and were delivered quicker than expected. Will recommend to friends!",
         user: "Mohammed Badr",
         date: "2024-03-28",
      },
   ],
   gallery: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80",
   ],
};
const ServiceDetails = () => {
   const { lang } = useDirection();
   return (
      <main className="container">
         <DetailsHero lang={lang} img={service.img} title={service.title} />
         <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-8">
            <div className="md:col-span-2">
               <ProviderCard provider={service.provider_data} />
            </div>
            <div className="md:col-span-4">
               <section className="py-8 md:py-12">
                  <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
                     {lang === "en" ? "About the Service" : "حول الخدمة"}
                  </h3>
                  <p className="text-foreground leading-8 text-lg">
                     {service.description[lang]}
                  </p>
               </section>
               <ServiceGallery images={service.gallery} />
               <ServiceReviews reviews={service.reviews_list} />
            </div>
         </div>
      </main>
   );
};

export default ServiceDetails;
