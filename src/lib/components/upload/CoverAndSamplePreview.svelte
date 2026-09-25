<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';

	interface Props {
		coverBlob?: Blob;
		sampleHtml?: string;
		title: string;
		author: string;
	}

	let { coverBlob, sampleHtml, title, author }: Props = $props();

	let coverUrl = $state<string | null>(null);

	$effect(() => {
		if (coverBlob) {
			const url = URL.createObjectURL(coverBlob);
			coverUrl = url;
			return () => {
				URL.revokeObjectURL(url);
			};
		} else {
			coverUrl = null;
		}
	});
</script>

<Card class="border-border bg-card">
	<CardHeader class="border-b border-border pb-3">
		<CardTitle class="text-sm font-semibold text-card-foreground">
			Artwork & Sample Preview
		</CardTitle>
	</CardHeader>

	<CardContent class="pt-4">
		<div class="flex flex-col gap-6 md:flex-row">
			<!-- Cover Image Preview -->
			<div class="flex flex-col items-center">
				<div
					class="relative flex h-56 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40 shadow-sm 2xl:h-64 2xl:w-44"
				>
					{#if coverUrl}
						<img src={coverUrl} alt="Cover for {title}" class="h-full w-full object-cover" />
					{:else}
						<div class="p-4 text-center">
							<span class="text-xs text-muted-foreground">No cover artwork found</span>
						</div>
					{/if}
				</div>
				<span class="mt-2 text-xs text-muted-foreground">Cover Artwork</span>
			</div>

			<!-- Book Info & Sample Preview Excerpt -->
			<div class="flex-1 space-y-3">
				<div>
					<h4 class="text-base font-bold text-card-foreground 2xl:text-lg">
						{title || 'Untitled Book'}
					</h4>
					<p class="text-xs text-muted-foreground 2xl:text-sm">By {author || 'Unknown Author'}</p>
				</div>

				<div class="mt-3">
					<h5 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						First Chapter Excerpt
					</h5>
					<div
						class="prose-xs prose mt-2 max-h-56 max-w-none overflow-y-auto rounded-xl border border-border bg-muted/20 p-4 text-card-foreground 2xl:max-h-80 dark:prose-invert"
					>
						{#if sampleHtml}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html sampleHtml}
						{:else}
							<p class="text-muted-foreground italic">No excerpt content available</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
