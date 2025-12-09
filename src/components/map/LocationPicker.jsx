import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";

/**
 * MapController
 * Helper component to control map view programmatically
 */
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  
  return null;
};

/**
 * ClickableMap
 * Helper component to handle map click events
 */
const ClickableMap = ({ onLocationClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationClick(lat, lng);
    },
  });
  
  return null;
};

/**
 * LocationPicker
 * 
 * Interactive map component for selecting event location.
 * Features:
 * - Search places using Nominatim
 * - Click on map to place marker
 * - Draggable marker
 */
const LocationPicker = ({ value, onChange, lang = "en" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Default center (Cairo, Egypt)
  const defaultCenter = [30.0444, 31.2357];
  
  const [mapCenter, setMapCenter] = useState(
    value?.latitude && value?.longitude
      ? [value.latitude, value.longitude]
      : defaultCenter
  );
  
  const [markerPosition, setMarkerPosition] = useState(
    value?.latitude && value?.longitude
      ? [value.latitude, value.longitude]
      : null
  );

  // Initialize search provider
  const provider = new OpenStreetMapProvider();

  // Debounced search effect - triggers on user type
  useEffect(() => {
    // If search query is empty, clear results
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Set searching state
    setSearching(true);
    setShowResults(true);

    // Debounce delay (500ms)
    const debounceTimer = setTimeout(async () => {
      try {
        const results = await provider.search({ query: searchQuery });
        setSearchResults(results.slice(0, 5)); // Limit to 5 results
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    // Cleanup function - cancel previous search if user types again
    return () => {
      clearTimeout(debounceTimer);
      setSearching(false);
    };
  }, [searchQuery]);

  // Handle search result selection
  const handleSelectResult = (result) => {
    const { y: lat, x: lng, label } = result;
    
    setMapCenter([lat, lng]);
    setMarkerPosition([lat, lng]);
    setShowResults(false);
    setSearchQuery("");
    
    // Update parent component
    onChange({
      location: label,
      latitude: lat,
      longitude: lng,
    });
  };

  // Handle map click
  const handleMapClick = useCallback((lat, lng) => {
    setMarkerPosition([lat, lng]);
    
    // Update parent with coordinates and simple label
    onChange({
      location: value?.location || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      latitude: lat,
      longitude: lng,
    });
  }, [value?.location, onChange]);

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "ابحث عن مكان..."
                  : "Search for a place..."
              }
              className="bg-background shadow-none pr-10"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!searching && searchQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute z-[99999] w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searching && (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  {lang === "ar" ? "جاري البحث..." : "Searching..."}
                </div>
              )}
              
              {!searching && searchResults.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                </div>
              )}
              
              {!searching && searchResults.length > 0 && (
                <div>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className="w-full text-left p-3 hover:bg-accent/10 transition-colors border-b border-border last:border-0 flex items-start gap-2"
                    >
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                      <span className="text-sm">{result.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Current Location Display */}
      {value?.location && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{value.location}</span>
        </div>
      )}

      {/* Map */}
      <div className="rounded-xl overflow-hidden shadow-md h-80 border border-border">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} zoom={13} />
          <ClickableMap onLocationClick={handleMapClick} />
          
          {markerPosition && (
            <Marker position={markerPosition} draggable={true} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;

