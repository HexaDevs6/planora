import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useDirection } from "@/hooks/useDirection";
import DragZone from "@/components/services/DragZone";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { uploadFile, deleteFile } from "@/lib/storage";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EventSchema } from "@/validators/eventSchemas"; // فوق



export default function PublishEvent() {
   const [searchParams] = useSearchParams();
   const eventId = searchParams.get("eventId");
   const dispatch = useDispatch();
   const { lang } = useDirection();
   const { t } = useTranslation();
   const navigate = useNavigate();
   const [errors, setErrors] = useState({});

   const user = useSelector((state) => state.auth.user);
   const { data: categories, loading: categoriesLoading } = useSelector(
      (state) => state.categories
   );

   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      name_ar: "",
      slug: "",
      description: "",
      description_ar: "",
      location: "",
      date: "",
      end_date: "",
      category: "",
      capacity: "",
      price: "",
      status: "upcoming",
      thumbnail: null,
      images: [],
   });

   const [originalData, setOriginalData] = useState(null);

   useEffect(() => {
      if (eventId) {
         setLoading(true);
         const fetchService = async () => {
            const { data, error } = await supabase
               .from("events")
               .select("*")
               .eq("id", eventId);
            if (error) {
               console.error(error);
               return;
            } else {
               console.log(data);
               const event = data[0];
               const eventData = {
                  name: event.name,
                  name_ar: event.name_ar,
                  slug: event.slug,
                  description: event.description,
                  description_ar: event.description_ar,
                  category: event.category_id,
                  price: event.price,
                  thumbnail: event.thumbnail,
                  images: event.images,
                  location: event.location,
                  date: event.date,
                  end_date: event.end_date,
                  capacity: event.capacity,
                  status: event.status,
               };
               setFormData(eventData);
               setOriginalData(eventData);
               setLoading(false);
            }
         };
         fetchService();
      }
   }, [eventId]);

   const handleCancel = () => {
      Swal.fire({
         title: lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
         text:
            lang === "ar"
               ? "لن تتمكن من التراجع عن هذا!"
               : "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: lang === "ar" ? "نعم" : "Yes",
         cancelButtonText: lang === "ar" ? "لا" : "No",
      }).then((result) => {
         if (result.isConfirmed) {
            clearFormData();
            navigate("/host/events");
         }
      });
   };

   // ✅ جلب التصنيفات من Supabase مرة واحدة
   useEffect(() => {
      if (!categories || categories.length === 0) {
         dispatch(fetchCategories());
      }
   }, [dispatch, categories]);

   // ✅ تجهيز التصنيفات للعرض
   const CategoryOptions =
      categories
         ?.filter((category) => category.type === "event")
         ?.map((category) => ({
            ...category,
            displayName: lang === "ar" ? category.name_ar : category.name,
         })) || [];

   // ✅ التعامل مع إدخال المستخدم
   const handleChange = (e) => {
      const { id, value, type, files, checked } = e.target;
      setFormData({
         ...formData,
         [id]:
            type === "file"
               ? e.target.multiple
                  ? Array.from(files)
                  : files[0]
               : type === "checkbox"
                  ? checked
                  : value,
      });
   };

   const clearFormData = () => {
      setFormData({
         name: "",
         name_ar: "",
         slug: "",
         description: "",
         description_ar: "",
         category: "",
         price: "",
         capacity: "",
         location: "",
         date: "",
         end_date: "",
         thumbnail: null,
         images: [],
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         /** -----------------------------
          * 0. Validate before submit using Zod
          * ----------------------------- */
         const parsed = EventSchema.safeParse(formData);

         if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);

            const firstKey = Object.keys(parsed.error.flatten().fieldErrors)[0];
            const el = document.getElementById(firstKey);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

            return;
         }

         setErrors({});
         setLoading(true);

         /** -----------------------------
          * 1. Format and prepare date fields
          * ----------------------------- */
         const formattedDate = formData.date
            ? new Date(formData.date).toISOString()
            : new Date().toISOString();

         const formattedEndDate = formData.end_date
            ? new Date(formData.end_date).toISOString()
            : formattedDate;

         /** -----------------------------
          * 2. Generate unique slug
          * ----------------------------- */
         let slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
         const uniqueSuffix = Date.now().toString().slice(-5);
         slug = `${slug}-${uniqueSuffix}`;

         /** -----------------------------
          * 3. Folder for storage
          * ----------------------------- */
         const folder = eventId ? originalData.slug : slug;

         /** -----------------------------
          * 4. Editing: delete old files if replaced
          * ----------------------------- */
         if (eventId && originalData) {
            const thumbnailChanged =
               formData.thumbnail &&
               formData.thumbnail instanceof File &&
               originalData.thumbnail &&
               formData.thumbnail.name !== originalData.thumbnail;

            if (thumbnailChanged) {
               await deleteFile("events", originalData.thumbnail);
            }

            const newImages = formData.images.filter((img) => img instanceof File);

            if (newImages.length > 0 && originalData.images?.length > 0) {
               const oldPaths = originalData.images.map((img) =>
                  typeof img === "string" ? img : img.path
               );
               await deleteFile("events", oldPaths);
            }
         }

         /** -----------------------------
          * 5. Upload thumbnail
          * ----------------------------- */
         let thumbnailPath = formData.thumbnail;
         if (formData.thumbnail && formData.thumbnail instanceof File) {
            const thumbFile = formData.thumbnail;
            const path = `events/${user.id}/${folder}/thumbnail_${Date.now()}_${thumbFile.name}`;
            await uploadFile("events", path, thumbFile);
            thumbnailPath = path;
         }

         /** -----------------------------
          * 6. Upload images
          * ----------------------------- */
         let imagePaths = [];
         if (formData.images && formData.images.length > 0) {
            for (const img of formData.images) {
               if (img instanceof File) {
                  const path = `events/${user.id}/${folder}/gallery/${Date.now()}_${img.name}`;
                  await uploadFile("events", path, img);
                  imagePaths.push({ path });
               } else if (typeof img === "object" && img.path) {
                  imagePaths.push(img);
               }
            }
         }

         /** -----------------------------
          * 7. Update mode
          * ----------------------------- */
         if (eventId) {
            const changedFields = {};

            Object.keys(formData).forEach((key) => {
               if (key === "images" || key === "thumbnail") return;
               if (formData[key] !== originalData[key]) {
                  changedFields[key] = formData[key];
               }
            });

            changedFields.thumbnail = thumbnailPath;
            changedFields.images = imagePaths;

            const { error } = await supabase
               .from("events")
               .update(changedFields)
               .eq("id", eventId);

            if (error) throw error;

            toast.success(
               lang === "ar"
                  ? `تم تحديث الحدث "${formData.name_ar}" بنجاح!`
                  : `Event "${formData.name}" updated successfully!`
            );
            navigate("/host/events");
         } else {
            /** -----------------------------
             * 8. Create new event
             * ----------------------------- */
            const { error } = await supabase
               .from("events")
               .insert([
                  {
                     host_id: user.id,
                     name: formData.name,
                     name_ar: formData.name_ar,
                     slug,
                     description: formData.description,
                     description_ar: formData.description_ar,
                     category_id: formData.category || null,
                     location: formData.location,
                     date: formattedDate,
                     end_date: formattedEndDate,
                     capacity: Number(formData.capacity) || null,
                     price: Number(formData.price) || 0,
                     status: formData.status,
                     thumbnail: thumbnailPath,
                     images: imagePaths,
                  },
               ]);

            if (error) throw error;

            toast.success(
               lang === "ar"
                  ? `تم إنشاء الحدث "${formData.name}" بنجاح!`
                  : `Event "${formData.name}" created successfully!`
            );
            navigate("/host/events");
         }

         clearFormData();
      } catch (err) {
         console.error("Insert Error:", err.message);
         toast.error(
            lang === "ar"
               ? `حدث خطأ أثناء حفظ الحدث: ${err.message}`
               : `Error saving event: ${err.message}`
         );
      } finally {
         setLoading(false);
      }
   };


   const handleChangeImages = (files) => {
      setFormData({ ...formData, images: files });
   };

   //fix add thumbnail to form
   const handleChangeThumbnail = (file) => {
      setFormData({ ...formData, thumbnail: file });
   };

   // واجهة المستخدم
   return (
      <section className="container justify-center items-center text-content transition-colors duration-500">
         <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {lang === "ar" ? "نشر حدث" : "Publish Event"}
               </h1>
               <p className="text-content/80">
                  {lang === "ar"
                     ? "أدخل جميع بيانات الحدث أدناه لنشر الحدث"
                     : "Fill in all event details below to publish your event."}
               </p>
            </header>

            <form
               onSubmit={handleSubmit}
               className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
               {/* English / Arabic Names */}
               <div>
                  <Label
                     htmlFor="name"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar"
                        ? "اسم الحدث (إنجليزي)"
                        : "Event Name (English)"}
                  </Label>
                  <Input
                     id="name"
                     value={formData.name}
                     onChange={handleChange}
                     dir="ltr"
                     placeholder={
                        lang === "ar"
                           ? "اكتب اسم الحدث بالإنجليزية"
                           : "Enter event name"
                     }
                     className="bg-background shadow-none"
                  />
                  {errors?.name && (
                     <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                  )}
               </div>

               <div>
                  <Label
                     htmlFor="name_ar"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar"
                        ? "اسم الحدث (عربي)"
                        : "Event Name (Arabic)"}
                  </Label>
                  <Input
                     id="name_ar"
                     dir="rtl"
                     value={formData.name_ar}
                     onChange={handleChange}
                     placeholder={
                        lang === "ar"
                           ? "اكتب اسم الحدث بالعربية"
                           : "Enter event name in Arabic"
                     }
                     className="bg-background shadow-none"
                  />
                  {errors?.name_ar && (
                     <p className="text-red-500 text-xs mt-1">{errors.name_ar[0]}</p>
                  )}

               </div>

               {/* Descriptions */}
               <div className="md:col-span-2">
                  <Label
                     htmlFor="description"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar"
                        ? "الوصف (إنجليزي)"
                        : "Description (English)"}
                  </Label>
                  <Textarea
                     id="description"
                     value={formData.description}
                     dir="ltr"
                     onChange={handleChange}
                     rows={3}
                     placeholder={
                        lang === "ar"
                           ? "اكتب وصف الحدث بالإنجليزية"
                           : "Describe your event"
                     }
                     className="bg-background shadow-none"
                  />

                  {errors?.description && (
                     <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
                  )}
               </div>

               <div className="md:col-span-2">
                  <Label
                     htmlFor="description_ar"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
                  </Label>
                  <Textarea
                     id="description_ar"
                     dir="rtl"
                     value={formData.description_ar}
                     onChange={handleChange}
                     rows={3}
                     placeholder={
                        lang === "ar"
                           ? "اكتب وصف الحدث بالعربية"
                           : "Describe your event in Arabic"
                     }
                     className="bg-background shadow-none"
                  />
                  {errors?.description_ar && (
                     <p className="text-red-500 text-xs mt-1">{errors.description_ar[0]}</p>
                  )}
               </div>

               {/* Location */}
               <div>
                  <Label
                     htmlFor="location"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "موقع الحدث" : "Event Location"}
                  </Label>
                  <Input
                     id="location"
                     value={formData.location}
                     onChange={handleChange}
                     placeholder={
                        lang === "ar"
                           ? "مثال: 'عبر الإنترنت' أو 'القاهرة، مصر'"
                           : "e.g., 'Online' or 'Cairo, Egypt'"
                     }
                     className="bg-background shadow-none"
                  />
                  {errors?.location && (
                     <p className="text-red-500 text-xs mt-1">{errors.location[0]}</p>
                  )}
               </div>

               {/* Category */}
               <div>
                  <Label
                     htmlFor="category"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "فئة الحدث" : "Event Category"}
                  </Label>

                  {categoriesLoading ? (
                     <p className="text-sm text-muted-foreground">
                        {lang === "ar" ? "جاري تحميل الفئات..." : "Loading categories..."}
                     </p>
                  ) : (
                     <>
                        <Select
                           value={formData.category}
                           id="category"
                           onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                           }
                           dir={lang === "ar" ? "rtl" : "ltr"}
                        >
                           <SelectTrigger className="w-full">
                              <SelectValue
                                 placeholder={
                                    lang === "ar" ? "اختر فئة الحدث" : "Select category"
                                 }
                              />
                           </SelectTrigger>

                           <SelectContent>
                              {CategoryOptions.map((cat) => (
                                 <SelectItem key={cat.id} value={cat.id}>
                                    {cat.displayName}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>

                        {/* ⭐ Error Message */}
                        {errors?.category && (
                           <p className="text-red-500 text-xs mt-1">
                              {errors.category[0]}
                           </p>
                        )}
                     </>
                  )}
               </div>


               {/* Dates */}
               <div>
                  <Label
                     htmlFor="date"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "تاريخ الحدث" : "Event Date"}
                  </Label>
                  <Input
                     id="date"
                     type="date"
                     value={formData.date}
                     onChange={handleChange}
                     className="bg-background shadow-none"
                  />
                  {errors?.date && (
                     <p className="text-red-500 text-xs mt-1">{errors.date[0]}</p>
                  )}
               </div>

               <div>
                  <Label
                     htmlFor="end_date"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "تاريخ الانتهاء" : "End Date"}
                  </Label>
                  <Input
                     id="end_date"
                     type="date"
                     value={formData.end_date}
                     onChange={handleChange}
                     className="bg-background shadow-none"
                  />
                  {errors?.end_date && (
                     <p className="text-red-500 text-xs mt-1">{errors.end_date[0]}</p>
                  )}
               </div>

               {/* Capacity & Price */}
               <div>
                  <Label
                     htmlFor="capacity"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "السعة" : "Capacity"}
                  </Label>
                  <Input
                     id="capacity"
                     type="number"
                     value={formData.capacity}
                     onChange={handleChange}
                     placeholder={
                        lang === "ar"
                           ? "أدخل السعة (مثل 100)"
                           : "Enter capacity (e.g., 100)"
                     }
                     className="bg-background shadow-none"
                  />
                  {errors?.capacity && (
                     <p className="text-red-500 text-xs mt-1">{errors.capacity[0]}</p>
                  )}
               </div>

               <div>
                  <Label
                     htmlFor="price"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "سعر التذكرة" : "Ticket Price"}
                  </Label>
                  <Input
                     id="price"
                     type="number"
                     value={formData.price}
                     onChange={handleChange}
                     placeholder={
                        lang === "ar" ? "مثال: 100 أو 0" : "e.g., 100 or 0"
                     }
                     className="bg-background shadow-none"
                  />
                  {errors?.price && (
                     <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>
                  )}
               </div>

               {/* Thumbnail */}
               <div className="md:col-span-2">
                  <Label
                     htmlFor="thumbnail"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "الصورة المصغرة" : "Thumbnail"}
                  </Label>
                  <DragZone
                     onChange={handleChangeThumbnail}
                     acceptMultiple={false}
                     files={eventId ? [formData.thumbnail] : null}
                  />
                  {errors?.thumbnail && (
                     <p className="text-red-500 text-xs mt-1">{errors.thumbnail[0]}</p>
                  )}

               </div>

               {/* Submit */}
               <div className="md:col-span-2 flex justify-end gap-4">
                  {eventId ? (
                     <Button
                        type="submit"
                        disabled={loading}
                        variant="amber"
                        size="lg"
                     >
                        {loading
                           ? lang === "ar"
                              ? "جاري التحديث..."
                              : "Updating..."
                           : lang === "ar"
                              ? "تحديث الحدث"
                              : "Update Event"}
                     </Button>
                  ) : (
                     <Button
                        type="submit"
                        disabled={loading}
                        variant="amber"
                        size="lg"
                     >
                        {loading ? (
                           <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{t("common.loading")}</span>
                           </>
                        ) : lang === "ar" ? (
                           "إنشاء الحدث"
                        ) : (
                           "Create Event"
                        )}
                     </Button>
                  )}
                  <Button
                     type="button"
                     disabled={loading}
                     variant="outline"
                     size="lg"
                     onClick={handleCancel}
                     className="bg-red-600/20 border-red-600/50 text-red-600/80 hover:bg-red-600/50 hover:text-red-600/90"
                  >
                     {lang === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
               </div>
            </form>
         </div>
      </section>
   );
}
