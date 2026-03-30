import projectConfigs from './configs';
import bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
	if (!password) {
		throw new Error('Invalid password1');
	}

	return new Promise((res, rej) => {
		bcrypt.hash(
			password,
			projectConfigs.saltRounds,
			function (err: Error | undefined, hash: string) {
				if (err) rej(err?.message || 'Unable to has password');
				res(hash);
			},
		);
	});
};

const comparePassword = (plainTextPassword: string, hashedPassword: string) => {
	if (!plainTextPassword || !hashedPassword) {
		throw new Error('Invalid password2');
	}

	return new Promise((res, rej) => {
		bcrypt.compare(
			plainTextPassword,
			hashedPassword,
			function (err: unknown, result: boolean) {
				if (err || !result) rej(false);
				res(result);
			},
		);
	});
};
