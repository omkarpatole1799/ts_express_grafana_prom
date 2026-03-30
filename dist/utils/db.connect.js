"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
const mongodb_1 = require("mongodb");
const node_console_1 = require("node:console");
const dotenv = __importStar(require("dotenv"));
const api_error_1 = __importDefault(require("./api-error"));
dotenv.config({
    path: "./.env",
});
let db;
const connectMongo = async () => {
    try {
        const url = process.env.MONGO_URL;
        if (url?.trim() === "") {
            throw new api_error_1.default(400, "Invalid or no mongo url found");
        }
        const client = new mongodb_1.MongoClient(url, {
            tls: true,
        });
        (0, node_console_1.log)(`Connecting with mongo...`);
        await client.connect();
        db = client.db(); // getting db
        (0, node_console_1.log)(`Connected with db`);
    }
    catch (error) {
        (0, node_console_1.log)(`Error connecting with db`);
        if (error instanceof Error) {
            (0, node_console_1.log)(error?.message);
        }
        else {
            (0, node_console_1.log)(`Unknown error mongo connect. Process exit with status code 1`);
        }
        (0, node_console_1.log)(error);
        process.exit(1);
    }
};
const getDb = () => {
    if (!db)
        throw new api_error_1.default(404, "No db connection found");
    return db;
};
exports.getDb = getDb;
exports.default = connectMongo;
