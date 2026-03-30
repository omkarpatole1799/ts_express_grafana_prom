"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const node_console_1 = require("node:console");
const api_error_1 = __importDefault(require("../utils/api-error"));
const api_response_1 = __importDefault(require("../utils/api-response"));
const db_connect_1 = require("../utils/db.connect");
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const register = (0, tryCatch_1.default)(async (req, res, next) => {
    const { username, age, password } = req.body;
    (0, node_console_1.log)(`Registering ${username}`);
    if (username?.trim() === '' || !username) {
        throw new api_error_1.default(400, 'username required');
    }
    if (!age || isNaN(age) || age >= 60 || age <= 18) {
        throw new api_error_1.default(400, 'Invalid age');
    }
    if (!password ||
        password?.trim() === '' ||
        password?.trim()?.length <= 8 ||
        password?.trim()?.length >= 16) {
        throw new api_error_1.default(400, 'Invalid password');
    }
    const newUser = await (0, db_connect_1.getDb)().collection('users').insertOne({
        username,
        age,
        password,
    });
    console.log(newUser, 'newUser');
    return new api_response_1.default('Successfullr created new user', {
        userId: newUser.insertedId,
    });
});
exports.register = register;
