import { ApiError } from "@lib/error";

export type HttpRequest = (
	path: string,
	init?: RequestInit & { timeoutMs?: number },
) => Promise<Response>;

export function parseRetryAfter(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number.parseInt(header, 10);
	if (!Number.isNaN(seconds)) return seconds * 1000;
	const date = new Date(header);
	if (!Number.isNaN(date.getTime())) {
		return Math.max(0, date.getTime() - Date.now());
	}
	return undefined;
}

export function jitterDelay(
	baseMs: number,
	attempt: number,
	retryAfterMs?: number,
): number {
	if (retryAfterMs != null) return retryAfterMs;
	const exponential = baseMs * 2 ** attempt;
	const jitter = Math.random() * 0.3 * exponential;
	return exponential + jitter;
}

export function shouldRetry(res: Response): boolean {
	return (
		res.status === 429 ||
		res.status === 503 ||
		res.status === 504 ||
		res.status >= 500
	);
}

export function isRetryableNetworkError(err: unknown): boolean {
	if (err instanceof TypeError) return true;
	if (err instanceof DOMException && err.name === "AbortError") return false;
	return false;
}

export async function toApiError(
	url: string,
	res: Response,
): Promise<ApiError> {
	const requestId = res.headers.get("x-request-id") || undefined;
	const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));

	let body: unknown;
	let message = res.statusText || `HTTP ${res.status}`;

	try {
		const contentType = res.headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			body = await res.json();
			if (
				typeof body === "object" &&
				body != null &&
				"error" in body &&
				typeof body.error === "string"
			) {
				message = body.error;
			}
		} else {
			const text = await res.text();
			if (text) {
				message = text.slice(0, 200);
				body = text;
			}
		}
	} catch {
		// Ignore parsing errors
	}

	let code: string | undefined;
	if (
		typeof body === "object" &&
		body != null &&
		"code" in body &&
		typeof body.code === "string"
	) {
		code = body.code;
	}

	return new ApiError({
		message,
		status: res.status,
		url,
		code,
		requestId,
		retryAfterMs,
		body,
	});
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseJson<T>(res: Response): Promise<T> {
	const contentLength = res.headers.get("content-length");
	if (contentLength === "0") {
		return undefined as T;
	}

	const contentType = res.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		throw new Error(
			`Expected JSON response but got ${contentType || "unknown content type"}`,
		);
	}

	return res.json();
}

export function addIfDefined(
	params: URLSearchParams,
	key: string,
	value: unknown,
): void {
	if (value !== undefined && value !== null) {
		params.set(key, String(value));
	}
}
