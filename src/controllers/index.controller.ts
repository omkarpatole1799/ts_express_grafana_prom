import { log } from 'node:console';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import { getDb } from '../utils/db.connect';
import tryCatch from '../utils/tryCatch';

const register = tryCatch(async (req, res, next) => {
	const { username, age, password } = req.body;
	log(`Registering ${username}`);

	if (username?.trim() === '' || !username) {
		throw new ApiError(400, 'username required');
	}
	if (!age || isNaN(age) || age >= 60 || age <= 18) {
		throw new ApiError(400, 'Invalid age');
	}

	if (
		!password ||
		password?.trim() === '' ||
		password?.trim()?.length <= 8 ||
		password?.trim()?.length >= 16
	) {
		throw new ApiError(400, 'Invalid password');
	}

	const newUser = await getDb().collection('users').insertOne({
		username,
		age,
		password,
	});

	console.log(newUser, 'newUser');

	return new ApiResponse('Successfullr created new user', {
		userId: newUser.insertedId,
	});
});

export { register };
