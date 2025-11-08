import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { Card, CardContent } from "@/components/ui/card";
import {
   Plus,
   Edit,
   Trash2,
   Eye,
   Calendar,
   MapPin,
   Loader2,
} from "lucide-react";
import i18next from "i18next";
import { supabase } from "@/lib/supabaseClient";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "sonner";

const UserServices = () => {
   const navigate = useNavigate();
   const { data: categories } = useSelector(
      (state) => state.categories
   );
   const lang = i18next.language;
   const user = useSelector((state) => state.auth.user);
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);
   const [services, setServices] = useState([]);

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const handleEdit = (serviceId) => {
      navigate(`/user/create-service?serviceId=${serviceId}`);
   };

   const handleDelete = async (serviceId) => {
      Swal.fire({
         title: lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
         text: lang === "ar" ? "لن تتمكن من التراجع عن هذا!" : "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: lang === "ar" ? "نعم" : "Yes",
         cancelButtonText: lang === "ar" ? "لا" : "No",
      }).then(async (result) => {
         setLoading(true);
         if (result.isConfirmed) {
            const { data, error } = await supabase
               .from("services")
               .delete()
               .eq("id", serviceId);
            if (error) {
               console.error(error);
               toast.error(lang === "ar" ? "حدث خطأ أثناء حذف الخدمة!" : "Error deleting service!");
               return;
            } else {
               console.log("Deleted service:", data);
               toast.success(lang === "ar" ? "تم حذف الخدمة بنجاح!" : "Service deleted successfully!");
            }
         }
         setLoading(false);
      });
   };

   const handleView = (serviceId) => {
      console.log("View service:", serviceId);
      // navigate(`/services/${serviceId}`);
   };

   const getCategoryName = (categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
         return lang === "ar" ? category.name_ar : category.name;
      } else {
         return "Unknown Category";
      }
   };

   // Empty state component
   const EmptyState = () => (
      <div className="flex flex-col items-center justify-center py-16 px-4">
         <div className="rounded-full bg-primary/10 p-6 mb-4">
            <Plus className="h-12 w-12 text-primary" />
         </div>
         <h3 className="text-xl font-semibold mb-2">
            {lang === "ar" ? "لا يوجد خدمات بعد" : "No Services Yet"}
         </h3>
         <p className="text-muted-foreground text-center mb-6 max-w-md">
            {lang === "ar"
               ? "لم تقم بإنشاء أي خدمة بعد. ابدأ بإنشاء خدمتك الأولى لتشاركها مع الآخرين."
               : "You haven't created any services yet. Start by creating your first service to share with others."}
         </p>
         <Link to="/user/create-service">
            <Button variant="amber" size="lg">
               <Plus className="mr-2 h-4 w-4" />
               {lang === "ar" ? "إنشاء خدمة" : "Create Your First Service"}
            </Button>
         </Link>
      </div>
   );

   useEffect(() => {
      const fetchUserServices = async () => {
         const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("client_id", user.id);
         setLoading(false);
         if (error) {
            console.error(error);
            return;
         } else {
            setServices(data);
         }
      };
      fetchUserServices();
   }, [loading, user.id]);

   useEffect(() => {
      if (!categories || categories.length === 0) {
         dispatch(fetchCategories());
      }
   }, [dispatch, categories]);

   return (
      <section className="min-h-screen bg-background p-4 md:p-8">
         <div className="container">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">
                     {lang === "ar" ? "خدماتي" : "My Services"}
                  </h1>
                  <p className="text-muted-foreground">
                     {lang === "ar"
                        ? "إدارة وتتبع جميع خدماتك في مكان واحد"
                        : "Manage and track all your services in one place"}
                  </p>
               </div>
               <Link to="/user/create-service">
                  <Button size="lg" className="mt-4 md:mt-0 bg-gradient-amber">
                     <Plus className="mr-2 h-4 w-4" />
                     {lang === "ar" ? "إنشاء خدمة" : "Create Service"}
                  </Button>
               </Link>
            </div>

            {/* Services Table or Empty State */}
            {services.length === 0 && !loading ? (
               <Card>
                  <CardContent>
                     <EmptyState />
                  </CardContent>
               </Card>
            ) : (
               <Card>
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
                                 {services.map((service) => (
                                    <tr
                                       key={service.id}
                                       className="border-b border-border hover:bg-muted/50 transition-colors"
                                    >
                                       <td className="py-4 px-4">
                                          <div>
                                             <p className="font-medium">
                                                {lang === "ar"
                                                   ? service.name_ar
                                                   : service.name}
                                             </p>
                                          </div>
                                       </td>
                                       <td className="py-4 px-4">
                                          <span className="text-sm">
                                             {getCategoryName(service.category_id)}
                                          </span>
                                       </td>
                                       <td className="py-4 px-4">
                                          <div className="flex items-center gap-1 text-sm">
                                             <Calendar className="h-3 w-3 text-muted-foreground" />
                                             {formatDate(service.date)}
                                          </div>
                                       </td>
                                       <td className="py-4 px-4">
                                          <span className="font-semibold text-sm">
                                             {service.price === 0
                                                ? "Free"
                                                : `$${service.price}`}
                                          </span>
                                       </td>
                                       <td className="py-4 px-4">
                                          <div className="flex items-center justify-end gap-2">
                                             <Link
                                                to={`/services/${service.id}`}
                                             >
                                                <Button
                                                   className="bg-transparent text-foreground hover:bg-foreground/10"
                                                   size="icon-sm"
                                                   onClick={() =>
                                                      handleView(service.id)
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
                                             <Button
                                                className="bg-transparent text-amber-dark hover:bg-amber-dark/10"
                                                size="icon-sm"
                                                onClick={() =>
                                                   handleEdit(service.id)
                                                }
                                                title={
                                                   lang === "ar"
                                                      ? "تعديل"
                                                      : "Edit"
                                                }
                                             >
                                                <Edit className="h-4 w-4" />
                                             </Button>
                                             <Button
                                                size="icon-sm"
                                                onClick={() =>
                                                   handleDelete(service.id)
                                                }
                                                title={
                                                   lang === "ar"
                                                      ? "حذف"
                                                      : "Delete"
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
      </section>
   );
};

export default UserServices;
