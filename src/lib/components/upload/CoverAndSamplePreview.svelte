<script lang="ts">
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

<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm">
	<h3 class="border-b border-zinc-800 pb-3 text-sm font-semibold text-zinc-100">
		Artwork & Sample Preview
	</h3>

	<div class="mt-4 flex flex-col gap-6 md:flex-row">
		<!-- Cover Image Preview -->
		<div class="flex flex-col items-center">
			<div
				class="relative flex h-56 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-md"
			>
				{#if coverUrl}
					<img src={coverUrl} alt="Cover for {title}" class="h-full w-full object-cover" />
				{:else}
					<div class="p-4 text-center">
						<span class="text-xs text-zinc-500">No cover artwork found</span>
					</div>
				{/if}
			</div>
			<span class="mt-2 text-xs text-zinc-400">Cover Artwork</span>
		</div>

		<!-- Book Info & Sample Preview Excerpt -->
		<div class="flex-1 space-y-3">
			<div>
				<h4 class="text-base font-bold text-zinc-100">{title || 'Untitled Book'}</h4>
				<p class="text-xs text-zinc-400">By {author || 'Unknown Author'}</p>
			</div>

			<div class="mt-3">
				<h5 class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
					First Chapter Excerpt
				</h5>
				<div
					class="prose-xs prose mt-2 max-h-56 max-w-none overflow-y-auto rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 text-zinc-300 prose-invert"
				>
					{#if sampleHtml}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html sampleHtml}
					{:else}
						<p class="text-zinc-500 italic">No excerpt content available</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
