import { apiFetch, ApiError, ApiOfflineError } from './client';
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

const DEV_STORAGE_KEY = 'granth_pub_dev_session';

class AuthState {
	user = $state<User | null>(null);
	publisher = $state<Publisher | null>(null);
	isLoading = $state(false);
	error = $state<string | null>(null);
	isOffline = $state(false);
	isSessionExpired = $state(false);

	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	constructor() {
		// Initialize from stored session in dev mode if available
		if (typeof window !== 'undefined') {
			this.restoreDevSession();
		}
	}

	private restoreDevSession(): void {
		try {
			const saved = localStorage.getItem(DEV_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed?.user) {
					this.user = parsed.user;
					this.publisher = parsed.publisher || null;
				}
			}
		} catch {
			// Ignore parse errors
		}
	}

	private saveDevSession(data: { user: User; publisher?: Publisher }): void {
		try {
			localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(data));
		} catch {
			// Ignore storage write errors
		}
	}

	private clearDevSession(): void {
		try {
			localStorage.removeItem(DEV_STORAGE_KEY);
		} catch {
			// Ignore storage remove errors
		}
	}

	/**
	 * Sign in publisher with email, password, and optional rememberMe flag.
	 * Invokes POST /api/v1/auth/sign-in with HttpOnly cookies & XSRF headers.
	 * In dev mode, provides seamless offline fallback for local verification.
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
			this.saveDevSession({ user: response.user, publisher: response.publisher });
			return response;
		} catch (err) {
			// In dev mode, provide fallback simulation if backend is offline or unconfigured
			if (
				import.meta.env.DEV &&
				(err instanceof ApiOfflineError || (err instanceof ApiError && err.status === 404))
			) {
				// Allow testing invalid credentials even in dev mode
				if (credentials.password === 'wrong' || credentials.password === 'invalid') {
					this.error = 'Invalid email or password. Please verify your credentials.';
					throw new ApiError(401, this.error);
				}

				// Otherwise simulate successful dev publisher sign-in
				const devResponse: SignInResponse = {
					user: {
						id: 'usr-dev-admin-1',
						email: credentials.email,
						name: 'Granthalay Press Publisher',
						role: 'ADMIN'
					},
					publisher: {
						id: 'pub-granthalay-press',
						legalName: 'Granthalay Press',
						imprintName: 'Granthalay Digital',
						contactEmail: credentials.email,
						primaryCountry: 'IN',
						defaultCurrency: 'INR',
						status: 'ACTIVE'
					},
					expiresAt: new Date(
						Date.now() + 86400000 * (credentials.rememberMe ? 30 : 1)
					).toISOString()
				};

				this.user = devResponse.user;
				this.publisher = devResponse.publisher || null;
				this.saveDevSession({ user: devResponse.user, publisher: devResponse.publisher });
				return devResponse;
			}

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
	 * Sign out current publisher, revoke session cookies, and clear state.
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
			this.clearDevSession();
			this.isLoading = false;
			await goto('/account/sign-in');
		}
	}

	/**
	 * Verify active session on app startup or navigation.
	 * Redirects to sign-in on session expiry.
	 */
	async checkSession(): Promise<boolean> {
		try {
			const response = await apiFetch<SignInResponse>('/auth/me');
			this.user = response.user;
			this.publisher = response.publisher || null;
			this.isSessionExpired = false;
			return true;
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				this.expireSession();
				return false;
			}
			// In dev mode, check if we have a valid restored session
			if (import.meta.env.DEV && this.user) {
				return true;
			}
			return false;
		}
	}

	/**
	 * Handle session expiry and redirect.
	 */
	expireSession(): void {
		this.user = null;
		this.publisher = null;
		this.isSessionExpired = true;
		this.clearDevSession();
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
