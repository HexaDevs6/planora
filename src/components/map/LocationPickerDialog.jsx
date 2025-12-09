import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LocationPicker from "./LocationPicker";

/**
 * LocationPickerDialog
 * 
 * Wraps LocationPicker in a dialog/modal for a cleaner UI experience.
 * Shows a button that opens a dialog with the full map picker interface.
 */
const LocationPickerDialog = ({ value, onChange, lang = "en" }) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleOpen = () => {
    setTempValue(value);
    setOpen(true);
  };

  const handleSave = () => {
    onChange(tempValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Current Location Display */}
      {value?.location && (
        <div className="p-3 bg-accent/50 rounded-lg border border-border flex items-start gap-2">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">{value.location}</p>
            {value.latitude && value.longitude && (
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar" ? "الإحداثيات" : "Coordinates"}: {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Dialog Trigger Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleOpen}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {value?.location 
              ? (lang === "ar" ? "تغيير الموقع" : "Change Location")
              : (lang === "ar" ? "اختيار موقع" : "Pick Location")
            }
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogDescription>
              {lang === "ar"
                ? "ابحث عن مكان أو انقر على الخريطة لتحديد الموقع الدقيق لحدثك"
                : "Search for a place or click on the map to set the exact location for your event"}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <LocationPicker
              value={tempValue}
              onChange={setTempValue}
              lang={lang}
            />
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="button"
              variant="amber"
              onClick={handleSave}
              disabled={!tempValue?.location}
            >
              {lang === "ar" ? "حفظ الموقع" : "Save Location"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationPickerDialog;

