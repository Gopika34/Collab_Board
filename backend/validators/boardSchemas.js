import { z } from "zod";

export const createBoardSchema = z.object({
    title: z
        .string({ required_error: "Board title is required" })
        .min(1, "Board title cannot be empty")
        .max(100, "Board title must be at most 100 characters")
        .trim(),
});

export const updateBoardSchema = z.object({
    title: z
        .string({ required_error: "Board title is required" })
        .min(1, "Board title cannot be empty")
        .max(100, "Board title must be at most 100 characters")
        .trim(),
});
