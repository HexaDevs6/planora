// src/validators/serviceSchemas.js
import { z } from "zod";

export const ServiceSchema = z
  .object({
    name: z
      .string()
      .min(3, "Service name must be at least 3 characters"),

    name_ar: z
      .string()
      .min(3, "Arabic name must be at least 3 characters"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    description_ar: z
      .string()
      .min(10, "Arabic description must be at least 10 characters"),

    category_id: z
      .string()
      .min(1, "Please select a category"),

    thumbnail: z.any().refine(
      (file) => file !== null && file !== undefined,
      "Thumbnail is required"
    ),

    images: z
      .array(z.any())
      .optional(),
  });
