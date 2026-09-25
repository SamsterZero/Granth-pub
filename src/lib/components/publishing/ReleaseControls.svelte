<script lang="ts">
	import type { SubmissionResponse } from '$lib/api/publishing';
	import { Clock, Ban, Calendar, RefreshCw, Send } from 'lucide-svelte';

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
	let activeModal = $state<'schedule' | 'withdraw' | 'replace' | null>(null);

	const statusBadges = {
		DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
		SUBMITTED: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
		APPROVED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
		REJECTED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
		PUBLISHED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
		SCHEDULED: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
		WITHDRAWN: 'bg-zinc-900 text-zinc-400 border-zinc-800'
	};
</script>

<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
	<div
		class="flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<div class="flex items-center space-x-2">
				<span
					class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase {statusBadges[
						submission.status
					]}"
				>
					{submission.status}
				</span>
				<span class="text-xs text-zinc-400">Edition ID: {submission.editionId}</span>
			</div>
			<h3 class="mt-2 text-base font-bold text-zinc-100">{submission.title}</h3>
			{#if submission.scheduledAt}
				<p class="mt-1 flex items-center gap-1.5 text-xs text-amber-300">
					<Calendar class="h-3.5 w-3.5" />
					Scheduled for release on {new Date(submission.scheduledAt).toLocaleString()}
				</p>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap items-center gap-2">
			{#if submission.status === 'APPROVED' || submission.status === 'DRAFT'}
				<button
					type="button"
					disabled={isLoading}
					onclick={onPublish}
					class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
				>
					<Send class="h-3.5 w-3.5" />
					Publish Immediately
				</button>
				<button
					type="button"
					disabled={isLoading}
					onclick={() => (activeModal = 'schedule')}
					class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
				>
					<Clock class="h-3.5 w-3.5" />
					Schedule Release
				</button>
			{/if}

			{#if submission.status === 'PUBLISHED' || submission.status === 'SCHEDULED'}
				<button
					type="button"
					disabled={isLoading}
					onclick={() => (activeModal = 'withdraw')}
					class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
				>
					<Ban class="h-3.5 w-3.5" />
					Withdraw from Storefront
				</button>
				<button
					type="button"
					disabled={isLoading}
					onclick={() => (activeModal = 'replace')}
					class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
				>
					<RefreshCw class="h-3.5 w-3.5" />
					Replace Edition
				</button>
			{/if}
		</div>
	</div>

	<!-- Modal: Schedule Release -->
	{#if activeModal === 'schedule'}
		<div class="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
			<h4 class="text-xs font-semibold text-amber-200">Schedule Storefront Release</h4>
			<p class="mt-1 text-xs text-amber-300/80">
				Choose the date and time when this book becomes available for purchase.
			</p>
			<div class="mt-3 flex items-center gap-3">
				<input
					type="datetime-local"
					bind:value={scheduledDate}
					class="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
				/>
				<button
					type="button"
					disabled={!scheduledDate || isLoading}
					onclick={() => {
						onSchedule(new Date(scheduledDate).toISOString());
						activeModal = null;
					}}
					class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
				>
					Confirm Schedule
				</button>
				<button
					type="button"
					onclick={() => (activeModal = null)}
					class="text-xs text-zinc-400 hover:text-zinc-200"
				>
					Cancel
				</button>
			</div>
		</div>
	{/if}

	<!-- Modal: Withdraw -->
	{#if activeModal === 'withdraw'}
		<div class="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
			<h4 class="text-xs font-semibold text-rose-200">Withdraw Title from Public Storefront</h4>
			<p class="mt-1 text-xs text-rose-300/80">
				New customers won't be able to buy this book. Existing readers retain library access.
			</p>
			<div class="mt-3 flex flex-col gap-2">
				<input
					type="text"
					bind:value={withdrawReason}
					placeholder="Enter reason for withdrawal (e.g. rights expired, revised edition in progress)..."
					class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
				/>
				<div class="flex items-center gap-2">
					<button
						type="button"
						disabled={!withdrawReason || isLoading}
						onclick={() => {
							onWithdraw(withdrawReason);
							activeModal = null;
						}}
						class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
					>
						Confirm Withdrawal
					</button>
					<button
						type="button"
						onclick={() => (activeModal = null)}
						class="text-xs text-zinc-400 hover:text-zinc-200"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Modal: Replace Edition -->
	{#if activeModal === 'replace'}
		<div class="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
			<h4 class="text-xs font-semibold text-indigo-200">Replace with Revised Edition</h4>
			<p class="mt-1 text-xs text-indigo-300/80">
				Enter the UUID of the newly uploaded and validated edition package.
			</p>
			<div class="mt-3 flex items-center gap-3">
				<input
					type="text"
					bind:value={replacementEditionId}
					placeholder="New Edition UUID..."
					class="w-72 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
				/>
				<button
					type="button"
					disabled={!replacementEditionId || isLoading}
					onclick={() => {
						onReplace(replacementEditionId);
						activeModal = null;
					}}
					class="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
				>
					Confirm Replacement
				</button>
				<button
					type="button"
					onclick={() => (activeModal = null)}
					class="text-xs text-zinc-400 hover:text-zinc-200"
				>
					Cancel
				</button>
			</div>
		</div>
	{/if}
</div>
