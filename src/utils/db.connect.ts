import { Db, MongoClient } from 'mongodb';
import { log } from 'node:console';

import * as dotenv from 'dotenv';
import ApiError from './api-error';
dotenv.config({
	path: './.env',
});

let db: Db;

const connectMongo = async (retries = 5) => {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const url = process.env.MONGO_URL as string;
			console.log(`Mongo URL: ${url}`);
			if (url?.trim() === '') {
				throw new ApiError(400, 'Invalid or no mongo url found');
			}
			const client = new MongoClient(url);
			log(`Connecting with mongo... (attempt ${attempt}/${retries})`);
			await client.connect();

			db = client.db(); // getting db
			log(`Connected with db`);
			return; // Success, exit the function
		} catch (error: unknown) {
			log(`Error connecting with db (attempt ${attempt}/${retries})`);
			if (error instanceof Error) {
				log(error?.message);
			} else {
				log(`Unknown error mongo connect`);
			}

			if (attempt === retries) {
				log(`Failed to connect after ${retries} attempts. Exiting...`);
				log(error);
				process.exit(1);
			}

			// Wait before retrying (exponential backoff)
			const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
			log(`Retrying in ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
};

export const getDb = () => {
	if (!db) throw new ApiError(404, 'No db connection found');
	return db;
};

export default connectMongo;
