"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevEnv = void 0;
const isDevEnv = () => process.env["NODE_ENV"] === 'dev';
exports.isDevEnv = isDevEnv;
