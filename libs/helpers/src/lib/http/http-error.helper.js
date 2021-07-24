import * as HttpHelpers from './http-response.helper';

export const makeHttpError = () => (error) => {
	const errors = ['BadRequest', 'InternalServerError', 'NotFound', 'UnprocessableEntity'];
	const response =
		(errors.includes(error.type) && HttpHelpers[error.type]) || HttpHelpers.InternalServerError;
	return response(error);
};