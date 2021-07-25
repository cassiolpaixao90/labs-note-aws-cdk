
import { BadRequestException } from '@labs-sample-aws-cdk/exceptions';

export const ValidatorAdapter = ({ schema, keys = [] }) => ({
	before: async (handler) => {
			if (!schema) {
				return Promise.resolve();
			}

			const schemaOptions = { abortEarly: false, convert: false };

			const errors = [];
			keys.forEach((key) => {
				const { error } = schema[key].validate(handler.event[key], schemaOptions);
				if (error) {
					errors.push(...error.details);
				}
			});

			if (errors.length) {
				throw new BadRequestException({
					message: 'ValidationError',
					details: errors
				});
			}

			return Promise.resolve();
	}
});