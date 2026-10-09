import { z } from "zod";

export const createCardSchema = z.object({
    title: z
        .string({ required_error: "Card title is required" })
        .min(1, "Card title cannot be empty")
        .max(200, "Card title must be at most 200 characters")
        .trim(),

    description: z
        .string()
        .max(2000, "Description must be at most 2000 characters")
        .trim()
        .optional()
        .default(""),

    listId: z
        .string({ required_error: "listId is required" })
        .regex(/^[a-f\d]{24}$/i, "Invalid listId"),

    order: z
        .number({ required_error: "order is required" })
        .int("order must be an integer")
        .min(0, "order must be non-negative"),
});

export const updateCardSchema = z.object({
    title: z
        .string()
        .min(1, "Card title cannot be empty")
        .max(200, "Card title must be at most 200 characters")
        .trim()
        .optional(),

    description: z
        .string()
        .max(2000, "Description must be at most 2000 characters")
        .trim()
        .optional(),

    listId: z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Invalid listId")
        .optional(),

    order: z
        .number()
        .int("order must be an integer")
        .min(0, "order must be non-negative")
        .optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
