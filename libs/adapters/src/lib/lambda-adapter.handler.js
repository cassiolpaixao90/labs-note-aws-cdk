export const HandlerAdapter = (handler) => {
	return async (event, context) => {
		return handler.main(event, context);
	};
};