<script lang="ts">
	import type { SubmissionResponse } from '$lib/api/publishing';
	import { Clock, Ban, Calendar, RefreshCw, Send } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter,
		DialogClose
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';

	interface Props {
		submission: SubmissionResponse;
		onPublish: () => void;
		onSchedule: (date: string) => void;
		onWithdraw: (reason: string) => void;
		onReplace: (newEditionId: string) => void;
		isLoading?: boolean;
	}

	let {
		submission,
		onPublish,
		onSchedule,
		onWithdraw,
		onReplace,
		isLoading = false
	}: Props = $props();

	let scheduledDate = $state('');
	let withdrawReason = $state('');
	let replacementEditionId = $state('');

	let scheduleOpen = $state(false);
	let withdrawOpen = $state(false);
	let replaceOpen = $state(false);

	const statusVariant = $derived.by(() => {
		switch (submission.status) {
			case 'PUBLISHED':
				return 'default';
			case 'APPROVED':
				return 'secondary';
			case 'SCHEDULED':
				return 'outline';
			case 'REJECTED':
			case 'WITHDRAWN':
				return 'destructive';
			default:
				return 'secondary';
		}
	});
</script>

<Card class="border-border bg-card">
	<CardContent class="p-6">
		<div
			class="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<div class="flex items-center space-x-2">
					<Badge variant={statusVariant} class="tracking-wider uppercase">
						{submission.status}
					</Badge>
					<span class="text-xs text-muted-foreground">Edition ID: {submission.editionId}</span>
				</div>
				<h3 class="mt-2 text-base font-bold text-card-foreground">{submission.title}</h3>
				{#if submission.scheduledAt}
					<p class="mt-1 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
						<Calendar class="h-3.5 w-3.5" />
						Scheduled for release on {new Date(submission.scheduledAt).toLocaleString()}
					</p>
				{/if}
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center gap-2">
				{#if submission.status === 'APPROVED' || submission.status === 'DRAFT'}
					<Button
						disabled={isLoading}
						onclick={onPublish}
						size="sm"
						class="bg-emerald-600 text-white hover:bg-emerald-500"
					>
						<Send class="mr-1.5 h-3.5 w-3.5" />
						Publish Immediately
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={isLoading}
						onclick={() => (scheduleOpen = true)}
					>
						<Clock class="mr-1.5 h-3.5 w-3.5" />
						Schedule Release
					</Button>
				{/if}

				{#if submission.status === 'PUBLISHED' || submission.status === 'SCHEDULED'}
					<Button
						variant="destructive"
						size="sm"
						disabled={isLoading}
						onclick={() => (withdrawOpen = true)}
					>
						<Ban class="mr-1.5 h-3.5 w-3.5" />
						Withdraw from Storefront
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={isLoading}
						onclick={() => (replaceOpen = true)}
					>
						<RefreshCw class="mr-1.5 h-3.5 w-3.5" />
						Replace Edition
					</Button>
				{/if}
			</div>
		</div>
	</CardContent>
</Card>

<!-- Modal: Schedule Release -->
<Dialog bind:open={scheduleOpen}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Schedule Storefront Release</DialogTitle>
			<DialogDescription>
				Choose the date and time when this book becomes available for purchase.
			</DialogDescription>
		</DialogHeader>
		<div class="py-4">
			<Input type="datetime-local" bind:value={scheduledDate} />
		</div>
		<DialogFooter>
			<DialogClose>
				<Button variant="ghost">Cancel</Button>
			</DialogClose>
			<Button
				disabled={!scheduledDate || isLoading}
				onclick={() => {
					onSchedule(new Date(scheduledDate).toISOString());
					scheduleOpen = false;
				}}
			>
				Confirm Schedule
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

<!-- Modal: Withdraw -->
<Dialog bind:open={withdrawOpen}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Withdraw Title from Public Storefront</DialogTitle>
			<DialogDescription>
				New customers won't be able to buy this book. Existing readers retain library access.
			</DialogDescription>
		</DialogHeader>
		<div class="py-4">
			<Input
				type="text"
				bind:value={withdrawReason}
				placeholder="Enter reason for withdrawal (e.g. rights expired)..."
			/>
		</div>
		<DialogFooter>
			<DialogClose>
				<Button variant="ghost">Cancel</Button>
			</DialogClose>
			<Button
				variant="destructive"
				disabled={!withdrawReason || isLoading}
				onclick={() => {
					onWithdraw(withdrawReason);
					withdrawOpen = false;
				}}
			>
				Confirm Withdrawal
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

<!-- Modal: Replace Edition -->
<Dialog bind:open={replaceOpen}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Replace with Revised Edition</DialogTitle>
			<DialogDescription>
				Enter the UUID of the newly uploaded and validated edition package.
			</DialogDescription>
		</DialogHeader>
		<div class="py-4">
			<Input type="text" bind:value={replacementEditionId} placeholder="New Edition UUID..." />
		</div>
		<DialogFooter>
			<DialogClose>
				<Button variant="ghost">Cancel</Button>
			</DialogClose>
			<Button
				disabled={!replacementEditionId || isLoading}
				onclick={() => {
					onReplace(replacementEditionId);
					replaceOpen = false;
				}}
			>
				Confirm Replacement
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
