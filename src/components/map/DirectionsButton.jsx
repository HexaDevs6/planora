import React from "react";
import { Navigation } from "lucide-react";

/**
 * DirectionsButton
 * 
 * Generates a Google Maps directions link using latitude and longitude.
 * Falls back to address-based search if coordinates are unavailable.
 */
const DirectionsButton = ({ latitude, longitude, label, lang = "en" }) => {
  if (!latitude || !longitude) {
    // Fallback: use address-based Google Maps link
    if (label) {
      const encodedAddress = encodeURIComponent(label);
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      return (
        <a
          className="text-primary font-medium text-sm mt-2 inline-flex items-center gap-1 hover:underline"
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation className="w-4 h-4" />
          {lang === "en" ? "Get Directions" : "الحصول على الاتجاهات"} →
        </a>
      );
    }
    return null; // No coordinates and no label, hide button
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <a
      className="text-primary font-medium text-sm mt-2 inline-flex items-center gap-1 hover:underline"
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Navigation className="w-4 h-4" />
      {lang === "en" ? "Get Directions" : "الحصول على الاتجاهات"} →
    </a>
  );
};

export default DirectionsButton;

