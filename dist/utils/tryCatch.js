"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryCatch = (fn) => {
    return async (req, res, next) => {
        try {
            const result = await fn(req, res, next);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = tryCatch;
