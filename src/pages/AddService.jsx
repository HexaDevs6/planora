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

export default function AddService() {
   const [searchParams] = useSearchParams();
   const serviceId = searchParams.get("serviceId");
   const [originalData, setOriginalData] = useState(null);
   const navigate = useNavigate();
   const { lang } = useDirection();
   const dispatch = useDispatch();
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
      price: "",
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
                  price: service.price,
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
         price: "",
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
      console.log(formData);

      // const errors = validateEvent(formData);
      // if (Object.keys(errors).length > 0) {
      //    // عرض الأخطاء في toast
      //    Object.values(errors).forEach((msg) => toast.error(msg));
      //    return;
      // }

      try {
         setLoading(true);

         let slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

         const uniqueSuffix = Date.now().toString().slice(-5);
         slug = `${slug}-${uniqueSuffix}`;

         if (serviceId) {
            // Compare formData with originalData and only send changed fields
            const changedFields = {};
            
            Object.keys(formData).forEach((key) => {
               // For arrays (images)
               if (Array.isArray(formData[key]) && Array.isArray(originalData[key])) {
                  const currentImages = formData[key].map(img => typeof img === 'string' ? img : img.name);
                  const originalImages = originalData[key];
                  if (JSON.stringify(currentImages) !== JSON.stringify(originalImages)) {
                     changedFields.images = currentImages;
                  }
               }
               // For thumbnail (File object or string)
               else if (key === 'thumbnail') {
                  const currentThumbnail = typeof formData[key] === 'string' ? formData[key] : formData[key]?.name;
                  if (currentThumbnail !== originalData[key]) {
                     changedFields.thumbnail = currentThumbnail;
                  }
               }
               // For price (ensure number comparison)
               else if (key === 'price') {
                  if (Number(formData[key]) !== Number(originalData[key])) {
                     changedFields.price = Number(formData[key]);
                  }
               }
               // For other fields
               else if (formData[key] !== originalData[key]) {
                  changedFields[key] = formData[key];
               }
            });

            // Only proceed with update if there are changes
            if (Object.keys(changedFields).length === 0) {
               toast.info(lang === "ar" ? "لا توجد تغييرات للحفظ" : "No changes to save");
               setLoading(false);
               return;
            }

            console.log("Changed fields:", changedFields);

            const { data, error } = await supabase
               .from("services")
               .update(changedFields)
               .eq("id", serviceId);
               
            if (error) {
               console.error(error);
               toast.error(lang === "ar" ? `حدث خطأ أثناء تحديث الخدمة: ${error.message}` : `An error occurred while updating the service: ${error.message}`);
               return;
            } else {
               toast.success(lang === "ar" ? `تم تحديث الخدمة "${formData.name_ar}" بنجاح!` : `Service "${formData.name}" updated successfully!`);
               console.log("Updated Service:", data);
               navigate("/user/services");
            }
         } else {
            const { data, error } = await supabase
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
                     price: Number(formData.price) || 0,
                     thumbnail: formData.thumbnail?.name || null,
                     images: Array.isArray(formData.images)
                        ? formData.images.map((img) => img.name)
                        : null,
                  },
               ])
               .select();

            if (error) throw error;

            toast.success(lang === "ar" ? `تم إنشاء الخدمة "${formData.name}" بنجاح!` : `Service "${formData.name}" created successfully!`);

            console.log("Inserted Service:", data);
            navigate("/user/services");
         }

         clearFormData();
      } catch (err) {
         console.error("Insert Error:", err.message);
         toast.error(lang === "ar" ? `حدث خطأ أثناء إنشاء الحدث: ${err.message}` : `An error occurred while creating the service: ${err.message}`);
      } finally {
         setLoading(false);
      }
   };

   if (loading && serviceId) {
      return <Spinner />;
   }

   // ✅ واجهة المستخدم
   return (
      <section className="min-h-screen justify-center items-center bg-background text-content transition-colors duration-500">
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
                     placeholder={
                        lang === "ar"
                           ? "اكتب عنوان الخدمة بالإنجليزية"
                           : "Enter service title"
                     }
                     className="bg-muted shadow-none"
                  />
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
                     rows={3}
                     placeholder={
                        lang === "ar"
                           ? "اكتب وصف الخدمة بالإنجليزية"
                           : "Enter service description in English, what you are offering ?"
                     }
                     className="bg-muted shadow-none"
                  />
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
               </div>

               {/* Price */}

               <div>
                  <Label
                     htmlFor="price"
                     className="block text-sm font-semibold mb-2"
                  >
                     {lang === "ar" ? "سعر الخدمة" : "Service Price"}
                  </Label>
                  <Input
                     id="price"
                     type="number"
                     value={formData.price}
                     onChange={handleChange}
                     placeholder={
                        lang === "ar"
                           ? 'على سبيل المثال "100" أو "0"'
                           : "e.g. 100 or 0"
                     }
                     className="bg-muted shadow-none"
                  />
               </div>

               {/* Thumbnail */}
               <div>
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
               </div>

               {/* Images */}
               <div>
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
                        {loading ? "Publishing..." : "Publish Service"}
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
