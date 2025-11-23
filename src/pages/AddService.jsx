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
import { useSearchParams } from "react-router-dom";
import Spinner from "@/components/SpinnerLoader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { uploadFile, deleteFile } from "@/lib/storage";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { ServiceSchema } from "@/validators/serviceSchemas";


export default function AddService() {
   const [searchParams] = useSearchParams();
   const { t } = useTranslation();
   const serviceId = searchParams.get("serviceId");
   const [originalData, setOriginalData] = useState(null);
   const navigate = useNavigate();
   const { lang } = useDirection();
   const dispatch = useDispatch();
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
      category_id: "",
      thumbnail: null,
      images: [],
   });

   useEffect(() => {
      if (serviceId) {
         setLoading(true);
         const fetchService = async () => {
            const { data, error } = await supabase
               .from("services")
               .select("*")
               .eq("id", serviceId);
            if (error) {
               toast.error(lang === "ar" ? "حدث خطأ أثناء تحميل الخدمة" : "Error loading service");
               console.error(error);
               return;
            } else {
               console.log(data);
               const service = data[0];
               const serviceData = {
                  name: service.name,
                  name_ar: service.name_ar,
                  slug: service.slug,
                  description: service.description,
                  description_ar: service.description_ar,
                  category_id: service.category_id,
                  thumbnail: service.thumbnail,
                  images: service.images,
               };
               setFormData(serviceData);
               setOriginalData(serviceData);
               setLoading(false);
            }
         };
         fetchService();
      }
   }, [serviceId]);

   useEffect(() => {
      if (!categories || categories.length === 0) {
         dispatch(fetchCategories());
      }
   }, [dispatch, categories]);

   const [CategoryOptions, setCategoryOptions] = useState([]);

   useEffect(() => {
      setCategoryOptions(
         categories
            ?.filter((category) => category.type === "service")
            ?.map((category) => ({
               ...category,
               displayName: lang === "ar" ? category.name_ar : category.name,
            })) || []
      );
   }, [categories, lang]);

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

   const handleChangeThumbnail = (file) => {
      setFormData({ ...formData, thumbnail: file });
   };

   const handleChangeImages = (files) => {
      setFormData({ ...formData, images: files });
   };

   const clearFormData = () => {
      setFormData({
         name: "",
         name_ar: "",
         slug: "",
         description: "",
         description_ar: "",
         category_id: "",
         thumbnail: null,
         images: [],
      });
   };

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
            navigate("/user/services");
         }
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      /** -----------------------------
       * (0) Validate using Zod
       * ----------------------------- */
      const result = ServiceSchema.safeParse(formData);

      if (!result.success) {
         setErrors(result.error.flatten().fieldErrors);
         toast.error(
            lang === "ar"
               ? "من فضلك صحّح الأخطاء قبل المتابعة"
               : "Please fix the highlighted errors"
         );
         setLoading(false);
         return;
      }

      // Clear previous errors
      setErrors({});

      try {
         /** -----------------------------
          * 1. Generate unique slug
          * ----------------------------- */
         let slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

         const uniqueSuffix = Date.now().toString().slice(-5);
         slug = `${slug}-${uniqueSuffix}`;

         /** -----------------------------
          * 2. Define storage folder name
          * ----------------------------- */
         const folder = serviceId ? formData.slug || slug : slug;

         /** -----------------------------
          * 3. If editing: delete old files if replaced
          * ----------------------------- */
         if (serviceId && originalData) {
            // Delete old thumbnail
            const thumbnailChanged =
               formData.thumbnail &&
               formData.thumbnail instanceof File &&
               originalData.thumbnail &&
               formData.thumbnail.name !== originalData.thumbnail;

            if (thumbnailChanged) {
               await deleteFile("services", originalData.thumbnail);
            }

            // Delete old gallery
            const newImages = formData.images.filter((img) => img instanceof File);
            if (newImages.length > 0 && originalData.images?.length > 0) {
               const oldPaths = originalData.images.map((img) =>
                  typeof img === "string" ? img : img.path
               );
               await deleteFile("services", oldPaths);
            }
         }

         /** -----------------------------
          * 4. Upload thumbnail
          * ----------------------------- */
         let thumbnailPath = formData.thumbnail;
         if (formData.thumbnail && formData.thumbnail instanceof File) {
            const thumbFile = formData.thumbnail;
            const path = `services/${user.id}/${folder}/thumbnail_${Date.now()}_${thumbFile.name}`;
            await uploadFile("services", path, thumbFile);
            thumbnailPath = path;
         }

         /** -----------------------------
          * 5. Upload gallery images
          * ----------------------------- */
         let imagePaths = [];
         if (formData.images && formData.images.length > 0) {
            for (const img of formData.images) {
               if (img instanceof File) {
                  const path = `services/${user.id}/${folder}/gallery/${Date.now()}_${img.name}`;
                  await uploadFile("services", path, img);
                  imagePaths.push({ path });
               } else if (typeof img === "object" && img.path) {
                  imagePaths.push(img);
               }
            }
         }

         /** -----------------------------
          * 6. Update or create
          * ----------------------------- */
         if (serviceId) {
            const changedFields = {};

            Object.keys(formData).forEach((key) => {
               if (["images", "thumbnail"].includes(key)) return;
               if (formData[key] !== originalData[key]) {
                  changedFields[key] = formData[key];
               }
            });

            changedFields.thumbnail = thumbnailPath;
            changedFields.images = imagePaths;

            const { error } = await supabase
               .from("services")
               .update(changedFields)
               .eq("id", serviceId);

            if (error) throw error;

            toast.success(
               lang === "ar"
                  ? `تم تحديث الخدمة "${formData.name_ar}" بنجاح!`
                  : `Service "${formData.name}" updated successfully!`
            );

            navigate("/user/services");
         } else {
            const { error } = await supabase
               .from("services")
               .insert([
                  {
                     client_id: user.id,
                     name: formData.name,
                     name_ar: formData.name_ar,
                     slug,
                     description: formData.description,
                     description_ar: formData.description_ar,
                     category_id: formData.category_id || null,
                     thumbnail: thumbnailPath,
                     images: imagePaths,
                  },
               ])
               .select();

            if (error) throw error;

            toast.success(
               lang === "ar"
                  ? `تم إنشاء الخدمة "${formData.name}" بنجاح!`
                  : `Service "${formData.name}" created successfully!`
            );

            navigate("/user/services");
         }

         clearFormData();
      } catch (err) {
         console.error("Insert Error:", err.message);
         toast.error(
            lang === "ar"
               ? `حدث خطأ أثناء حفظ الخدمة: ${err.message}`
               : `Error saving service: ${err.message}`
         );
      } finally {
         setLoading(false);
      }
   };


   if (loading && serviceId) {
      return <Spinner message={t("common.loading")} />;
   }

   // ✅ واجهة المستخدم
   return (
      <section className="container text-content transition-colors duration-500">
         <div className="w-full max-w-5xl mx-auto">
            <header className="text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {lang === "ar" ? "إضافة خدمة" : "Add Service"}
               </h1>
               <p className="text-content/80">
                  {lang === "ar"
                     ? "أدخل جميع بيانات الخدمة أدناه لإضافة الخدمة"
                     : "Fill in all service details below to add your service."}
               </p>
            </header>

            <form
               onSubmit={handleSubmit}
               className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
               {/* Title */}
               <div>
                  <Label
                     htmlFor="name"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                  </Label>
                  <Input
                     id="name"
                     value={formData.name}
                     onChange={handleChange}
                     dir="ltr"
                     placeholder={
                        lang === "ar"
                           ? "اكتب عنوان الخدمة بالإنجليزية"
                           : "Enter service title"
                     }
                     className="bg-muted shadow-none"
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
                     {lang === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}
                  </Label>
                  <Input
                     id="name_ar"
                     dir="rtl"
                     value={formData.name_ar}
                     onChange={handleChange}
                     placeholder={
                        lang === "ar"
                           ? "اكتب عنوان الخدمة بالعربية"
                           : "Enter service title in Arabic, what you are offering ?"
                     }
                     className="bg-muted shadow-none"
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
                     onChange={handleChange}
                     dir="ltr"
                     rows={3}
                     placeholder={
                        lang === "ar"
                           ? "اكتب وصف الخدمة بالإنجليزية"
                           : "Enter service description in English, what you are offering ?"
                     }
                     className="bg-muted shadow-none"
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
                           ? "اكتب وصف الخدمة بالعربية"
                           : "Enter service description in Arabic"
                     }
                     className="bg-muted shadow-none"
                  />
                  {errors?.description_ar && (
                     <p className="text-red-500 text-xs mt-1">{errors.description_ar[0]}</p>
                  )}

               </div>

               {/* Category */}
               <div>
                  <Label
                     htmlFor="category"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "فئة الخدمة" : "Service Category"}
                  </Label>
                  {categoriesLoading ? (
                     <p className="text-sm text-muted-foreground">
                        {lang === "ar"
                           ? "جاري تحميل الفئات..."
                           : "Loading categories..."}
                     </p>
                  ) : (
                     <Select
                        value={formData.category_id}
                        id="category_id"
                        onValueChange={(value) =>
                           setFormData({ ...formData, category_id: value })
                        }
                        dir={lang === "ar" ? "rtl" : "ltr"}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue
                              placeholder={
                                 lang === "ar"
                                    ? "اختر فئة الخدمة"
                                    : "Select category"
                              }
                           />
                        </SelectTrigger>
                        <SelectContent>
                           {CategoryOptions.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                 {cat.displayName}
                              </SelectItem>
                           ))}
                           <SelectItem value="others">
                              {lang === "ar" ? "غير ذالك" : "Others"}
                           </SelectItem>
                        </SelectContent>
                     </Select>

                  )}
                  {errors?.category_id && (
                     <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>
                  )}

               </div>

               {/* Thumbnail */}
               <div className="md:col-span-2 lg:col-span-1">
                  <Label
                     htmlFor="thumbnail"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "صورة الخدمة" : "Service Thumbnail"}
                  </Label>
                  <DragZone
                     onChange={handleChangeThumbnail}
                     acceptMultiple={false}
                     files={serviceId ? [formData.thumbnail] : null}
                  />
                  {errors?.thumbnail && (
                     <p className="text-red-500 text-xs mt-1">{errors.thumbnail[0]}</p>
                  )}

               </div>

               {/* Images */}
               <div className="md:col-span-2 lg:col-span-1">
                  <Label
                     htmlFor="images"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "صور الخدمة" : "Service Images"}
                  </Label>
                  <DragZone
                     onChange={handleChangeImages}
                     acceptMultiple={true}
                     files={serviceId ? formData.images : null}
                     maxFiles={5}
                  />
                  {errors?.images && (
                     <p className="text-red-500 text-xs mt-1">{errors.images[0]}</p>
                  )}

               </div>

               {/* Submit */}
               <div className="md:col-span-2 flex justify-end gap-4">
                  {serviceId ? (
                     <Button
                        type="submit"
                        disabled={loading}
                        variant="amber"
                        size="lg"
                     >
                        {loading ? "Updating..." : "Update Service"}
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
                           "نشر الخدمة"
                        ) : (
                           "Publish Service"
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
