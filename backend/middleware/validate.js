import { ZodError } from "zod";

/**
 * Generic Zod validation middleware factory.
 * Validates req.body against the provided schema.
 * Returns 400 with structured field errors on failure.
 *
 * @param {import("zod").ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const errors = err.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }
        next(err);
    }
};
