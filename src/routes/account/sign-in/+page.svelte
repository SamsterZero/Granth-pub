<script lang="ts">
	import { onMount } from 'svelte';
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
		Loader2
	} from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);

	let errorMessage = $state<string | null>(null);
	let isOffline = $state(false);
	let isExpired = $state(false);
	let isLoading = $state(false);

	onMount(async () => {
		if (page.url.searchParams.get('expired') === 'true' || authStore.isSessionExpired) {
			isExpired = true;
		}

		if (!authStore.hasInitialized) {
			await authStore.checkSession();
		}

		if (authStore.isAuthenticated) {
			const redirectTarget = page.url.searchParams.get('redirect') || '/submissions';
			await goto(redirectTarget);
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
				errorMessage = 'Granthalay API backend is unreachable. Please verify server connectivity.';
			} else if (err instanceof Error) {
				errorMessage = err.message || 'Invalid email or password. Please verify your credentials.';
			} else {
				errorMessage = 'Sign-in failed. Please try again.';
			}
		} finally {
			isLoading = false;
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
				<h1 class="text-sm font-bold tracking-tight text-foreground">Granthalay</h1>
				<span class="text-[10px] font-semibold tracking-wider text-primary uppercase"
					>Publisher Hub</span
				>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<ThemeToggle />
			<a
				href="https://samsterzero.github.io/Granthalay/store"
				target="_blank"
				rel="noreferrer"
				class="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
			>
				<span>Storefront</span>
				<ExternalLink class="h-3.5 w-3.5 text-muted-foreground" />
			</a>
		</div>
	</header>

	<!-- Main Sign-In Center Container -->
	<main class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
		<Card class="border-border bg-card shadow-lg">
			<CardHeader class="space-y-1 text-center">
				<div
					class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
				>
					<Lock class="h-6 w-6" />
				</div>
				<CardTitle class="text-xl font-bold tracking-tight sm:text-2xl">
					Publisher Sign In
				</CardTitle>
				<CardDescription class="text-xs text-muted-foreground">
					Enter your organization credentials to manage your publications, catalog, and royalties.
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-4">
				<!-- Session Expired Alert Banner -->
				{#if isExpired}
					<Alert
						variant="destructive"
						class="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200"
					>
						<Clock class="h-4 w-4 text-amber-600 dark:text-amber-400" />
						<AlertTitle class="text-xs font-semibold">Session Expired</AlertTitle>
						<AlertDescription class="text-xs">
							Your publisher session has expired. Please enter your credentials again to resume.
						</AlertDescription>
					</Alert>
				{/if}

				<!-- Backend Offline Alert Banner -->
				{#if isOffline}
					<Alert
						variant="destructive"
						class="border-destructive/40 bg-destructive/10 text-destructive"
					>
						<WifiOff class="h-4 w-4" />
						<AlertTitle class="text-xs font-semibold">Backend Unreachable</AlertTitle>
						<AlertDescription class="text-xs">
							Cannot connect to Granthalay API backend. Please ensure the server is running and
							reachable.
						</AlertDescription>
					</Alert>
				{/if}

				<!-- Invalid Credentials / General Error Alert Banner -->
				{#if errorMessage && !isOffline}
					<Alert
						variant="destructive"
						class="border-destructive/40 bg-destructive/10 text-destructive"
					>
						<AlertCircle class="h-4 w-4" />
						<AlertTitle class="text-xs font-semibold">Authentication Failed</AlertTitle>
						<AlertDescription class="text-xs">
							{errorMessage}
						</AlertDescription>
					</Alert>
				{/if}

				<!-- Sign-In Form -->
				<form onsubmit={handleSubmit} class="space-y-4">
					<div class="space-y-2">
						<Label for="email" class="text-xs font-medium">Organization Email</Label>
						<div class="relative">
							<Mail class="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="email"
								name="email"
								type="email"
								required
								autocomplete="email"
								placeholder="publisher@example.com"
								bind:value={email}
								class="pl-9 text-xs"
								disabled={isLoading}
							/>
						</div>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="password" class="text-xs font-medium">Password</Label>
						</div>
						<div class="relative">
							<Lock class="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="password"
								name="password"
								type="password"
								required
								autocomplete="current-password"
								placeholder="••••••••••••"
								bind:value={password}
								class="pl-9 text-xs"
								disabled={isLoading}
							/>
						</div>
					</div>

					<div class="flex items-center space-x-2 pt-1">
						<Checkbox id="rememberMe" bind:checked={rememberMe} disabled={isLoading} />
						<Label
							for="rememberMe"
							class="cursor-pointer text-xs font-normal text-muted-foreground select-none"
						>
							Remember this publisher device
						</Label>
					</div>

					<Button
						type="submit"
						class="w-full text-xs font-semibold"
						disabled={isLoading || !email || !password}
					>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Signing In...
						{:else}
							Sign In to Publisher Hub
						{/if}
					</Button>
				</form>
			</CardContent>

			<CardFooter class="flex flex-col border-t border-border bg-muted/10 px-6 py-3.5 text-center text-xs text-muted-foreground">
				<p>
					Don't have an organization account?
					<a href="/account/register" class="font-semibold text-primary hover:underline ml-1">
						Register as Publisher
					</a>
				</p>
			</CardFooter>
		</Card>
	</main>

	<!-- Footer -->
	<footer class="w-full text-center text-xs text-muted-foreground">
		<p>Granthalay Digital Publishing Network • Privacy-Preserving Independent Distribution</p>
	</footer>
</div>
