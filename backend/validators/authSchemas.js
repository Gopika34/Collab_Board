import { z } from "zod";

export const signupSchema = z.object({
    userName: z
        .string({ required_error: "Username is required" })
        .min(2, "Username must be at least 2 characters")
        .max(50, "Username must be at most 50 characters")
        .trim(),

    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters"),
});

export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
});
