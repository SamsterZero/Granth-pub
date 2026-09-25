<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher';
	import { Sun, Moon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={toggleMode}
	title="Toggle theme"
	aria-label="Toggle theme"
	class="relative h-9 w-9 text-muted-foreground hover:text-foreground"
>
	<Sun
		class="h-4 w-4 scale-100 rotate-0 transition-all duration-200 dark:scale-0 dark:-rotate-90"
	/>
	<Moon
		class="absolute h-4 w-4 scale-0 rotate-90 transition-all duration-200 dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
