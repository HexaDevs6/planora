import React from "react";

const Speakers = () => {
   return (
      <section>
         <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Speakers
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4">
                  <div
                     className="w-full h-full rounded-full bg-cover bg-center shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                     style={{
                        backgroundImage:
                           'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCF2ekbrDj0oEXxNSPQNdemBFP9GWyjyevQBNrC7IuFec8lu0GrV5pckZHmKN8Svxn2xORi76aWJE_OCEHUm5SbO9dHPJr8rUs7Zr8_xoC9XmAwM3jC2c4CaCSiuqJBajzI3jZJEEBfuRK9JC6aHKbu-Si_4iTI836XfJWkuNFxXE5a0C9lsgc2oUx4gzSIQ8c58-qY53FxYCQzLxLwpS709xo3Odl4Vwp7bBKZ4tBGjHtJOE7BXIcD2uoHRamDdBR_6v5U_UJ88IIQ")',
                     }}
                  ></div>
               </div>
               <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  Dr. Alex Turner
               </h4>
               <p className="text-sm text-primary/80 dark:text-primary/70">
                  CEO, Innovate Solutions
               </p>
            </div>
            <div className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4">
                  <div
                     className="w-full h-full rounded-full bg-cover bg-center shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                     style={{
                        backgroundImage:
                           'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPukS15fqsE9hBhu0T0ucvqpJcDqQcWjWlxDmgRM9MzpJQUP4YLlrhSBl5qJ_vPX1mxWcVEoVbSK_12FRYcBjzjlO4F8aynf0vc-7gKyAv5sk5XDN6ByU4DdpXkXSvLUtqFBs5hkTH0bOTFn_s4r6otkegYFflfvgZx8_0iaTMyzVHszpIKNqqAeXrx61TMWTL3W3GmNdG_787xsEOZ_GymERVJs7cB6v1FUtbvomi5KvdgAFN3ijUUA2qRZU5QfXZxEz_eS0RIJnR")',
                     }}
                  ></div>
               </div>
               <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  Sarah Chen
               </h4>
               <p className="text-sm text-primary/80 dark:text-primary/70">
                  CTO, FutureTech Inc.
               </p>
            </div>
            <div className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4">
                  <div
                     className="w-full h-full rounded-full bg-cover bg-center shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                     style={{
                        backgroundImage:
                           'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEwBpAqgBdLQRtVK4DqYGv7moYlgHYusXMYK_1EZ4YBGSbIUZk15OcN8h93GFfyz7tUqQ4y_dIhmIAZvyZpfOnI90bzAoYnAI_S2iNAoLtUxKQqqpuZ02lQKidB4HuqecDBiu8iWfnZ_3gnRpaozt4s92Zj_CQ1KOpgLAhWF9hOzp3vQ5TL4J_-8VuxobAmO-RtOJW4guYViy11P2o1A6IkjOsJlG4fsZbXs-eKMLwoR7AA0p19l7bTH_erN4R9X_ovbZDJMEH6Cgd")',
                     }}
                  ></div>
               </div>
               <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  Mark Johnson
               </h4>
               <p className="text-sm text-primary/80 dark:text-primary/70">
                  Lead Engineer, NextGen Systems
               </p>
            </div>
         </div>
      </section>
   );
};

export default Speakers;
