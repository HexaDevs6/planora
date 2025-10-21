import React from "react";

const EventHero = () => {
   return (
      <div className="hero mt-28">
         <div
            className="relative rounded-xl overflow-hidden shadow-lg mb-8 h-80 bg-cover bg-center"
            style={{
               backgroundImage:
                  'linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgIdMZkIMjsRrGt2_DzP7OaUH5mcDz8qQJwCLZz3nEw9H0lshZailMnzXvtD10Fbf7b-6Nh7hN-08H4sAOsAvb9sSPufij6WvNnCy4b7zIhNLhyIDsaTybcAqTx6IvlrxgcDpSZxfoO_nOP12l47XbOWbJoBmqX5Lq8qpMcKZkLAhLSRP8hNmFDELr7115AiJSF0nWiClPD-U4r8YWhQEqjRdwwCRjCNpYnDkYDEDdOjd0B3YydOW3ekfGY9SG0YEG3UUV3zAeH-ob")',
            }}
         >
            <div className="absolute bottom-0 left-0 p-8 text-white">
               <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  Tech Innovators Summit
               </h2>
            </div>
         </div>
      </div>
   );
};

export default EventHero;
