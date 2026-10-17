import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            // Supports Zod versions using "issues" or "errors".
            const issues = err.issues ?? err.errors ?? [];

            const errors = issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        next(err);
    }
};
