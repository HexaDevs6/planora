import React, { useEffect, useState } from "react";
import { getWhyAttendData } from "./whyAttendData";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/fetchCategoriesThunk";

const WhyAttend = ({lang = "en", eventCategoryId}) => {
   const dispatch = useDispatch();
   const { data } = useSelector((state) => state.categories);
   const [eventCategory, setEventCategory] = useState(null);

   const categories = data.filter((category) => category.type === "event")
   

   
   
   useEffect(() => {
      if (!data.length) dispatch(fetchCategories());
      const category = categories.find((category) => category.id === eventCategoryId);
      setEventCategory(category);
   }, [dispatch, data.length]);

   
   const whyAttendItems = getWhyAttendData(eventCategory?.name);
   return (
      <section className="gradient-card rounded-xl p-6 shadow-sm">
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Why Attend?" : "لماذا الحضور؟"}
         </h3>
         <ul className="list-none space-y-3 text-gray-700 dark:text-gray-300">
            {eventCategory && whyAttendItems.map((item, index) => {
               const IconComponent = item.icon;
               return (
                  <li key={index} className="flex items-start gap-3">
                     <IconComponent className="flex-shrink-0 mt-1" />
                     <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                           {item.title[lang]}
                        </p>
                        <p className="text-sm">
                           {item.description[lang]}
                        </p>
                     </div>
                  </li>
               );
            })}
         </ul>
      </section>
   );
};

export default WhyAttend;
