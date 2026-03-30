"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("../utils/api-error"));
const uuid_1 = require("uuid");
const node_console_1 = require("node:console");
const db_connect_1 = require("../utils/db.connect");
const errorHandler = async (err, rq, re, nx) => {
    let status = 500;
    let errorId = (0, uuid_1.v4)();
    let message = 'Unknown error';
    let stack = err?.stack;
    if (err instanceof api_error_1.default) {
        status = err?.status;
        message = err?.message;
    }
    else if (err instanceof SyntaxError || err instanceof URIError) {
        status = 400;
        message = 'Unable to proces request';
    }
    else {
        (0, node_console_1.log)(`Error occured`, err);
        message = `Unknown error occured...`;
    }
    if (status >= 500) {
        // lets add the log to database
        // logs only 500+ errors
        try {
            await (0, db_connect_1.getDb)()
                .collection('errors')
                .insertOne({
                errorId,
                endPoint: rq.originalUrl,
                url: rq.url,
                method: rq.method,
                status,
                stack,
                body: rq.body ?? {},
                timestamp: Date.now(),
                istTimeStamp: new Date().toLocaleString(),
            });
        }
        catch (error) {
            (0, node_console_1.log)(`Logging to db failed`);
            if (error instanceof Error) {
                (0, node_console_1.log)(error?.message);
            }
            else {
                (0, node_console_1.log)('Unknown error while adding error log to db');
            }
        }
    }
    if (status < 500) {
        errorId = '';
    }
    sendErrorResponse(re, status, message, {
        errorId,
    });
};
const sendErrorResponse = (res, status, message, data) => {
    res.status(status);
    res.json({
        message,
        data,
    });
};
exports.default = errorHandler;
