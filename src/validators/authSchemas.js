import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    role: z.enum(["client", "host"], {
      errorMap: () => ({ message: "Please select account type" }),
    }),

    full_name: z
      .string()
      .min(3, "Full name must be at least 3 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().min(1, "Please confirm password"),

    phone: z
      .string()
      .optional()
      .refine((v) => !v || /^[0-9\+\s\-]{9,15}$/.test(v), {
        message: "Invalid phone number",
      }),

    avatar: z.string().optional(),
    bio: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    location: z.string().optional(),

    categories: z.array(z.string()).default([]),
  })

  // 🔥 Password Matching
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

  // 🔥 Host requires at least 1 category
  .refine(
    (data) =>
      data.role === "client" ||
      (Array.isArray(data.categories) && data.categories.length > 0),
    {
      path: ["categories"],
      message: "Select at least one category for host",
    }
  );
