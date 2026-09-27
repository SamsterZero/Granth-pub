import { apiFetch, ApiError, ApiOfflineError, setUnauthorizedHandler } from './client';
import { goto } from '$app/navigation';

export interface User {
	id: string;
	email: string;
	name?: string;
	role?: 'ADMIN' | 'EDITOR' | 'VIEWER' | string;
}

export interface Publisher {
	id: string;
	legalName: string;
	imprintName?: string;
	contactEmail: string;
	primaryCountry?: string;
	defaultCurrency?: string;
	status: string;
}

export interface SignInCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface SignInResponse {
	user: User;
	publisher?: Publisher;
	expiresAt?: string;
}

export class AuthState {
	user = $state<User | null>(null);
	publisher = $state<Publisher | null>(null);
	isLoading = $state(false);
	isCheckingSession = $state(false);
	hasInitialized = $state(false);
	error = $state<string | null>(null);
	isOffline = $state(false);
	isSessionExpired = $state(false);

	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	constructor() {
		if (typeof window !== 'undefined') {
			setUnauthorizedHandler(() => this.expireSession());
		}
	}

	/**
	 * Sign in publisher with email, password, and optional rememberMe flag.
	 * Dispatches POST /api/v1/auth/sign-in with HttpOnly cookies & XSRF headers.
	 * Strictly verifies against backend API with zero client-side bypasses.
	 */
	async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
		this.isLoading = true;
		this.error = null;
		this.isOffline = false;
		this.isSessionExpired = false;

		try {
			const response = await apiFetch<SignInResponse>('/auth/sign-in', {
				method: 'POST',
				body: JSON.stringify(credentials)
			});

			this.user = response.user;
			this.publisher = response.publisher || null;
			this.hasInitialized = true;
			return response;
		} catch (err) {
			this.user = null;
			this.publisher = null;

			if (err instanceof ApiOfflineError) {
				this.isOffline = true;
				this.error = 'Granthalay API backend is unreachable. Please verify server connectivity.';
				throw err;
			}

			if (err instanceof ApiError) {
				if (err.status === 401) {
					this.error = 'Invalid email or password. Please verify your credentials.';
				} else {
					this.error = err.message || 'An error occurred during sign-in.';
				}
				throw err;
			}

			this.error = err instanceof Error ? err.message : 'Sign-in failed.';
			throw err;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Sign out current publisher, revoke session cookies on backend, and clear local state.
	 */
	async signOut(): Promise<void> {
		this.isLoading = true;
		try {
			await apiFetch('/auth/sign-out', { method: 'POST' }).catch(() => {
				// Best effort signOut
			});
		} finally {
			this.user = null;
			this.publisher = null;
			this.isLoading = false;
			if (typeof window !== 'undefined') {
				await goto('/account/sign-in');
			}
		}
	}

	/**
	 * Verify active session on app startup or navigation via backend session endpoints.
	 * Checks GET /api/v1/auth/session (falling back to /auth/me).
	 * If session cookie is valid, populates user and publisher.
	 * If invalid/expired or connection fails, resets user state.
	 */
	async checkSession(): Promise<boolean> {
		this.isCheckingSession = true;
		this.error = null;
		this.isOffline = false;

		try {
			const response = await apiFetch<SignInResponse>('/auth/me');
			this.user = response.user;
			this.publisher = response.publisher || null;
			this.isSessionExpired = false;
			return true;
		} catch (err) {
			this.user = null;
			this.publisher = null;

			if (err instanceof ApiOfflineError) {
				this.isOffline = true;
			} else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
				// Cookie was absent, expired, or access is unauthenticated
			}
			return false;
		} finally {
			this.isCheckingSession = false;
			this.hasInitialized = true;
		}
	}

	/**
	 * Handle session expiry and redirect to sign-in page.
	 */
	expireSession(): void {
		this.user = null;
		this.publisher = null;
		this.isSessionExpired = true;
		if (typeof window !== 'undefined') {
			goto('/account/sign-in?expired=true');
		}
	}

	clearError(): void {
		this.error = null;
		this.isOffline = false;
	}
}

export const authStore = new AuthState();
