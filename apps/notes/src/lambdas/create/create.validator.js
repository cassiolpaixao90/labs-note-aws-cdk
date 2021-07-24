import * as Joi from 'joi';

export const CreateSchema = {
	body: Joi.object().keys({
		description: Joi.string().max(100).required(),
	})
};