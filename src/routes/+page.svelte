<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/api/auth.svelte';
	import { BookOpen } from 'lucide-svelte';

	onMount(async () => {
		if (!authStore.hasInitialized) {
			await authStore.checkSession();
		}
		if (authStore.isAuthenticated) {
			await goto('/submissions');
		} else {
			await goto('/account/sign-in');
		}
	});
</script>

<div
	class="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 font-sans text-foreground antialiased"
>
	<div class="flex flex-col items-center space-y-4">
		<div
			class="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md"
		>
			<BookOpen class="h-6 w-6" />
		</div>
		<p class="text-xs font-medium text-muted-foreground">Redirecting to Publisher Hub...</p>
	</div>
</div>
