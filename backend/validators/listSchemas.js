import { z } from "zod";

export const createListSchema = z.object({
    title: z
        .string({ required_error: "List title is required" })
        .min(1, "List title cannot be empty")
        .max(100, "List title must be at most 100 characters")
        .trim(),

    boardId: z
        .string({ required_error: "boardId is required" })
        .regex(/^[a-f\d]{24}$/i, "Invalid boardId"),
});

export const updateListSchema = z.object({
    title: z
        .string({ required_error: "List title is required" })
        .min(1, "List title cannot be empty")
        .max(100, "List title must be at most 100 characters")
        .trim(),
});
