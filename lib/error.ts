/**
 * A representation of an API error.
 */
export default class ApiError extends Error {
	request: Request;
	response: Response;

	constructor(message: string, request: Request, response: Response) {
		super(message);
		this.name = "ApiError";
		this.request = request;
		this.response = response;
	}
}
