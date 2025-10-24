import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, Facebook, Instagram } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


const VendorInfoForm = ({ formData, handleInputChange }) => {
   const { businessName, serviceCategory, businessDescription, facebook, instagram } = formData;
   const serviceCategoryOptions = [
      "Venue & Space",
      "Catering & Food",
      "Photography & Videography",
      "Entertainment (DJ, Band, etc.)",
      "Decoration & Design",
      "Event Planning & Coordination",
      "Audio/Visual Equipment",
      "Transportation",
      "Security",
      "Other Services",
   ];
   return (
      <>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 ">
               <Label htmlFor="businessName">Business/Company Name *</Label>
               <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="businessName"
                     placeholder="Your Business Name"
                     value={businessName ? businessName : ""}
                     onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                     }
                     className="pl-10"
                     required
                  />
               </div>
            </div>

            <div className="space-y-2 ">
               <Label htmlFor="serviceCategory">Category *</Label>
               <div className="relative">
                  {/* <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" /> */}
                  <Select
                     value={serviceCategory ? serviceCategory : "Select a category"}
                     onValueChange={(value) =>
                        handleInputChange("serviceCategory", value)
                     }
                     required
                  >
                     <SelectTrigger
                        id="serviceCategory"
                        className="w-full pl-10 h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                     >
                        {serviceCategory ? serviceCategory : "Select a category"}
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Select a category">
                           Select a category
                        </SelectItem>
                        {serviceCategoryOptions.map((cat) => (
                           <SelectItem key={cat} value={cat}>
                              {cat}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-2 md:col-span-2">
               <Label htmlFor="businessDescription">
                  Business Description *
               </Label>
               <Textarea
                  id="businessDescription"
                  placeholder="Describe your services, expertise, and what makes your business unique..."
                  value={businessDescription ? businessDescription : ""}
                  onChange={(e) =>
                     handleInputChange("businessDescription", e.target.value)
                  }
                  rows={4}
                  required
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="facebook">
                  <Facebook size={15} /> Facebook URL
               </Label>
               <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={facebook ? facebook : ""}
                  onChange={(e) =>
                     handleInputChange("facebook", e.target.value)
                  }
               />
            </div>
            <div className="space-y-2 ">
               <Label htmlFor="instagram">
                  <Instagram size={15} /> Instagram URL
               </Label>
               <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/yourprofile"
                  value={instagram ? instagram : ""}
                  onChange={(e) =>
                     handleInputChange("instagram", e.target.value)
                  }
               />
            </div>
         </div>
      </>
   );
};

export default VendorInfoForm;
