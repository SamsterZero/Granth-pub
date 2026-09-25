<script lang="ts">
	import type { ValidationReport } from '$lib/validation/epub';
	import {
		CheckCircle2,
		AlertTriangle,
		XCircle,
		ChevronDown,
		ChevronUp,
		BookOpen
	} from 'lucide-svelte';

	interface Props {
		report: ValidationReport;
	}

	let { report }: Props = $props();
	let isExpanded = $state(true);

	const badgeStyles = {
		VALID: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
		WARNINGS: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
		BLOCKED: 'bg-red-500/15 text-red-300 border-red-500/30'
	};

	const iconMap = {
		VALID: CheckCircle2,
		WARNINGS: AlertTriangle,
		BLOCKED: XCircle
	};

	const StatusIcon = $derived(iconMap[report.status]);
</script>

<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm">
	<div class="flex items-center justify-between border-b border-zinc-800 pb-4">
		<div class="flex items-center space-x-3">
			<StatusIcon
				class="h-6 w-6 {report.status === 'VALID'
					? 'text-emerald-400'
					: report.status === 'WARNINGS'
						? 'text-amber-400'
						: 'text-red-400'}"
			/>
			<div>
				<h3 class="text-sm font-semibold text-zinc-100">EPUB Pre-Flight Validation</h3>
				<p class="text-xs text-zinc-400">
					{report.status === 'VALID'
						? 'All packaging and schema checks passed'
						: report.status === 'WARNINGS'
							? 'Passed with non-blocking warnings'
							: 'Conformance issues blocked publication'}
				</p>
			</div>
		</div>

		<div class="flex items-center space-x-3">
			<span
				class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase {badgeStyles[
					report.status
				]}"
			>
				{report.status}
			</span>
			<button
				type="button"
				onclick={() => (isExpanded = !isExpanded)}
				class="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
				aria-expanded={isExpanded}
				aria-label="Toggle details"
			>
				{#if isExpanded}
					<ChevronUp class="h-4 w-4" />
				{:else}
					<ChevronDown class="h-4 w-4" />
				{/if}
			</button>
		</div>
	</div>

	{#if isExpanded}
		<div class="mt-4 space-y-4">
			<!-- Manifest & Spine Stats -->
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3">
					<span class="text-xs text-zinc-400">Manifest Items</span>
					<p class="mt-1 text-base font-semibold text-zinc-200">{report.manifestItemCount}</p>
				</div>
				<div class="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3">
					<span class="text-xs text-zinc-400">Spine Items</span>
					<p class="mt-1 text-base font-semibold text-zinc-200">{report.spineItemCount}</p>
				</div>
				<div class="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3">
					<span class="text-xs text-zinc-400">Cover Artwork</span>
					<p
						class="mt-1 text-base font-semibold {report.hasCover
							? 'text-emerald-400'
							: 'text-zinc-400'}"
					>
						{report.hasCover ? 'Detected' : 'None'}
					</p>
				</div>
				<div class="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3">
					<span class="text-xs text-zinc-400">TOC Entries</span>
					<p class="mt-1 text-base font-semibold text-zinc-200">{report.toc.length}</p>
				</div>
			</div>

			<!-- Errors and Warnings List -->
			{#if report.errors.length > 0}
				<div class="space-y-2">
					<h4 class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
						Inspection Details
					</h4>
					<div class="space-y-2">
						{#each report.errors as err (err.field)}
							<div
								class="flex items-start space-x-2.5 rounded-lg border p-3 text-xs {err.severity ===
								'error'
									? 'border-red-500/20 bg-red-500/10 text-red-300'
									: 'border-amber-500/20 bg-amber-500/10 text-amber-300'}"
							>
								{#if err.severity === 'error'}
									<XCircle class="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
								{:else}
									<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
								{/if}
								<div>
									<span class="font-semibold text-zinc-200">[{err.field}]:</span>
									<span class="ml-1">{err.message}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Table of contents sample -->
			{#if report.toc.length > 0}
				<div>
					<h4
						class="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-400 uppercase"
					>
						<BookOpen class="h-3.5 w-3.5" />
						Extracted Table of Contents
					</h4>
					<div
						class="mt-2 max-h-36 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/40 p-2.5"
					>
						<ul class="space-y-1 text-xs text-zinc-300">
							{#each report.toc as item (item.href)}
								<li class="truncate py-0.5 hover:text-white">
									• {item.title}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
