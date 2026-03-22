import { Request, Response } from 'express';
import ApiResponse from '../utils/api-response';
import tryCatch from '../utils/tryCatch';
import ApiError from '../utils/api-error';
import { getDb } from '../utils/db.connect';
import { log } from 'node:console';

export const login = tryCatch(async (rq: Request, rs: Response) => {
	const { username, password }: { username: string; password: string } =
		rq.body;

	log(`Login user ${username}`);

	if (!username || username?.trim() === '') {
		throw new ApiError(400, 'Invalid username');
	}

	if (
		!password ||
		password?.trim() === '' ||
		password?.trim()?.length <= 8 ||
		password?.trim()?.length >= 16
	) {
		throw new ApiError(400, 'Invalid password3');
	}

	const user = await getDb().collection('users').findOne({
		where: {
			username,
			password,
		},
	});
	console.log(user, 'user');

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	return new ApiResponse('Login successful', { user });
});
