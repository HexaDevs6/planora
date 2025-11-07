import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { fetchCategories } from "@/store/fetchCategoriesThunk"; // ✅ عدّلي المسار حسب مشروعك
import { validateEvent } from "@/utils/validation/eventValidation";


export default function PublishEvent() {
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
        displayName: category.name_ar || category.name,
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

  // ✅ إرسال البيانات إلى Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateEvent(formData);
  if (Object.keys(errors).length > 0) {
    // عرض الأخطاء في toast
    Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      setLoading(true);

      // 🔹 تجهيز التواريخ
      const formattedDate = formData.date
        ? new Date(formData.date).toISOString()
        : new Date().toISOString();

      const formattedEndDate = formData.end_date
        ? new Date(formData.end_date).toISOString()
        : formattedDate;

      // 🔹 توليد slug فريد
      //slug من الاسم عايز يتعدل عشان يبقى فريد
      let slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      const uniqueSuffix = Date.now().toString().slice(-5);
      slug = `${slug}-${uniqueSuffix}`;

      // 🔹 إدخال البيانات
      const { data, error } = await supabase.from("events").insert([
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
          thumbnail: formData.thumbnail?.name || null,
          images: Array.isArray(formData.images)
            ? formData.images.map((img) => img.name)
            : null,
        },
      ]).select();


      if (error) throw error;

     toast.success(`✅ تم إنشاء الحدث "${formData.name}" بنجاح!`);

      console.log("Inserted Event:", data);

      // 🔹 تنظيف الفورم بعد النجاح
      setFormData({
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
    } catch (err) {
      console.error("❌ Insert Error:", err.message);
      toast.error(`حدث خطأ أثناء إنشاء الحدث: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ واجهة المستخدم
  return (
    <section className="min-h-screen justify-center items-center bg-background text-content transition-colors duration-500">
      <div className="w-full bg-white dark:bg-foreground/5 backdrop-blur-lg border border-content/20 shadow-lg rounded-[var(--radius)] p-8 md:p-12 transition-all duration-300">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Publish Event
          </h1>
          <p className="text-content/80">
            Fill in all event details below to publish your event.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {/* 🔤 English / Arabic Names */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Event Name (English)
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="name_ar" className="block text-sm font-semibold mb-2">
              اسم الحدث (عربي)
            </label>
            <input
              id="name_ar"
              dir="rtl"
              value={formData.name_ar}
              onChange={handleChange}
              placeholder="اكتب اسم الحدث بالعربية"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          {/* 📝 Descriptions */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold mb-2">
              Description (English)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe your event"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description_ar" className="block text-sm font-semibold mb-2">
              الوصف بالعربية
            </label>
            <textarea
              id="description_ar"
              dir="rtl"
              value={formData.description_ar}
              onChange={handleChange}
              rows="3"
              placeholder="اكتب وصف الحدث"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          {/* 📍 Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-semibold mb-2">
              Event Location
            </label>
            <input
              id="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., 'Online' or 'Cairo, Egypt'"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          {/* 🧩 Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-2">
              Event Category
            </label>
            {categoriesLoading ? (
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            ) : (
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
              >
                <option value="">Select category</option>
                {CategoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.displayName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 🗓️ Dates */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold mb-2">
              Event Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-semibold mb-2">
              End Date
            </label>
            <input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          {/* 👥 Capacity & 💵 Price */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-semibold mb-2">
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity (e.g., 100)"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-2">
              Ticket Price
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 100 or 0"
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            />
          </div>

          {/* 🏷️ Status
          <div>
            <label htmlFor="status" className="block text-sm font-semibold mb-2">
              Event Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded border border-content/20 bg-foreground/5 px-4 py-3"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}

          {/* 🖼️ Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-semibold mb-2">
              Thumbnail
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>

          {/* 🖼️ Images */}
          <div>
            <label htmlFor="images" className="block text-sm font-semibold mb-2">
              Event Images
            </label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>

          {/* ✅ Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-white font-semibold py-3 px-8 rounded hover:bg-amber-dark transition-all shadow-md"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
