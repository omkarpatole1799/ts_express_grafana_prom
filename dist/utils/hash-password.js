"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("./configs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (password) => {
    if (!password) {
        throw new Error('Invalid password1');
    }
    return new Promise((res, rej) => {
        bcrypt_1.default.hash(password, configs_1.default.saltRounds, function (err, hash) {
            if (err)
                rej(err?.message || 'Unable to has password');
            res(hash);
        });
    });
};
const comparePassword = (plainTextPassword, hashedPassword) => {
    if (!plainTextPassword || !hashedPassword) {
        throw new Error('Invalid password2');
    }
    return new Promise((res, rej) => {
        bcrypt_1.default.compare(plainTextPassword, hashedPassword, function (err, result) {
            if (err || !result)
                rej(false);
            res(result);
        });
    });
};
