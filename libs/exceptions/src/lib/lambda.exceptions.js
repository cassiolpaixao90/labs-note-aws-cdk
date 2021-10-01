class LambdaException extends Error {

	constructor({ type, message, details = [] }) {
		super();
		this.name = this.constructor.name;
		this.type = type;
		this.message = message;
		this.details = details;
    this.stack = this.stack;
	}
}

export class BadRequestException extends LambdaException {
	constructor(error) {
		const message = typeof error === 'string' ? error : error?.message || 'Bad Request';
		super({ type: 'BadRequest', message, details: error?.details });
	}
}

export class NotFoundException extends LambdaException {
	constructor(error) {
		const message = typeof error === 'string' ? error : error?.message || 'Not Found';
		super({ type: 'NotFound', message });
	}
}

export class BusinessException extends LambdaException {
	constructor(error) {
		const message = typeof error === 'string' ? error : error?.message || 'Business';
		super({ type: 'UnprocessableEntity', message });
	}
}