import dotenv from 'dotenv';
dotenv.config();

const projectConfigs = {
	saltRounds: process.env['SALT_ROUNDS'] || 10,
};

export default projectConfigs;
