import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Plus, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useDirection } from "@/hooks/useDirection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { deleteFile } from "@/lib/storage";

const EventsTable = () => {
   const { data: categories } = useSelector((state) => state.categories);
   const { lang } = useDirection();
   const dispatch = useDispatch();
   const [events, setEvents] = useState([]);
   const user = useSelector((state) => state.auth.user);
   const [loading, setLoading] = useState(true);
   const [loadingDelete, setLoadingDelete] = useState(false);

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const handleDelete = async (eventId) => {
      Swal.fire({
         title: lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
         text:
            lang === "ar"
               ? "سيتم حذف الحدث وجميع الصور المرتبطة به!"
               : "This event and all its images will be deleted!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: lang === "ar" ? "نعم" : "Yes",
         cancelButtonText: lang === "ar" ? "لا" : "No",
      }).then(async (result) => {
         if (!result.isConfirmed) return;
         setLoadingDelete(true);

         try {
            // 1️⃣ Fetch event data (thumbnail + images)
            const { data: eventData, error: fetchError } = await supabase
               .from("events")
               .select("thumbnail, images")
               .eq("id", eventId)
               .single();

            if (fetchError) throw fetchError;

            // 2️⃣ Collect all image paths
            const allPaths = [];
            console.log(eventData);

            if (eventData?.thumbnail) {
               allPaths.push(eventData.thumbnail);
            }

            if (Array.isArray(eventData?.images)) {
               eventData.images.forEach((img) => {
                  if (img.path) allPaths.push(img.path);
               });
            }

            // 3️⃣ Delete from Supabase Storage
            if (allPaths.length > 0) {
               await deleteFile("events", allPaths);
            }

            // 4️⃣ Delete event record from database
            const { error: deleteError } = await supabase
               .from("events")
               .delete()
               .eq("id", eventId);

            if (deleteError) throw deleteError;

            // 5️⃣ Show success message
            toast.success(
               lang === "ar"
                  ? "تم حذف الحدث وجميع الصور الخاصة به بنجاح!"
                  : "Event and its images deleted successfully!"
            );

            // 6️⃣ Refresh UI
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
         } catch (error) {
            console.error("Delete Event Error:", error.message);
            toast.error(
               lang === "ar"
                  ? `حدث خطأ أثناء حذف الحدث: ${error.message}`
                  : `Error deleting event: ${error.message}`
            );
         } finally {
            setLoadingDelete(false);
         }
      });
   };

   const getCategoryName = (categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
         return lang === "ar" ? category.name_ar : category.name;
      } else {
         return "Unknown Category";
      }
   };

   useEffect(() => {
      const fetchUserEvents = async () => {
         const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("host_id", user.id);
         setLoading(false);
         if (error) {
            console.error(error);
            return;
         } else {
            setEvents(data);
         }
      };
      fetchUserEvents();
   }, [loadingDelete]);

   useEffect(() => {
      if (!categories || categories.length === 0) {
         dispatch(fetchCategories());
      }
   }, [dispatch, categories]);

   // Empty state component
   const EmptyState = () => (
      <div className="flex flex-col items-center justify-center py-16 px-4">
         <div className="rounded-full bg-primary/10 p-6 mb-4">
            <Plus className="h-12 w-12 text-primary" />
         </div>
         <h3 className="text-xl font-semibold mb-2">
            {lang === "ar" ? "لا يوجد فعاليات بعد" : "No Events Yet"}
         </h3>
         <p className="text-muted-foreground text-center mb-6 max-w-md">
            {lang === "ar"
               ? "لم تقم بإنشاء أي فعالية بعد. ابدأ بإنشاء فعاليتك الأولى لتشاركها مع الآخرين."
               : "You haven't created any events yet. Start by creating your first event to share with others."}
         </p>
         <Link to="/host/create-event">
            <Button variant="amber" size="lg">
               <Plus className="mr-2 h-4 w-4" />
               {lang === "ar" ? "إنشاء فعالية" : "Create Your First Event"}
            </Button>
         </Link>
      </div>
   );

   return (
      <div className="space-y-5 container">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold text-primary mb-2">
                  {lang === "ar" ? "الفعاليات" : "Events"}
               </h1>
               <p className="text-muted-foreground">
                  {lang === "ar"
                     ? "إدارة وتتبع جميع الفعاليات في مكان واحد"
                     : "Manage and track all your events in one place"}
               </p>
            </div>
            <Link to="/host/create-event">
               <Button size="lg" className="mt-4 md:mt-0 bg-gradient-amber">
                  <Plus className="mr-2 h-4 w-4" />
                  {lang === "ar" ? "إنشاء فعالية" : "Create Event"}
               </Button>
            </Link>
         </div>

         {/* Table */}
         {events.length === 0 && !loading && !loadingDelete ? (
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
                                    {lang === "ar" ? "العنوان" : "Title"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "الفئة" : "Category"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "التاريخ" : "Date"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "السعر" : "Price"}
                                 </th>
                                 <th className="text-start py-3 px-4 font-semibold text-sm">
                                    {lang === "ar" ? "الإجراءات" : "Actions"}
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {events.map((event) => (
                                 <tr
                                    key={event.id}
                                    className="border-b border-border hover:bg-muted/50 transition-colors"
                                 >
                                    <td className="py-4 px-4">
                                       <div>
                                          <Link
                                             className="font-medium"
                                             to={{
                                                pathname: "/host/attendees",
                                                search: `?id=${
                                                   event.id
                                                }&title=${
                                                   lang === "ar"
                                                      ? event.name_ar
                                                      : event.name
                                                }&date=${event.date}&location=${
                                                   event.location
                                                }`,
                                             }}
                                          >
                                             {lang === "ar"
                                                ? event.name_ar
                                                : event.name}
                                          </Link>
                                       </div>
                                    </td>
                                    <td className="py-4 px-4">
                                       <span className="text-sm">
                                          {getCategoryName(event.category_id)}
                                       </span>
                                    </td>
                                    <td className="py-4 px-4">
                                       <div className="flex items-center gap-1 text-sm text-nowrap">
                                          <Calendar className="h-3 w-3 text-muted-foreground" />
                                          {formatDate(event.date)}
                                       </div>
                                    </td>
                                    <td className="py-4 px-4">
                                       <span className="font-semibold text-sm">
                                          {event.price === 0
                                             ? "Free"
                                             : `$${event.price}`}
                                       </span>
                                    </td>
                                    <td className="py-4 px-4">
                                       <div className="flex items-center justify-end gap-2">
                                          <Link to={`/events/${event.id}`}>
                                             <Button
                                                className="bg-transparent text-foreground hover:bg-foreground/10"
                                                size="icon-sm"
                                                onClick={() =>
                                                   handleView(event.id)
                                                }
                                                title={
                                                   lang === "ar"
                                                      ? "عرض"
                                                      : "View"
                                                }
                                             >
                                                <Eye className="h-4 w-4" />
                                             </Button>
                                          </Link>
                                          <Link
                                             to={`/host/create-event?eventId=${event.id}`}
                                          >
                                             <Button
                                                className="bg-transparent text-amber-dark hover:bg-amber-dark/10"
                                                size="icon-sm"
                                                title={
                                                   lang === "ar"
                                                      ? "تعديل"
                                                      : "Edit"
                                                }
                                             >
                                                <Edit className="h-4 w-4" />
                                             </Button>
                                          </Link>
                                          <Button
                                             size="icon-sm"
                                             onClick={() =>
                                                handleDelete(event.id)
                                             }
                                             title={
                                                lang === "ar" ? "حذف" : "Delete"
                                             }
                                             className="text-destructive bg-transparent hover:bg-destructive/10"
                                          >
                                             <Trash2 className="h-4 w-4" />
                                          </Button>
                                       </div>
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

export default EventsTable;
