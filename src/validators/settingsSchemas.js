// src/validators/settingsSchemas.js
import { z } from "zod";

export const baseProfileSchema = {
  full_name: z
    .string()
    .min(3, "Full name must be at least 3 chars")
    .max(50, "Full name max length is 50 chars"),

  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[0-9+\-\s]{6,20}$/.test(v),
      "Invalid phone format"
    ),

  location: z.string().max(100).optional(),

  bio: z.string().max(500).optional(),

  facebook_url: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.startsWith("http"),
      "Facebook URL must be a valid link"
    ),

  instagram_url: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.startsWith("http"),
      "Instagram URL must be a valid link"
    ),

  avatarFile: z.any().optional(), // handled separately in upload
  avatarUrl: z.string().optional(),
};

/* -----------------------------------------------
   USER SCHEMA
------------------------------------------------- */
export const UserSettingsSchema = z.object({
  role: z.literal("client"),
  ...baseProfileSchema,
  categories: z.array(z.string()).optional(),
});

/* -----------------------------------------------
   HOST SCHEMA
------------------------------------------------- */
export const HostSettingsSchema = z.object({
  role: z.literal("host"),
  ...baseProfileSchema,
  categories: z.array(z.string()).min(1, "Select at least one category"),
});

/* -----------------------------------------------
   AUTO-SWITCHING SCHEMA (based on role)
------------------------------------------------- */
export const ProfileSettingsSchema = z.discriminatedUnion("role", [
  UserSettingsSchema,
  HostSettingsSchema,
]);
