import { Schema, model } from 'mongoose';

const urlSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		required: false,
	},
	originalUrl: {
		type: String,
		required: true,
		trim: true,
	},
	shortUrl: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	expiresAt: {
		type: Date,
		required: true,
		index: { expires: 10 },
	},
});

export default model('Url', urlSchema);
