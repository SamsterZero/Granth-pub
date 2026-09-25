export interface ProblemDetails {
	type?: string;
	title?: string;
	status?: number;
	detail?: string;
	instance?: string;
	invalidParams?: Array<{ name: string; reason: string }>;
	[key: string]: unknown;
}

export class ApiError extends Error {
	status: number;
	problem?: ProblemDetails;

	constructor(status: number, message: string, problem?: ProblemDetails) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.problem = problem;
	}
}

export class ApiOfflineError extends Error {
	constructor(message = 'Granthalay API is offline or unreachable') {
		super(message);
		this.name = 'ApiOfflineError';
	}
}

export function getXsrfToken(): string | null {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
}

const getBaseUrl = (): string => {
	if (
		typeof import.meta !== 'undefined' &&
		import.meta.env &&
		import.meta.env.VITE_PUBLIC_API_URL
	) {
		return import.meta.env.VITE_PUBLIC_API_URL as string;
	}
	return '/api/v1';
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const baseUrl = getBaseUrl();
	const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
	const headers = new Headers(options.headers || {});

	if (!headers.has('Accept')) {
		headers.set('Accept', 'application/json, application/problem+json');
	}

	if (
		options.body &&
		!(options.body instanceof FormData) &&
		!headers.has('Content-Type') &&
		typeof options.body === 'string'
	) {
		headers.set('Content-Type', 'application/json');
	}

	const method = (options.method || 'GET').toUpperCase();
	if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
		const xsrfToken = getXsrfToken();
		if (xsrfToken && !headers.has('X-XSRF-TOKEN')) {
			headers.set('X-XSRF-TOKEN', xsrfToken);
		}
	}

	try {
		const response = await fetch(url, {
			...options,
			headers,
			credentials: options.credentials || 'include'
		});

		if (response.status === 204) {
			return {} as T;
		}

		const contentType = response.headers.get('content-type') || '';
		const isJson =
			contentType.includes('application/json') || contentType.includes('application/problem+json');

		if (!response.ok) {
			let problem: ProblemDetails | undefined;
			let errorMessage = `API request failed with status ${response.status}`;

			if (isJson) {
				try {
					problem = (await response.json()) as ProblemDetails;
					errorMessage = problem.detail || problem.title || errorMessage;
				} catch {
					// fallback if JSON parsing fails
				}
			}

			throw new ApiError(response.status, errorMessage, problem);
		}

		if (isJson) {
			return (await response.json()) as T;
		}

		return (await response.text()) as unknown as T;
	} catch (err) {
		if (err instanceof ApiError) {
			throw err;
		}

		if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
			throw new ApiOfflineError();
		}

		throw err;
	}
}
