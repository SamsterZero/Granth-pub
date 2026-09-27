<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authStore } from '$lib/api/auth.svelte';
	import { ApiOfflineError } from '$lib/api/client';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import {
		BookOpen,
		Lock,
		Mail,
		AlertCircle,
		WifiOff,
		Clock,
		ExternalLink,
		Loader2,
		Sparkles
	} from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);

	let errorMessage = $state<string | null>(null);
	let isOffline = $state(false);
	let isExpired = $state(false);
	let isLoading = $state(false);

	$effect(() => {
		if (page.url.searchParams.get('expired') === 'true' || authStore.isSessionExpired) {
			isExpired = true;
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = null;
		isOffline = false;
		isLoading = true;

		try {
			await authStore.signIn({ email, password, rememberMe });
			const redirectTarget = page.url.searchParams.get('redirect') || '/submissions';
			await goto(redirectTarget);
		} catch (err: unknown) {
			if (err instanceof ApiOfflineError) {
				isOffline = true;
			} else if (err instanceof Error) {
				errorMessage = err.message || 'Invalid email or password. Please verify your credentials.';
			} else {
				errorMessage = 'Sign-in failed. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	}

	function fillDevAccount(type: 'valid' | 'invalid' | 'offline') {
		if (type === 'valid') {
			email = 'admin@granthalay.org';
			password = 'publisher-dev-password-2026';
			rememberMe = true;
			errorMessage = null;
			isOffline = false;
		} else if (type === 'invalid') {
			email = 'admin@granthalay.org';
			password = 'wrong';
			rememberMe = false;
			errorMessage = null;
			isOffline = false;
		} else if (type === 'offline') {
			email = 'dev@offline-test.org';
			password = 'any-password';
			isOffline = true;
			errorMessage = null;
		}
	}
</script>

<svelte:head>
	<title>Sign In — Granthalay Publisher Hub</title>
</svelte:head>

<div
	class="relative flex min-h-screen w-full flex-col justify-between bg-background p-4 font-sans text-foreground antialiased sm:p-6 md:p-8"
>
	<!-- Top Navigation / Theme Toggle -->
	<header class="flex w-full items-center justify-between">
		<div class="flex items-center space-x-2.5">
			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
			>
				<BookOpen class="h-5 w-5" />
			</div>
			<div>
				<span class="text-sm font-bold tracking-tight text-foreground sm:text-base">Granthalay</span
				>
				<span class="ml-1 text-[10px] font-semibold tracking-wider text-primary uppercase"
					>Publisher Hub</span
				>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<Button
				variant="ghost"
				size="sm"
				href="https://samsterzero.github.io/Granthalay/store"
				target="_blank"
				rel="noreferrer"
				class="hidden text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
			>
				Storefront
				<ExternalLink class="ml-1 h-3 w-3" />
			</Button>
			<ThemeToggle />
		</div>
	</header>

	<!-- Main Auth Card -->
	<main class="mx-auto my-auto w-full max-w-md py-8">
		<Card class="border-border bg-card shadow-sm">
			<CardHeader class="space-y-1 text-center">
				<CardTitle class="text-2xl font-bold tracking-tight text-foreground">
					Sign in to your account
				</CardTitle>
				<CardDescription class="text-xs text-muted-foreground">
					Access manuscript review, scheduled releases, and sales analytics.
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-4">
				<!-- Session Expired Alert Banner -->
				{#if isExpired}
					<Alert
						variant="destructive"
						class="border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
					>
						<Clock class="h-4 w-4 text-amber-600 dark:text-amber-400" />
						<AlertTitle class="text-xs font-semibold">Session Expired</AlertTitle>
						<AlertDescription class="text-xs">
							Your publisher session has expired. Please sign in again to continue.
						</AlertDescription>
					</Alert>
				{/if}

				<!-- Connection Failure Alert Banner -->
				{#if isOffline}
					<Alert
						variant="destructive"
						class="border-destructive/40 bg-destructive/10 text-destructive"
					>
						<WifiOff class="h-4 w-4" />
						<AlertTitle class="text-xs font-semibold">Backend Unreachable</AlertTitle>
						<AlertDescription class="text-xs">
							Unable to connect to Granthalay API backend. Please check your network connection or
							verify the backend service is running.
						</AlertDescription>
					</Alert>
				{/if}

				<!-- Invalid Credentials Alert Banner -->
				{#if errorMessage}
					<Alert variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<AlertTitle class="text-xs font-semibold">Authentication Error</AlertTitle>
						<AlertDescription class="text-xs">
							{errorMessage}
						</AlertDescription>
					</Alert>
				{/if}

				<!-- Sign-in Form -->
				<form onsubmit={handleSubmit} class="space-y-4">
					<div class="space-y-1.5">
						<Label for="email" class="text-xs font-medium">Publisher Email</Label>
						<div class="relative">
							<Input
								id="email"
								type="email"
								autocomplete="email"
								placeholder="admin@granthalay.org"
								required
								bind:value={email}
								disabled={isLoading}
								class="pl-9 text-xs"
							/>
							<Mail
								class="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-muted-foreground"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<div class="flex items-center justify-between">
							<Label for="password" class="text-xs font-medium">Password</Label>
						</div>
						<div class="relative">
							<Input
								id="password"
								type="password"
								autocomplete="current-password"
								placeholder="••••••••••••"
								required
								bind:value={password}
								disabled={isLoading}
								class="pl-9 text-xs"
							/>
							<Lock
								class="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-muted-foreground"
							/>
						</div>
					</div>

					<!-- Remember Me Checkbox -->
					<div class="flex items-center space-x-2 pt-1">
						<Checkbox id="rememberMe" bind:checked={rememberMe} disabled={isLoading} />
						<Label
							for="rememberMe"
							class="cursor-pointer text-xs font-medium text-muted-foreground select-none"
						>
							Remember this device for 30 days
						</Label>
					</div>

					<Button type="submit" disabled={isLoading} class="h-10 w-full text-xs font-semibold">
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Signing In...
						{:else}
							Sign In to Publisher Hub
						{/if}
					</Button>
				</form>
			</CardContent>

			<!-- Dev Mode Quick Testing Panel -->
			{#if import.meta.env.DEV}
				<CardFooter class="flex flex-col gap-2.5 border-t border-border bg-muted/20 px-6 py-4">
					<div class="flex w-full items-center justify-between text-[11px] text-muted-foreground">
						<div class="flex items-center gap-1.5 font-medium text-foreground">
							<Sparkles class="h-3.5 w-3.5 text-primary" />
							<span>Dev Mode Testing</span>
						</div>
						<span class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Static PWA</span>
					</div>

					<div class="grid w-full grid-cols-2 gap-2">
						<Button
							variant="outline"
							size="sm"
							onclick={() => fillDevAccount('valid')}
							class="h-8 text-[11px] font-medium"
						>
							Fill Dev Publisher
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => fillDevAccount('invalid')}
							class="h-8 text-[11px] font-medium text-destructive hover:text-destructive"
						>
							Test Invalid Password
						</Button>
					</div>
				</CardFooter>
			{/if}
		</Card>
	</main>

	<!-- Footer -->
	<footer class="w-full text-center text-xs text-muted-foreground">
		<p>Granthalay Digital Publishing Network • Privacy-Preserving Independent Distribution</p>
	</footer>
</div>
