import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

/**
 * MapViewer
 * 
 * Read-only interactive map for displaying event location.
 * If coordinates are provided, displays them directly.
 * If only address is provided, geocodes it once on mount.
 */
const MapViewer = ({ location, latitude, longitude, lang = "en" }) => {
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      // If we have coordinates, use them directly
      if (latitude && longitude) {
        setCenter([latitude, longitude]);
        setLoading(false);
        return;
      }

      // Otherwise, try to geocode the location string
      if (location && location.trim() !== "") {
        try {
          const provider = new OpenStreetMapProvider();
          const results = await provider.search({ query: location });
          
          if (results && results.length > 0) {
            const { y, x } = results[0];
            setCenter([y, x]);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setError(true);
        }
      } else {
        setError(true);
      }
      
      setLoading(false);
    };

    initializeMap();
  }, [location, latitude, longitude]);

  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden shadow-md h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {lang === "en" ? "Loading map..." : "جاري تحميل الخريطة..."}
        </p>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="rounded-xl overflow-hidden shadow-md h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {location || (lang === "en" ? "Location not available" : "الموقع غير متاح")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md h-64">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{location || `${center[0].toFixed(4)}, ${center[1].toFixed(4)}`}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapViewer;

