const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const Ok = (body) => ({
	statusCode: 200,
	body: JSON.stringify(body),
  headers
});

export const Created = (body) => ({
	statusCode: 201,
	body: JSON.stringify(body),
  headers
});

export const BadRequest = (error) => ({
	statusCode: 400,
	body: JSON.stringify({
		type: error.type,
		message: error.message,
		details: error.details
	}),
  headers
});

export const InternalServerError = (error) => ({
	statusCode: 500,
	body: JSON.stringify({
		message: error.message
	}),
  headers
});

export const NotFound = (error) => ({
	statusCode: 404,
	body: JSON.stringify({
		message: error.message
	}),
  headers
});

export const UnprocessableEntity = (error) => ({
	statusCode: 422,
	body: JSON.stringify({
		message: error.message
	}),
  headers
});