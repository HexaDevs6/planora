// src/validators/eventSchemas.js
import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(3, "Event name (EN) must be at least 3 characters"),
  name_ar: z.string().min(3, "اسم الحدث بالعربية يجب أن يكون 3 أحرف على الأقل"),
  description: z
    .string()
    .min(10, "Description (EN) must be at least 10 characters"),
  description_ar: z
    .string()
    .min(10, "الوصف بالعربية يجب أن يكون 10 أحرف على الأقل"),
  location: z.string().min(3, "Location is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Event date is required"),
  end_date: z.string().min(1, "End date is required"),
  capacity: z
    .string()
    .regex(/^[0-9]+$/, "Capacity must be a number")
    .optional(),
  price: z
    .string()
    .regex(/^[0-9]+$/, "Price must be a valid number")
    .optional(),
});
