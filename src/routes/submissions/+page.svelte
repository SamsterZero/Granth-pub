<script lang="ts">
	import PublisherLayout from '$lib/components/layout/PublisherLayout.svelte';
	import ReleaseControls from '$lib/components/publishing/ReleaseControls.svelte';
	import AuditTimeline from '$lib/components/publishing/AuditTimeline.svelte';
	import { type SubmissionResponse, type PublishingAuditEventResponse } from '$lib/api/publishing';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Card } from '$lib/components/ui/card';
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

	function getBadgeVariant(status: string) {
		switch (status) {
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
	}
</script>

<PublisherLayout>
	<div class="mx-auto w-full space-y-6">
		<!-- Top Action Header -->
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-xs text-muted-foreground sm:text-sm">
				Manage manuscript review, scheduled releases, storefront withdrawals, and revised editions.
			</p>

			<Button href="/submissions/new" class="shrink-0 gap-2 font-semibold">
				<Plus class="h-4 w-4" />
				New Title Submission
			</Button>
		</div>

		<!-- Main Responsive Workspace -->
		<div class="3xl:grid-cols-5 grid grid-cols-1 gap-6 lg:grid-cols-3 2xl:grid-cols-4">
			<!-- Submissions Master List -->
			<div class="space-y-3 lg:col-span-1">
				<div class="relative">
					<Search class="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground" />
					<Input
						type="text"
						bind:value={searchQuery}
						placeholder="Search titles..."
						class="pl-9 text-xs"
					/>
				</div>

				<div class="space-y-2">
					{#each filteredSubmissions as sub (sub.id)}
						{@const isSelected = sub.id === activeSubmission?.id}
						<Card
							class="cursor-pointer border p-4 text-left transition-all hover:border-primary/50 {isSelected
								? 'border-primary bg-primary/5 shadow-xs'
								: 'border-border bg-card'}"
							onclick={() => (selectedSubmissionId = sub.id)}
						>
							<div class="flex items-center justify-between">
								<Badge variant={getBadgeVariant(sub.status)} class="text-[10px] uppercase">
									{sub.status}
								</Badge>
								<span class="text-[10px] text-muted-foreground">
									{new Date(sub.createdAt).toLocaleDateString()}
								</span>
							</div>
							<h4 class="mt-2 line-clamp-1 text-xs font-bold text-card-foreground sm:text-sm">
								{sub.title}
							</h4>
							<p class="mt-0.5 font-mono text-[11px] text-muted-foreground">
								Edition: {sub.editionId}
							</p>
						</Card>
					{/each}
				</div>
			</div>

			<!-- Submission Detail & Lifecycle Controls -->
			<div class="3xl:col-span-4 space-y-6 lg:col-span-2 2xl:col-span-3">
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
