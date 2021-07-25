import * as Joi from 'joi';

export const CreateSchema = {
	body: Joi.object().keys({
		title: Joi.string().max(100).required(),
	})
};