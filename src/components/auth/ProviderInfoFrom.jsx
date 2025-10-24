import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ProviderInfoFrom = ({ formData, handleInputChange }) => {
   return (
      <>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="name">Name</Label>
               <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="name"
                     name="name"
                     placeholder="Your Name"
                     value={formData.name}
                     onChange={(e) =>
                        handleInputChange("name", e.target.value)
                     }
                     className="h-10 shadow-none"
                     required
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="service">Service You Offer *</Label>
               <Select
                  value={formData.service}
                  onValueChange={(value) => handleInputChange("service", value)}
                  required
               >
                  <SelectTrigger className="w-full h-10">
                     <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="photography">Photography</SelectItem>
                     <SelectItem value="catering">Catering</SelectItem>
                     <SelectItem value="dj">DJ / Music</SelectItem>
                     <SelectItem value="planning">Event Planning</SelectItem>
                     <SelectItem value="design">Decoration & Design</SelectItem>
                     <SelectItem value="security">Security</SelectItem>
                     <SelectItem value="transport">Transportation</SelectItem>
                     <SelectItem value="venue">Venue Management</SelectItem>
                     <SelectItem value="av">Audio/Visual Equipment</SelectItem>
                     <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
               <Label htmlFor="bio">
                  Bio *
               </Label>
               <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your background, experience, and what you’re passionate about..."
                  value={formData.bio}
                  onChange={(e) =>
                     handleInputChange("bio", e.target.value)
                  }
                  rows={5}
                  required
               />
            </div>
         </div>
      </>
   );
};

export default ProviderInfoFrom;
