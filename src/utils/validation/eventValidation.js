/**
 * ✅ Professional Event Form Validation
 * Organized, multilingual, and scalable for production use.
 */

export function validateEvent(formData, lang = "ar") {
  const errors = {};
  const t = (en, ar) => (lang === "ar" ? ar : en); // ترجمة فورية حسب اللغة
  

  // ====== 🟩 عناوين الحقول (labels) ======
  const fieldLabels = {
    name: t("Event Name (English)", "اسم الحدث بالإنجليزية"),
    name_ar: t("Event Name (Arabic)", "اسم الحدث بالعربية"),
    description: t("Description (English)", "الوصف بالإنجليزية"),
    description_ar: t("Description (Arabic)", "الوصف بالعربية"),
    location: t("Location", "الموقع"),
    date: t("Event Date", "تاريخ الحدث"),
    end_date: t("End Date", "تاريخ الانتهاء"),
    category: t("Category", "التصنيف"),
    capacity: t("Capacity", "السعة"),
    price: t("Price", "السعر"),
  };

  // ====== 🧩 الحقول المطلوبة ======
  const requiredFields = [
    "name",
    "name_ar",
    "description",
    "description_ar",
    "location",
    "date",
    "category",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field] || !formData[field].toString().trim()) {
      errors[field] = `${fieldLabels[field]} ${t("is required!", "مطلوب!")}`;
    }
  });

  // ====== 🔤 التحقق من اللغة في الأسماء ======
  if (formData.name?.trim() && !/^[A-Za-z0-9\s]+$/.test(formData.name)) {
    errors.name = t(
      "English name must contain only Latin letters and numbers!",
      "يجب أن يحتوي الاسم بالإنجليزية على أحرف وأرقام لاتينية فقط!"
    );
  }

  if (formData.name_ar?.trim() && !/^[\u0600-\u06FF0-9\s]+$/.test(formData.name_ar)) {
    errors.name_ar = t(
      "Arabic name must contain only Arabic letters and numbers!",
      "يجب أن يحتوي الاسم بالعربية على أحرف عربية وأرقام فقط!"
    );
  }

  // ====== 📝 التحقق من اللغة في الوصف ======
  if (formData.description?.trim() && /[\u0600-\u06FF]/.test(formData.description)) {
    errors.description = t(
      "Description (English) must not contain Arabic letters!",
      "الوصف بالإنجليزية لا يجب أن يحتوي على أحرف عربية!"
    );
  }

  if (formData.description_ar?.trim() && /[A-Za-z]/.test(formData.description_ar)) {
    errors.description_ar = t(
      "Arabic description must not contain English letters!",
      "الوصف بالعربية لا يجب أن يحتوي على أحرف إنجليزية!"
    );
  }

  // ====== 🔢 التحقق من القيم الرقمية ======
  const numericFields = ["capacity", "price"];
  numericFields.forEach((field) => {
    const value = formData[field];
    if (value !== "" && value !== null && value !== undefined) {
      if (isNaN(Number(value))) {
        errors[field] = `${fieldLabels[field]} ${t("must be a number!", "يجب أن يكون رقمًا!")}`;
      } else if (Number(value) < 0) {
        errors[field] = `${fieldLabels[field]} ${t("cannot be negative!", "لا يمكن أن يكون سالبًا!")}`;
      }
    }
  });

  // ====== 🗓️ التحقق من التواريخ ======
  if (formData.date && formData.end_date) {
    const start = new Date(formData.date);
    const end = new Date(formData.end_date);
    if (isNaN(start) || isNaN(end)) {
      errors.date = t("Invalid date format!", "تنسيق التاريخ غير صالح!");
    } else if (end < start) {
      errors.end_date = t(
        "End date cannot be before start date!",
        "تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء!"
      );
    }
  }

  // ====== 🖼️ تحقق من الصور (اختياري) ======
  const maxSizeMB = 5;
  if (formData.thumbnail && formData.thumbnail.size > maxSizeMB * 1024 * 1024) {
    errors.thumbnail = t(
      `Thumbnail size should not exceed ${maxSizeMB}MB.`,
      `حجم الصورة المصغرة لا يجب أن يتجاوز ${maxSizeMB} ميجابايت.`
    );
  }

  if (Array.isArray(formData.images)) {
    const invalidImage = formData.images.find((file) => file.size > maxSizeMB * 1024 * 1024);
    if (invalidImage) {
      errors.images = t(
        `Each image must be smaller than ${maxSizeMB}MB.`,
        `كل صورة يجب أن تكون أصغر من ${maxSizeMB} ميجابايت.`
      );
    }
  }

  // ====== ⚙️ تحقق من المنطق الزمني (الحدث في المستقبل) ======
  if (formData.date) {
    const today = new Date();
    const startDate = new Date(formData.date);
    if (startDate < today && !errors.date) {
      errors.date = t("Event date must be in the future!", "تاريخ الحدث يجب أن يكون في المستقبل!");
    }
  }

  // ====== ✅ النتيجة النهائية ======
  return errors;
}
