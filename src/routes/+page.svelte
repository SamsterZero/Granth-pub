<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/submissions');
	});
</script>

<div class="flex h-screen items-center justify-center bg-zinc-950 text-xs text-zinc-400">
	Redirecting to Publisher Hub...
</div>
