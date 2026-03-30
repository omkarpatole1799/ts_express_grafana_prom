"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const indexRouter = express_1.default.Router();
indexRouter.post('/register', index_controller_1.register);
indexRouter.use('/auth', auth_routes_1.default);
exports.default = indexRouter;
