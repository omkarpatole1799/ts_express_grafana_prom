import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/api-error';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'node:console';
import { getDb } from '../utils/db.connect';

const errorHandler = async (
	err: Error,
	rq: Request,
	re: Response,
	nx: NextFunction,
) => {
	let status: number = 500;
	let errorId: string = uuidv4();
	let message: string = 'Unknown error';
	let stack: unknown = err?.stack;

	if (err instanceof ApiError) {
		status = err?.status;
		message = err?.message;
	} else if (err instanceof SyntaxError || err instanceof URIError) {
		status = 400;
		message = 'Unable to proces request';
	} else {
		log(`Error occured`, err);
		message = `Unknown error occured...`;
	}

	if (status >= 500) {
		// lets add the log to database
		// logs only 500+ errors
		try {
			await getDb()
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
		} catch (error) {
			log(`Logging to db failed`);
			if (error instanceof Error) {
				log(error?.message);
			} else {
				log('Unknown error while adding error log to db');
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

type ErrorData = {
	errorId?: string;
	uid?: string | number;
};

const sendErrorResponse = (
	res: Response,
	status: number,
	message: string,
	data?: ErrorData,
) => {
	res.status(status);
	res.json({
		message,
		data,
	});
};

export default errorHandler;
