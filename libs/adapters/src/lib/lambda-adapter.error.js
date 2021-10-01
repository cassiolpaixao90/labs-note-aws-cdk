export const ErrorHandlerAdapter = (fn) => ({
	onError: (handler) => {
		if (!handler.error) {
			return Promise.resolve();
		}

		handler.response = fn(handler.error);
		return Promise.resolve();
	}
});