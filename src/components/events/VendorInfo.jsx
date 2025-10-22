import React from "react";

const VendorInfo = ({lang = "en"}) => {
   return (
      <section>
         <h3 className="text-2xl font-bold mb-6 text-gradient-amber">
            {lang === "en" ? "Vendor Info" : "معلومات البائع"}
         </h3>
         <div className="">
            {lang === "en" ? "vender infor would be here !" : "معلومات البائع ستكون هنا!"}
         </div>
      </section>
   );
};

export default VendorInfo;
