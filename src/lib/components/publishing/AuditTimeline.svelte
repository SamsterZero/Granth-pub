<script lang="ts">
	import type { PublishingAuditEventResponse } from '$lib/api/publishing';
	import { History } from 'lucide-svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		events: PublishingAuditEventResponse[];
	}

	let { events }: Props = $props();
</script>

<Card class="border-border bg-card">
	<CardHeader class="border-b border-border pb-3">
		<div class="flex items-center space-x-2">
			<History class="h-4 w-4 text-primary" />
			<CardTitle class="text-sm font-semibold text-card-foreground">
				Audit & Publishing Event Log
			</CardTitle>
		</div>
	</CardHeader>

	<CardContent class="pt-4">
		{#if events.length === 0}
			<div class="py-8 text-center text-xs text-muted-foreground">
				No audit events recorded yet for this submission.
			</div>
		{:else}
			<ol class="relative ml-3 space-y-4 border-l border-border">
				{#each events as event (event.id)}
					<li class="ml-4">
						<div
							class="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-background bg-primary"
						></div>
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<Badge
								variant="outline"
								class="w-fit text-[10px] font-semibold tracking-wider uppercase"
							>
								{event.action}
							</Badge>
							<time class="text-[11px] text-muted-foreground">
								{new Date(event.createdAt).toLocaleString()}
							</time>
						</div>
						<p class="mt-1 text-xs text-card-foreground">
							Performed by: <span class="font-medium">{event.performedBy}</span>
						</p>
						{#if event.details}
							<p class="mt-1.5 rounded-md bg-muted/60 p-2 font-mono text-xs text-muted-foreground">
								{event.details}
							</p>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</CardContent>
</Card>
