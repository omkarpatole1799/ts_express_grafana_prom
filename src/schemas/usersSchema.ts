import { Schema, model } from 'mongoose';
import { ROLES } from '../utils/constants.js';

const usersSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: [ROLES.ADMIN, ROLES.USER, ROLES.READER],
			default: ROLES.READER,
		},
	},
	{
		timestamps: true,
	},
);

export default model('Users', usersSchema);
