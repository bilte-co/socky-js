export interface ApiErrorParams {
	message: string;
	status: number;
	url: string;
	code?: string;
	requestId?: string;
	retryAfterMs?: number;
	body?: unknown;
}

export class ApiError extends Error {
	readonly name = "ApiError";
	readonly status: number;
	readonly url: string;
	readonly code?: string;
	readonly requestId?: string;
	readonly retryAfterMs?: number;
	readonly body?: unknown;

	constructor(params: ApiErrorParams) {
		super(params.message);
		this.status = params.status;
		this.url = params.url;
		this.code = params.code;
		this.requestId = params.requestId;
		this.retryAfterMs = params.retryAfterMs;
		this.body = params.body;
	}
}
