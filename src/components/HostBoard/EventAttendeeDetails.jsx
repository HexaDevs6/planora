import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Plus, Calendar, Loader2, Camera, Users, Check, X, XCircle, Circle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useDirection } from "@/hooks/useDirection";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import HostScanner from "./HostScanner";


const EventAttendeeDetails = () => {
   const { data: categories } = useSelector((state) => state.categories);
   const { lang } = useDirection();
   const dispatch = useDispatch();
   const [attendees, setAttendees] = useState([]);
   const user = useSelector((state) => state.auth.user);
   const [loading, setLoading] = useState(true);
   const [loadingDelete, setLoadingDelete] = useState(false);


   const [searchParams] = useSearchParams();

  const eventId = searchParams.get("id");
  const eventTitle = searchParams.get("title");
    const eventDate = searchParams.get("date");
    const eventLocation = searchParams.get("location");

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };



async function loadAttendees(eventId) {
  const { data, error } = await supabase.rpc("get_event_attendees", {
    event_id: eventId,
  });

  if (error) {
    console.error("Failed to load attendees:", error);
    return [];
  }

  return data;
}

   useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await loadAttendees(eventId);
      setAttendees(result);
      setLoading(false);
    }

    fetchData();
  }, [eventId]);
    

   const EmptyState = () => (
         <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
               <Users className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
               {lang === "ar" ? "لا يوجد حجوزات بعد" : "No reservations yet"}
            </h3>
         </div>
      );

   return (
      <div className="space-y-5 container">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold text-primary mb-2">
                   {eventTitle} {lang === "ar" ? " تفاصيل الحضور" : " Attendees Details"}
               </h1>
               <p className="text-muted-foreground">
                 {eventDate.split("T")[0]} | {eventLocation}
               </p>
            </div>
            
   <HostScanner eventId={eventId} />


            
         </div>

         {/* Table */}
         {attendees.length === 0 && !loading && !loadingDelete ? (
            <Card>
               <CardContent>
                  <EmptyState />
               </CardContent>
            </Card>
         ) : (
            <Card className="bg-background border rounded-xl overflow-hidden">
               <CardContent className={"p-0"}>
                  {loading ? (
                     <div className="flex-center py-16 px-4 min-h-[300px]">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                     </div>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead className="bg-muted">
                              <tr className="border-b border-border">
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "الاسم" : "Name"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "البريد الألكتروني" : "Email"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "التاريخ" : "Date"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "السعر" : "Ticket Status"}
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {attendees.map((attendee) => (
                                 <tr
                                    key={attendee.ticket_id}
                                    className="border-b border-border hover:bg-muted/50 transition-colors"
                                 >
                                    <td className="py-4 px-4">
                                       <div>
                                          <p className="font-medium">
                                                 {attendee.full_name}
                                          </p>
                                       </div>
                                    </td>
                                    <td className="py-4 px-4">
                                       <span className="text-sm">
                                          {attendee.email}
                                       </span>
                                    </td>
                                    <td className="py-4 px-4">
                                       <div className="flex items-center gap-1 text-sm text-nowrap">
                                          <Calendar className="h-3 w-3 text-muted-foreground" />
                                          {attendee.purchased_at.split("T")[0]}
                                       </div>
                                    </td>
                             <td className="py-4 px-4">
  <span className="font-semibold text-sm">
    {attendee.status === "valid" && (
      <span className="text-amber-600 flex items-center gap-1">
        <Circle className="h-4 w-4" />
        {lang === "ar" ? "حضور" : "Valid"}
      </span>
    )}

    {attendee.status === "used" && (
      <span className="text-emerald-600 flex items-center gap-1">
        <Check className="h-4 w-4" />
        {lang === "ar" ? "غير حضور" : "Used"}
      </span>
    )}

    {attendee.status === "cancelled" && (
      <span className="text-red-600 flex items-center gap-1">
        <X className="h-4 w-4" />
        {lang === "ar" ? "ملغية" : "Cancelled"}
      </span>
    )}
  </span>
</td>

                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </CardContent>
            </Card>
         )}
      </div>
   );
};

export default EventAttendeeDetails;
