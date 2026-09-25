<script lang="ts">
	import type { PublishingAuditEventResponse } from '$lib/api/publishing';
	import { History } from 'lucide-svelte';

	interface Props {
		events: PublishingAuditEventResponse[];
	}

	let { events }: Props = $props();
</script>

<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
	<div class="flex items-center space-x-2 border-b border-zinc-800 pb-3">
		<History class="h-4 w-4 text-zinc-400" />
		<h3 class="text-sm font-semibold text-zinc-100">Audit & Publishing Event Log</h3>
	</div>

	{#if events.length === 0}
		<div class="py-8 text-center text-xs text-zinc-500">
			No audit events recorded yet for this submission.
		</div>
	{:else}
		<ol class="relative mt-4 ml-3 space-y-4 border-l border-zinc-800">
			{#each events as event (event.id)}
				<li class="ml-4">
					<div
						class="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-zinc-900 bg-indigo-500"
					></div>
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<span class="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
							{event.action}
						</span>
						<time class="text-[11px] text-zinc-500">
							{new Date(event.createdAt).toLocaleString()}
						</time>
					</div>
					<p class="mt-0.5 text-xs text-zinc-300">
						Performed by: <span class="font-medium text-zinc-200">{event.performedBy}</span>
					</p>
					{#if event.details}
						<p class="mt-1 rounded bg-zinc-950/60 p-2 font-mono text-xs text-zinc-400">
							{event.details}
						</p>
					{/if}
				</li>
			{/each}
		</ol>
	{/if}
</div>
