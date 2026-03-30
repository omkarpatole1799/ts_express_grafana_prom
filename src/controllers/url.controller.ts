import { Request, Response } from 'express';
import tryCatch from '../utils/tryCatch';
import ApiResponse from '../utils/api-response';
import { nanoid } from 'nanoid';
import { getDb } from '../utils/db.connect';

const shortUrl = tryCatch(async (rq: Request, rs: Response) => {
	const { url } = rq.body;

	const shortId = nanoid(7);

	const insertedUrl = await getDb().collection('Url').insertOne({
		originalUrl: url,
		shortUrl: shortId,
	});

	return new ApiResponse('Short URL created successfully', {
		shortUrl: insertedUrl,
	});
});

export { shortUrl };
