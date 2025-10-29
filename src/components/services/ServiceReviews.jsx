import React from "react";
import { useDirection } from "@/hooks/useDirection";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceReviews = ({ reviews }) => {
   const { lang } = useDirection();
   const getStars = (rating) => {
      return Array.from({ length: rating }, (_, index) => (
         <Star key={index} className="w-4 h-4 text-amber" fill="currentColor" />
      ));
   };
   return (
      <section className="py-8 md:py-12">
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Reviews" : "التعليقات"}
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
               <div
                  key={review.id}
                  className="gradient-card rounded-lg p-4 flex flex-col gap-4"
               >
                  <div className="flex gap-4 items-center">
                     <div className="flex items-center gap-2">
                        {getStars(review.rating)}
                     </div>
                     <Link to={`/user/${review.user.id}`} className="hover:underline">
                     <h4 className="text-primary dark:text-white font-semibold">{review.user}</h4>
                     </Link>
                  </div>
                  <p className="text-sm text-foreground">{review.comment}</p>
                  <span className="text-sm text-muted-foreground mt-auto">{review.date}</span>
               </div>
            ))}
         </div>
         <button className="w-full mt-4 text-amber hover:text-amber/80 transition-colors">
            {lang === "en" ? "Load more reviews" : "عرض المزيد من التعليقات"}
         </button>
      </section>
   );
};

export default ServiceReviews;
