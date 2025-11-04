import React from "react";

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-30 h-30 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <img
        src="/favPlanora.svg"
        alt="Planora Logo"
        className="w-30 h-20 animate-bounce mb-7 absolute"
      />
      <h6 className="text-primary text-lg p-4">Getting things ready...</h6>
    </div>
  );
}