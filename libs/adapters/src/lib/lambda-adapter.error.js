export const ErrorHandlerAdapter = (fn) => ({
	onError: (handler, next) => {
		if (!handler.error) {
			return next();
		}

		handler.response = fn(handler.error);
		return next();
	}
});