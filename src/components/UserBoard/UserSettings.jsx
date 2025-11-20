import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { useDirection } from "@/hooks/useDirection";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";
import { getPublicUrl } from "@/lib/storage";
import Spinner from "../SpinnerLoader";
import { toast } from "sonner";
import { PasswordChangeModal } from "../PasswordChangeModal";

export default function ProfileSettings() {
   const { lang } = useDirection();
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.auth);
   const { data: categories, loading } = useSelector(
      (state) => state.categories
   );
   const [saving, setSaving] = useState(false);
   const originalRef = useRef(null); // Store original data
   const [formData, setFormData] = useState({
      full_name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      facebook_url: "",
      instagram_url: "",
      avatarUrl: "",
      avatarFile: null, //for new uploaded image
      categories: [],
   });

   useEffect(() => {
      if (categories.length === 0) {
         dispatch(fetchCategories());
      }
   }, [dispatch]);

   // Filter event categories and add displayName based on current language
   const viewCategories = categories
      .filter((category) => category.type === "event")
      .map((category) => ({
         ...category,
         displayName: lang === "ar" ? category.name_ar : category.name,
      }));

   //fetch user data and categories (user_categories)
   useEffect(() => {
      async function getUserData() {
         if (!user) return;
         // get user categories from supabase
         const { data: userCats } = await supabase
            .from("user_categories")
            .select("*")
            .eq("user_id", user.id);

         const loadedData = {
            full_name: user.full_name || "",
            email: user.email,
            phone: user.phone || "",
            location: user.location || "",
            bio: user.bio || "",
            facebook_url: user.facebook_url || "",
            instagram_url: user.instagram_url || "",
            avatarUrl: user.avatar || "",
            categories: userCats.map((cat) => cat.category_id),
         };
         // Set the UI form
         setFormData(loadedData);

         // Store original data in ref (won’t rerender)
         originalRef.current = loadedData;
      }
      getUserData();
   }, [user]);

   //handle change on inputs
   const handleChange = (e) => {
      const { id, type, checked, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [id]: type === "checkbox" ? checked : value,
      }));
   };

   //handle change on categories
   const toggleInterest = (interest) => {
      setFormData((prev) => ({
         ...prev,
         categories: prev.categories.includes(interest)
            ? prev.categories.filter((i) => i !== interest)
            : [...prev.categories, interest],
      }));
   };

   //view avatar
   const handleAvatar = (el) => {
      if (!el) return avatarPlaceholderImg;

      // absolute URL
      if (typeof el === "string" && el.startsWith("http")) return el;

      // stored file path inside Supabase (avatars bucket)
      if (typeof el === "string") return getPublicUrl("avatars", el);

      return avatarPlaceholderImg;
   };

   //handle form submit to supabase
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user?.id) {
         toast.error(
            lang === "ar" ? "يجب تسجيل الدخول أولاً" : "You must be logged in"
         );
         return;
      }

      setSaving(true);

      try {
         let avatarUrl = formData.avatarUrl;
         const original = originalRef.current;

         // -------------------------
         // 1) Upload avatar if changed
         // -------------------------
         if (formData.avatarFile) {
            const file = formData.avatarFile;
            const ext = file.name.split(".").pop();
            const path = `avatars/${user.full_name}/${
               user.id
            }-${Date.now()}.${ext}`;

            const { error: uploadErr } = await supabase.storage
               .from("avatars")
               .upload(path, file, { upsert: true });

            if (uploadErr) throw uploadErr;

            const { data: publicUrlData } = supabase.storage
               .from("avatars")
               .getPublicUrl(path);

            avatarUrl = publicUrlData?.publicUrl;
         }

         // -------------------------
         // 2) Build "changed fields only"
         // -------------------------
         const updatedFields = {};

         const keysToCheck = [
            "full_name",
            "phone",
            "location",
            "bio",
            "facebook_url",
            "instagram_url",
         ];

         keysToCheck.forEach((key) => {
            if (formData[key] !== original[key]) {
               updatedFields[key] = formData[key] || null;
            }
         });

         // Avatar changed?
         if (avatarUrl !== original.avatarUrl) {
            updatedFields.avatar = avatarUrl || null;
         }

         // -------------------------
         // 3) Update users table (only changed fields)
         // -------------------------
         if (Object.keys(updatedFields).length > 0) {
            const { error: userErr } = await supabase
               .from("users")
               .update(updatedFields)
               .eq("id", user.id);

            if (userErr) throw userErr;
         }

         // -------------------------
         // 4) Update categories (only if changed)
         // -------------------------
         const originalCat = original.categories || [];
         const newCat = formData.categories || [];

         const categoriesChanged =
            originalCat.length !== newCat.length ||
            originalCat.some((c) => !newCat.includes(c));

         if (categoriesChanged) {
            await supabase
               .from("user_categories")
               .delete()
               .eq("user_id", user.id);

            if (newCat.length > 0) {
               const rows = newCat.map((id) => ({
                  user_id: user.id,
                  category_id: id,
               }));

               const { error: catErr } = await supabase
                  .from("user_categories")
                  .insert(rows);

               if (catErr) throw catErr;
            }
         }

         // -------------------------
         // 5) Save success
         // -------------------------
         toast.success(
            lang === "ar"
               ? "تم حفظ التعديلات بنجاح"
               : "Changes saved successfully"
         );

         // -------------------------
         // 6) Update original data
         // -------------------------
         originalRef.current = {
            ...formData,
            avatarUrl,
         };

         // Reset extra fields (avatarFile)
         setFormData((prev) => ({
            ...prev,
            avatarUrl,
            avatarFile: null,
         }));
      } catch (err) {
         console.error(err);
         toast.error(
            lang === "ar"
               ? "حدث خطأ أثناء حفظ البيانات"
               : "Failed to save profile"
         );
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return <Spinner />;
   }

   return (
      <main className="flex-1 overflow-y-auto">
         <div className="container py-3">
            {/* Header */}
            <header className="mb-10">
               <h1 className="text-3xl font-bold text-primary mb-2">
                  {lang === "en" ? "Account Settings" : "اعدادات الحساب"}
               </h1>
            </header>

            <form onSubmit={handleSubmit}>
               <section>
                  {/* Personal Details */}
                  <h2 className="text-xl font-semibold text-primary border-b border-border pb-4 mb-6">
                     {lang === "en"
                        ? "Personal Information"
                        : "المعلومات الشخصية"}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                     {/* Avatar Upload */}
                     <div className="md:col-span-2 flex items-center gap-6">
                        <img
                           src={
                              formData.avatarFile
                                 ? URL.createObjectURL(formData.avatarFile)
                                 : handleAvatar(formData.avatarUrl)
                           }
                           alt="User Avatar"
                           className="w-20 h-20 rounded-full object-cover border border-border"
                        />

                        <div className="space-y-3">
                           <Label className="font-medium text-sm ">
                              {lang === "ar"
                                 ? "الصورة الشخصية"
                                 : "Profile Picture"}
                           </Label>

                           <Button variant="primary" asChild>
                              <label>
                                 {lang === "ar" ? "رفع صورة" : "Upload Image"}
                                 <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          avatarFile:
                                             e.target.files?.[0] || null,
                                       }))
                                    }
                                 />
                              </label>
                           </Button>
                           <div className="text-sm text-muted-foreground pt-4">
                              {lang === "ar"
                                 ? "يمكنك تحميل صورة بحجم اقل من 2 ميغابايت (jpg, jpeg, png)"
                                 : "You can upload an image with a maximum size of 2MB (jpg, jpeg, png)"}
                           </div>
                        </div>
                     </div>

                     {/* Full Name */}
                     <div>
                        <Label
                           htmlFor="full_name"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "الاسم " : "Name"}
                        </Label>
                        <Input
                           id="full_name"
                           value={formData.full_name}
                           onChange={handleChange}
                           placeholder={
                              lang === "ar" ? "اكتب اسمك" : "Enter your name"
                           }
                           className="bg-background"
                        />
                     </div>

                     {/* Email (Read-only) */}
                     <div>
                        <Label
                           htmlFor="email"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "البريد الإلكتروني" : "Email"}
                        </Label>
                        <Input
                           id="email"
                           value={formData.email}
                           readOnly
                           className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                           {lang === "ar"
                              ? "لا يمكن تعديل البريد لأنه مرتبط بحسابك."
                              : "Email cannot be changed because it's linked to your account."}
                        </p>
                     </div>

                     {/* Phone Number */}
                     <div>
                        <Label
                           htmlFor="phone"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                        </Label>
                        <Input
                           id="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           placeholder={
                              lang === "ar"
                                 ? "اكتب رقم الهاتف"
                                 : "Enter phone number"
                           }
                           className="bg-background"
                        />
                     </div>

                     {/* Location */}
                     <div>
                        <Label
                           htmlFor="location"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "الموقع" : "Location"}
                        </Label>
                        <Input
                           id="location"
                           value={formData.location}
                           onChange={handleChange}
                           placeholder={
                              lang === "ar"
                                 ? "مثال: القاهرة، مصر"
                                 : "Example: Cairo, Egypt"
                           }
                           className="bg-background"
                        />
                     </div>

                     {/* Bio */}
                     <div className="md:col-span-2">
                        <Label
                           htmlFor="bio"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "نبذة عنك" : "Bio"}
                        </Label>
                        <textarea
                           id="bio"
                           value={formData.bio}
                           onChange={handleChange}
                           rows={4}
                           placeholder={
                              lang === "ar"
                                 ? "اكتب نبذة قصيرة..."
                                 : "Write a short bio…"
                           }
                           className="w-full rounded-md bg-muted border border-border px-3 py-2 text-sm focus:ring-primary focus:ring-2 focus:outline-none"
                        />
                     </div>

                     {/* Social Links */}
                     <div>
                        <Label
                           htmlFor="facebook_url"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "فيسبوك" : "Facebook URL"}
                        </Label>
                        <Input
                           id="facebook_url"
                           value={formData.facebook_url}
                           onChange={handleChange}
                           placeholder="https://facebook.com/username"
                           className="bg-background"
                        />
                     </div>

                     <div>
                        <Label
                           htmlFor="instagram_url"
                           className="mb-2 block font-medium text-sm"
                        >
                           {lang === "ar" ? "إنستغرام" : "Instagram URL"}
                        </Label>
                        <Input
                           id="instagram_url"
                           value={formData.instagram_url}
                           onChange={handleChange}
                           placeholder="https://instagram.com/username"
                           className="bg-background"
                        />
                     </div>
                  </div>
                  {/* categories / interests */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-7 border-y py-7">
                     <Label className="text-md font-semibold ">
                        {lang === "ar"
                           ? " التصنيفات / الاهتمامات"
                           : "Categories / Interests"}
                        :
                     </Label>
                     {viewCategories.map((interest) => (
                        <div
                           key={interest.id}
                           onClick={(e) => {
                              e.preventDefault();
                              toggleInterest(interest.id); // store id instead of name
                           }}
                           className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.categories.includes(interest.id)
                                 ? "border-primary bg-primary/10"
                                 : "border-border hover:border-primary/50"
                           }`}
                        >
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                 {interest.displayName}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Notification Preferences */}
               {/* <section>
                        <h2 className='text-2xl font-semibold text-primary border-b border-border pb-4 mb-6'>
                            Notification Preferences
                        </h2>
                        <div className='space-y-4 bg-surface p-6 rounded-sm'>
                            {[
                                {
                                    name: "emailNotifications",
                                    label: "Email Notifications",
                                },
                                {
                                    name: "pushNotifications",
                                    label: "Push Notifications",
                                },
                                {
                                    name: "smsNotifications",
                                    label: "SMS Notifications",
                                },
                            ].map(({ name, label }) => (
                                <label
                                    key={name}
                                    className='flex items-center justify-between text-sm font-medium text-foreground'
                                >
                                    {label}
                                    <input
                                        type='checkbox'
                                        name={name}
                                        checked={formData[name]}
                                        onChange={handleChange}
                                        className='h-5 w-5 rounded-sm border border-border text-primary focus:ring-2 focus:ring-primary'
                                    />
                                </label>
                            ))}
                        </div>
                    </section> */}

               {/* Payment Methods */}
               {/* <section>
                        <h2 className='text-2xl font-semibold text-primary border-b border-border pb-4 mb-6'>
                            Payment Methods
                        </h2>
                        <div className='bg-surface p-6 rounded-sm space-y-4'>
                            <div className='flex items-center justify-between border-b border-border pb-3'>
                                <div className='flex items-center gap-4'>
                                    <div
                                        className='h-8 w-12 bg-center bg-no-repeat bg-contain'
                                        style={{
                                            backgroundImage:
                                                "url('https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg')",
                                        }}
                                    ></div>
                                    <div>
                                        <p className='text-sm font-medium text-foreground'>
                                            Visa ending in 1234
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Expires 05/25
                                        </p>
                                    </div>
                                </div>
                                <Button variant='ghost' size='sm'>
                                    Edit
                                </Button>
                            </div>

                            <button
                                type='button'
                                className='w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-sm text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-all'
                            >
                                + Add Payment Method
                            </button>
                        </div>
                    </section> */}
               {/* Save Button */}
               <div className=" pt-6">
                  <Button
                     variant="default"
                     size="lg"
                     type="submit"
                     disabled={saving}
                  >
                     {saving ? (
                        <div className="w-5 h-5 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                     ) : lang === "en" ? (
                        "Save Changes"
                     ) : (
                        "حفظ التغييرات"
                     )}
                  </Button>
               </div>
            </form>
            {/* Security */}
            <section className="space-y-4 pt-8">
               <h2 className="text-xl font-semibold text-primary border-b border-border pb-4 ">
                  {lang === "en" ? "Security" : "الأمان"}
               </h2>
               <PasswordChangeModal lang={lang} user={user} />
            </section>
         </div>
      </main>
   );
}
