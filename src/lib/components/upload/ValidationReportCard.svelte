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
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';

	interface Props {
		report: ValidationReport;
	}

	let { report }: Props = $props();
	let isExpanded = $state(true);

	const badgeVariant = $derived.by(() => {
		switch (report.status) {
			case 'VALID':
				return 'default';
			case 'WARNINGS':
				return 'secondary';
			case 'BLOCKED':
				return 'destructive';
			default:
				return 'outline';
		}
	});

	const iconMap = {
		VALID: CheckCircle2,
		WARNINGS: AlertTriangle,
		BLOCKED: XCircle
	};

	const StatusIcon = $derived(iconMap[report.status]);
</script>

<Card class="border-border bg-card">
	<CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
		<div class="flex items-center space-x-3">
			<StatusIcon
				class="h-6 w-6 {report.status === 'VALID'
					? 'text-emerald-500'
					: report.status === 'WARNINGS'
						? 'text-amber-500'
						: 'text-destructive'}"
			/>
			<div>
				<CardTitle class="text-sm font-semibold text-card-foreground">
					EPUB Pre-Flight Validation
				</CardTitle>
				<CardDescription class="text-xs text-muted-foreground">
					{report.status === 'VALID'
						? 'All packaging and schema checks passed'
						: report.status === 'WARNINGS'
							? 'Passed with non-blocking warnings'
							: 'Conformance issues blocked publication'}
				</CardDescription>
			</div>
		</div>

		<div class="flex items-center space-x-3">
			<Badge variant={badgeVariant} class="tracking-wider uppercase">
				{report.status}
			</Badge>
			<Button
				variant="ghost"
				size="icon"
				onclick={() => (isExpanded = !isExpanded)}
				class="h-8 w-8 text-muted-foreground"
				aria-expanded={isExpanded}
				aria-label="Toggle details"
			>
				{#if isExpanded}
					<ChevronUp class="h-4 w-4" />
				{:else}
					<ChevronDown class="h-4 w-4" />
				{/if}
			</Button>
		</div>
	</CardHeader>

	{#if isExpanded}
		<CardContent class="space-y-4 pt-4">
			<!-- Manifest & Spine Stats -->
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="rounded-xl border border-border bg-muted/40 p-3">
					<span class="text-xs text-muted-foreground">Manifest Items</span>
					<p class="mt-1 text-base font-semibold text-card-foreground">
						{report.manifestItemCount}
					</p>
				</div>
				<div class="rounded-xl border border-border bg-muted/40 p-3">
					<span class="text-xs text-muted-foreground">Spine Items</span>
					<p class="mt-1 text-base font-semibold text-card-foreground">{report.spineItemCount}</p>
				</div>
				<div class="rounded-xl border border-border bg-muted/40 p-3">
					<span class="text-xs text-muted-foreground">Cover Artwork</span>
					<p
						class="mt-1 text-base font-semibold {report.hasCover
							? 'text-emerald-500'
							: 'text-muted-foreground'}"
					>
						{report.hasCover ? 'Detected' : 'None'}
					</p>
				</div>
				<div class="rounded-xl border border-border bg-muted/40 p-3">
					<span class="text-xs text-muted-foreground">TOC Entries</span>
					<p class="mt-1 text-base font-semibold text-card-foreground">{report.toc.length}</p>
				</div>
			</div>

			<!-- Errors and Warnings List -->
			{#if report.errors.length > 0}
				<div class="space-y-2">
					<h4 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Inspection Details
					</h4>
					<div class="space-y-2">
						{#each report.errors as err (err.field)}
							<Alert variant={err.severity === 'error' ? 'destructive' : 'default'}>
								{#if err.severity === 'error'}
									<XCircle class="h-4 w-4" />
								{:else}
									<AlertTriangle class="h-4 w-4 text-amber-500" />
								{/if}
								<AlertTitle class="text-xs font-semibold">[{err.field}]</AlertTitle>
								<AlertDescription class="text-xs">{err.message}</AlertDescription>
							</Alert>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Table of contents sample -->
			{#if report.toc.length > 0}
				<div>
					<h4
						class="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
					>
						<BookOpen class="h-3.5 w-3.5" />
						Extracted Table of Contents
					</h4>
					<div
						class="mt-2 max-h-36 overflow-y-auto rounded-lg border border-border bg-muted/30 p-2.5"
					>
						<ul class="space-y-1 text-xs text-card-foreground">
							{#each report.toc as item (item.href)}
								<li class="truncate py-0.5 hover:text-primary">
									• {item.title}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
		</CardContent>
	{/if}
</Card>
