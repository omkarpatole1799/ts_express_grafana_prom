"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const api_response_1 = __importDefault(require("../utils/api-response"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const api_error_1 = __importDefault(require("../utils/api-error"));
const db_connect_1 = require("../utils/db.connect");
const node_console_1 = require("node:console");
exports.login = (0, tryCatch_1.default)(async (rq, rs) => {
    const { username, password } = rq.body;
    (0, node_console_1.log)(`Login user ${username}`);
    if (!username || username?.trim() === '') {
        throw new api_error_1.default(400, 'Invalid username');
    }
    if (!password ||
        password?.trim() === '' ||
        password?.trim()?.length <= 8 ||
        password?.trim()?.length >= 16) {
        throw new api_error_1.default(400, 'Invalid password3');
    }
    const user = await (0, db_connect_1.getDb)().collection('users').findOne({
        where: {
            username,
            password,
        },
    });
    console.log(user, 'user');
    if (!user) {
        throw new api_error_1.default(404, 'User not found');
    }
    return new api_response_1.default('Login successful', { user });
});
