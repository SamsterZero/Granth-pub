import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthState } from './auth.svelte';
import { ApiError, ApiOfflineError } from './client';
import * as client from './client';

describe('AuthState & Cookie Session Store', () => {
	let auth: AuthState;

	beforeEach(() => {
		vi.restoreAllMocks();
		auth = new AuthState();
	});

	it('initializes in an unauthenticated state with no bypasses', () => {
		expect(auth.user).toBeNull();
		expect(auth.publisher).toBeNull();
		expect(auth.isAuthenticated).toBe(false);
		expect(auth.isLoading).toBe(false);
		expect(auth.isCheckingSession).toBe(false);
		expect(auth.hasInitialized).toBe(false);
		expect(auth.error).toBeNull();
		expect(auth.isOffline).toBe(false);
		expect(auth.isSessionExpired).toBe(false);
	});

	it('successfully signs in with backend API response', async () => {
		const mockResponse = {
			user: {
				id: 'usr-1',
				email: 'publisher@granthalay.org',
				name: 'Test Publisher',
				role: 'ADMIN'
			},
			publisher: {
				id: 'pub-1',
				legalName: 'Acme Publishing',
				imprintName: 'Acme Classics',
				contactEmail: 'publisher@granthalay.org',
				primaryCountry: 'IN',
				defaultCurrency: 'INR',
				status: 'ACTIVE'
			},
			expiresAt: '2026-10-01T00:00:00Z'
		};

		vi.spyOn(client, 'apiFetch').mockResolvedValueOnce(mockResponse);

		const result = await auth.signIn({
			email: 'publisher@granthalay.org',
			password: 'secure-password',
			rememberMe: true
		});

		expect(result).toEqual(mockResponse);
		expect(auth.user).toEqual(mockResponse.user);
		expect(auth.publisher).toEqual(mockResponse.publisher);
		expect(auth.isAuthenticated).toBe(true);
		expect(auth.error).toBeNull();
		expect(auth.isOffline).toBe(false);
	});

	it('rejects sign-in and stays unauthenticated when backend returns 401', async () => {
		vi.spyOn(client, 'apiFetch').mockRejectedValueOnce(
			new ApiError(401, 'Unauthorized', { detail: 'Bad credentials' })
		);

		await expect(
			auth.signIn({
				email: 'publisher@granthalay.org',
				password: 'wrong-password'
			})
		).rejects.toThrow(ApiError);

		expect(auth.user).toBeNull();
		expect(auth.publisher).toBeNull();
		expect(auth.isAuthenticated).toBe(false);
		expect(auth.error).toContain('Invalid email or password');
		expect(auth.isLoading).toBe(false);
	});

	it('handles backend offline error and stays unauthenticated', async () => {
		vi.spyOn(client, 'apiFetch').mockRejectedValueOnce(new ApiOfflineError());

		await expect(
			auth.signIn({
				email: 'publisher@granthalay.org',
				password: 'any-password'
			})
		).rejects.toThrow(ApiOfflineError);

		expect(auth.user).toBeNull();
		expect(auth.publisher).toBeNull();
		expect(auth.isAuthenticated).toBe(false);
		expect(auth.isOffline).toBe(true);
		expect(auth.error).toContain('unreachable');
		expect(auth.isLoading).toBe(false);
	});

	it('verifies active session via backend /auth/me', async () => {
		const mockSession = {
			user: {
				id: 'usr-2',
				email: 'editor@granthalay.org',
				role: 'EDITOR'
			},
			publisher: {
				id: 'pub-2',
				legalName: 'Heritage Books',
				contactEmail: 'editor@granthalay.org',
				status: 'ACTIVE'
			}
		};

		vi.spyOn(client, 'apiFetch').mockResolvedValueOnce(mockSession);

		const isValid = await auth.checkSession();

		expect(isValid).toBe(true);
		expect(auth.user).toEqual(mockSession.user);
		expect(auth.publisher).toEqual(mockSession.publisher);
		expect(auth.isAuthenticated).toBe(true);
		expect(auth.hasInitialized).toBe(true);
	});

	it('resets user state when checkSession receives 401 or 403', async () => {
		vi.spyOn(client, 'apiFetch').mockRejectedValueOnce(
			new ApiError(403, 'Forbidden')
		);

		const isValid = await auth.checkSession();

		expect(isValid).toBe(false);
		expect(auth.user).toBeNull();
		expect(auth.publisher).toBeNull();
		expect(auth.isAuthenticated).toBe(false);
		expect(auth.hasInitialized).toBe(true);
	});

	it('clears state on signOut', async () => {
		auth.user = { id: 'usr-1', email: 'test@example.com' };
		auth.publisher = {
			id: 'pub-1',
			legalName: 'Test Pub',
			contactEmail: 'test@example.com',
			status: 'ACTIVE'
		};

		vi.spyOn(client, 'apiFetch').mockResolvedValueOnce({});

		await auth.signOut();

		expect(auth.user).toBeNull();
		expect(auth.publisher).toBeNull();
		expect(auth.isAuthenticated).toBe(false);
	});

	it('expires session and flags isSessionExpired', () => {
		auth.user = { id: 'usr-1', email: 'test@example.com' };
		auth.publisher = {
			id: 'pub-1',
			legalName: 'Test Pub',
			contactEmail: 'test@example.com',
			status: 'ACTIVE'
		};

		auth.expireSession();

		expect(auth.user).toBeNull();
		expect(auth.publisher).toBeNull();
		expect(auth.isAuthenticated).toBe(false);
		expect(auth.isSessionExpired).toBe(true);
	});
});
