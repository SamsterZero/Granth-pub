<script lang="ts">
	import PublisherLayout from '$lib/components/layout/PublisherLayout.svelte';
	import ReleaseControls from '$lib/components/publishing/ReleaseControls.svelte';
	import AuditTimeline from '$lib/components/publishing/AuditTimeline.svelte';
	import { type SubmissionResponse, type PublishingAuditEventResponse } from '$lib/api/publishing';
	import { Plus, Search } from 'lucide-svelte';

	let submissions = $state<SubmissionResponse[]>([
		{
			id: 'sub-1',
			publisherId: 'pub-granthalay-press',
			editionId: 'ed-101',
			title: 'The Principles of Privacy-First Architecture',
			isbn: '978-0-123456-47-2',
			status: 'PUBLISHED',
			createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
			updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
		},
		{
			id: 'sub-2',
			publisherId: 'pub-granthalay-press',
			editionId: 'ed-102',
			title: 'Modern Svelte 5 and Runes Guide',
			isbn: '978-0-987654-32-1',
			status: 'SCHEDULED',
			scheduledAt: new Date(Date.now() + 86400000 * 7).toISOString(),
			createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			id: 'sub-3',
			publisherId: 'pub-granthalay-press',
			editionId: 'ed-103',
			title: 'Distributed Systems & Modular Monoliths',
			status: 'SUBMITTED',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	]);

	let auditEvents = $state<PublishingAuditEventResponse[]>([
		{
			id: 'aud-1',
			submissionId: 'sub-1',
			publisherId: 'pub-granthalay-press',
			action: 'PUBLISH',
			performedBy: 'admin@granthalay.org',
			details: 'Live storefront release approved for all active territories',
			createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
		},
		{
			id: 'aud-2',
			submissionId: 'sub-2',
			publisherId: 'pub-granthalay-press',
			action: 'SCHEDULE',
			performedBy: 'editor@granthalay.org',
			details: 'Release scheduled for next week',
			createdAt: new Date().toISOString()
		}
	]);

	let selectedSubmissionId = $state('sub-1');
	let searchQuery = $state('');

	const activeSubmission = $derived(
		submissions.find((s) => s.id === selectedSubmissionId) || submissions[0]
	);

	const filteredSubmissions = $derived(
		submissions.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	async function handlePublish() {
		if (!activeSubmission) return;
		activeSubmission.status = 'PUBLISHED';
		auditEvents = [
			{
				id: 'aud-' + Date.now(),
				submissionId: activeSubmission.id,
				publisherId: activeSubmission.publisherId,
				action: 'PUBLISH',
				performedBy: 'admin@granthalay.org',
				details: 'Immediate publication triggered',
				createdAt: new Date().toISOString()
			},
			...auditEvents
		];
	}

	async function handleSchedule(date: string) {
		if (!activeSubmission) return;
		activeSubmission.status = 'SCHEDULED';
		activeSubmission.scheduledAt = date;
		auditEvents = [
			{
				id: 'aud-' + Date.now(),
				submissionId: activeSubmission.id,
				publisherId: activeSubmission.publisherId,
				action: 'SCHEDULE',
				performedBy: 'admin@granthalay.org',
				details: `Scheduled for release on ${date}`,
				createdAt: new Date().toISOString()
			},
			...auditEvents
		];
	}

	async function handleWithdraw(reason: string) {
		if (!activeSubmission) return;
		activeSubmission.status = 'WITHDRAWN';
		auditEvents = [
			{
				id: 'aud-' + Date.now(),
				submissionId: activeSubmission.id,
				publisherId: activeSubmission.publisherId,
				action: 'WITHDRAW',
				performedBy: 'admin@granthalay.org',
				details: `Withdrawn from storefront: ${reason}`,
				createdAt: new Date().toISOString()
			},
			...auditEvents
		];
	}

	async function handleReplace(newEditionId: string) {
		if (!activeSubmission) return;
		const oldEditionId = activeSubmission.editionId;
		activeSubmission.editionId = newEditionId;
		auditEvents = [
			{
				id: 'aud-' + Date.now(),
				submissionId: activeSubmission.id,
				publisherId: activeSubmission.publisherId,
				action: 'REPLACE_EDITION',
				performedBy: 'admin@granthalay.org',
				details: `Replaced edition ${oldEditionId} with ${newEditionId}`,
				createdAt: new Date().toISOString()
			},
			...auditEvents
		];
	}
</script>

<PublisherLayout>
	<div class="mx-auto max-w-6xl space-y-6">
		<!-- Top Action Header -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-2xl font-bold tracking-tight text-white">Submissions & Catalog</h2>
				<p class="text-xs text-zinc-400">
					Manage manuscript review, scheduled releases, storefront withdrawals, and revised
					editions.
				</p>
			</div>

			<a
				href="/submissions/new"
				class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
			>
				<Plus class="h-4 w-4" />
				New Title Submission
			</a>
		</div>

		<!-- Main Dual Column Workspace -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Submissions Master List -->
			<div class="space-y-3">
				<div class="relative">
					<Search class="absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search titles..."
						class="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2 pr-3 pl-9 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
					/>
				</div>

				<div class="space-y-2">
					{#each filteredSubmissions as sub (sub.id)}
						{@const isSelected = sub.id === activeSubmission?.id}
						<button
							type="button"
							onclick={() => (selectedSubmissionId = sub.id)}
							class="w-full rounded-xl border p-4 text-left transition-all {isSelected
								? 'border-indigo-500 bg-indigo-500/10'
								: 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'}"
						>
							<div class="flex items-center justify-between">
								<span
									class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-300 uppercase"
								>
									{sub.status}
								</span>
								<span class="text-[10px] text-zinc-500">
									{new Date(sub.createdAt).toLocaleDateString()}
								</span>
							</div>
							<h4 class="mt-2 line-clamp-1 text-xs font-bold text-zinc-100">{sub.title}</h4>
							<p class="mt-0.5 font-mono text-[11px] text-zinc-400">Edition: {sub.editionId}</p>
						</button>
					{/each}
				</div>
			</div>

			<!-- Submission Detail & Lifecycle Controls -->
			<div class="space-y-6 lg:col-span-2">
				{#if activeSubmission}
					<ReleaseControls
						submission={activeSubmission}
						onPublish={handlePublish}
						onSchedule={handleSchedule}
						onWithdraw={handleWithdraw}
						onReplace={handleReplace}
					/>

					<AuditTimeline
						events={auditEvents.filter((e) => e.submissionId === activeSubmission.id)}
					/>
				{/if}
			</div>
		</div>
	</div>
</PublisherLayout>
