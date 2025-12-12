"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
// --------------------------------------------------
// Generic Zod Validation Middleware
// --------------------------------------------------
const validate = (schema) => (req, res, next) => {
    try {
        // Safely parse body→ returns typed T
        const parsed = schema.parse(req.body);
        req.body = parsed; // ✔ now body is type-safe everywhere
        return next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: err.issues, // <-- use .issues
            });
        }
    }
};
exports.validate = validate;
//# sourceMappingURL=validationMiddleware.js.map