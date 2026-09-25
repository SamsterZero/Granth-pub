<script lang="ts">
	import PublisherLayout from '$lib/components/layout/PublisherLayout.svelte';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Separator } from '$lib/components/ui/separator';
	import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui/tabs';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from '$lib/components/ui/accordion';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { Switch } from '$lib/components/ui/switch';
	import {
		Building2,
		ShieldCheck,
		FileText,
		CreditCard,
		KeyRound,
		CheckCircle2,
		ExternalLink,
		Lock,
		Scale,
		Eye,
		AlertTriangle,
		Save,
		Copy,
		Check
	} from 'lucide-svelte';
	import { page } from '$app/state';

	// Default tab can be controlled via URL query param e.g. /settings?tab=policies
	let activeTab = $state('policies');

	$effect(() => {
		const paramTab = page.url.searchParams.get('tab');
		if (paramTab && ['profile', 'policies', 'commerce', 'api'].includes(paramTab)) {
			activeTab = paramTab;
		}
	});

	// Organization state
	let publisherName = $state('Granthalay Press');
	let publisherSlug = $state('granthalay-press');
	let contactEmail = $state('admin@granthalay.org');
	let websiteUrl = $state('https://granthalay.org');
	let publisherBio = $state(
		'Open-access and privacy-preserving independent digital publisher distributing DRM-free high fidelity EPUBs across the global Granthalay network.'
	);

	// Notification toggles
	let notifyOnSales = $state(true);
	let notifyOnAudit = $state(true);
	let notifyOnPolicyUpdate = $state(true);

	// Copy feedback state
	let copiedApiKey = $state(false);
	function copyKey() {
		navigator.clipboard.writeText('gpub_live_7a89f92e01b44d71ac99e2');
		copiedApiKey = true;
		setTimeout(() => {
			copiedApiKey = false;
		}, 2000);
	}

	let saveSuccess = $state(false);
	function saveProfile() {
		saveSuccess = true;
		setTimeout(() => {
			saveSuccess = false;
		}, 3000);
	}

	const policies = [
		{
			id: 'privacy',
			number: '01',
			title: 'Data and Privacy Policy',
			badge: 'Active & Binding',
			badgeVariant: 'default' as const,
			scope:
				'Defines the boundary between publisher analytics and reader privacy, zero-logging of credentials, cookie session security, and data retention rules.',
			keyPoints: [
				'Zero-Telemetry Reader Guarantee: Personal EPUBs, reading progress, and reader highlights are strictly stored in local device storage and are never transmitted.',
				'Differential Privacy Boundary: Publishers receive privacy-filtered aggregate statistics only (e.g. downloads, completed reading milestones).',
				'Session Security: Better Auth sessions enforce HttpOnly, SameSite=Strict cookies with cryptographically signed tokens.',
				'Data Retention: Operational access logs are pruned after 90 days; passwords and private encryption keys are never logged in any telemetry.'
			],
			lastUpdated: 'September 2026',
			version: '1.0.0'
		},
		{
			id: 'agreement',
			number: '02',
			title: 'Publisher Agreement & Distribution Terms',
			badge: 'Active & Binding',
			badgeVariant: 'default' as const,
			scope:
				'Outlines publisher eligibility, copyright ownership, non-exclusive platform distribution grants, content standards, and title withdrawal rules.',
			keyPoints: [
				'100% Retained Copyright: Authors and publishers retain complete ownership and intellectual property of their uploaded catalog.',
				'Non-Exclusive Worldwide Grant: Publishers are fully free to distribute their works on any other platform or direct store.',
				'DRM-Free Open Standards: All works distributed via Granthalay adhere to open EPUB 3 specifications without proprietary restrictive lock-in.',
				'24-Hour Withdrawal SLA: Publishers can request immediate title withdrawal or updates, propagated globally within 24 hours.'
			],
			lastUpdated: 'September 2026',
			version: '1.0.0'
		},
		{
			id: 'commerce',
			number: '03',
			title: 'Commerce, Refunds & Taxation Policy',
			badge: 'Active & Binding',
			badgeVariant: 'default' as const,
			scope:
				'Covers multi-territory pricing models, payout schedules via Stripe Connect, digital goods refund limits, and marketplace facilitator tax obligations.',
			keyPoints: [
				'Royalty Split: Publishers receive 70% of gross retail prices minus payment processor interchange fees.',
				'Rolling 14-Day Payouts: Settled balances are automatically disbursed directly to linked bank accounts via Stripe Connect.',
				'Digital Defect Refund Window: 48-hour return window for corrupt files or unreadable formats, handled automatically by Granthalay support.',
				'Automated Marketplace Tax: Granthalay acts as marketplace facilitator for collection and remittance of applicable digital goods sales taxes.'
			],
			lastUpdated: 'September 2026',
			version: '1.0.0'
		},
		{
			id: 'security',
			number: '04',
			title: 'Security & Incident Response Runbook',
			badge: 'Active & Binding',
			badgeVariant: 'default' as const,
			scope:
				'Details EPUB ingest threat modeling (Zip-slip, XXE, XSS defense), organization multi-tenant RBAC, and the security incident response runbook.',
			keyPoints: [
				'Ingest Sandboxing: EPUB archives undergo automated Zip-slip traversal checks, decompressed byte-ratio limits, and XML external entity (XXE) stripping.',
				'Script-Free Content: Embedded executable script tags and risky SVG vectors inside EPUB contents are sanitized before distribution.',
				'Multi-Tenant RBAC: Publisher organizations enforce strict role separation (Admin, Publisher Editor, Finance).',
				'24-Hour Disclosure SLA: Critical security disclosures and mitigation steps are communicated to impacted publishers within 24 hours.'
			],
			lastUpdated: 'September 2026',
			version: '1.0.0'
		}
	];
</script>

<svelte:head>
	<title>Publisher Settings & Policies — Granthalay Publisher Hub</title>
</svelte:head>

<PublisherLayout>
	<div class="space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						Settings & Governance
					</h1>
					<Badge variant="outline" class="font-mono text-xs">v0.2.0</Badge>
				</div>
				<p class="text-sm text-muted-foreground">
					Configure your publisher organization, payout integrations, and review binding platform
					policies.
				</p>
			</div>

			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					href="https://samsterzero.github.io/Granthalay/store"
					target="_blank"
					rel="noreferrer"
					class="text-xs text-muted-foreground hover:text-foreground"
				>
					<Eye class="mr-1.5 h-3.5 w-3.5 text-primary" />
					View Public Storefront
					<ExternalLink class="ml-1 h-3 w-3" />
				</Button>
			</div>
		</div>

		{#if saveSuccess}
			<Alert class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
				<CheckCircle2 class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
				<AlertTitle>Settings Saved</AlertTitle>
				<AlertDescription>
					Your publisher profile and configuration preferences have been successfully updated.
				</AlertDescription>
			</Alert>
		{/if}

		<!-- Tabs Navigation -->
		<Tabs bind:value={activeTab} class="w-full">
			<div class="overflow-x-auto pb-1">
				<TabsList class="grid w-full min-w-[500px] grid-cols-4">
					<TabsTrigger value="policies" class="flex items-center gap-1.5 text-xs sm:text-sm">
						<Scale class="h-3.5 w-3.5 text-primary" />
						<span>Policies & Docs</span>
					</TabsTrigger>
					<TabsTrigger value="profile" class="flex items-center gap-1.5 text-xs sm:text-sm">
						<Building2 class="h-3.5 w-3.5" />
						<span>Profile</span>
					</TabsTrigger>
					<TabsTrigger value="commerce" class="flex items-center gap-1.5 text-xs sm:text-sm">
						<CreditCard class="h-3.5 w-3.5" />
						<span>Commerce</span>
					</TabsTrigger>
					<TabsTrigger value="api" class="flex items-center gap-1.5 text-xs sm:text-sm">
						<KeyRound class="h-3.5 w-3.5" />
						<span>API Keys</span>
					</TabsTrigger>
				</TabsList>
			</div>

			<!-- TAB 1: Policies & Documentation (Requested by User) -->
			<TabsContent value="policies" class="mt-6 space-y-6">
				<!-- Status Banner -->
				<Card class="border-primary/20 bg-primary/5">
					<CardHeader class="pb-3">
						<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div class="flex items-center gap-2.5">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary"
								>
									<ShieldCheck class="h-5 w-5" />
								</div>
								<div>
									<CardTitle class="text-base font-bold text-foreground">
										Publisher Ecosystem Governance Center
									</CardTitle>
									<CardDescription class="text-xs">
										All 4 platform policies are active, binding, and mutually protective of reader
										privacy and publisher copyright.
									</CardDescription>
								</div>
							</div>
							<Badge
								variant="default"
								class="w-fit bg-primary font-semibold text-primary-foreground"
							>
								100% Compliant
							</Badge>
						</div>
					</CardHeader>
				</Card>

				<!-- Policies List Accordion -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h2
							class="text-sm font-bold tracking-tight text-foreground text-muted-foreground uppercase"
						>
							Binding Publisher Policies & Documentation
						</h2>
						<span class="text-xs text-muted-foreground">4 Documents</span>
					</div>

					<Accordion type="single" class="space-y-3">
						{#each policies as policy}
							<AccordionItem
								value={policy.id}
								class="overflow-hidden rounded-xl border border-border bg-card px-4 py-2 transition-all data-[state=open]:shadow-sm"
							>
								<AccordionTrigger class="py-2 hover:no-underline">
									<div class="flex flex-1 items-start gap-3 text-left">
										<div
											class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-primary"
										>
											{policy.number}
										</div>
										<div class="space-y-1 pr-3">
											<div class="flex flex-wrap items-center gap-2">
												<span class="text-sm font-semibold text-foreground">
													{policy.title}
												</span>
												<Badge variant={policy.badgeVariant} class="px-2 py-0 text-[10px]">
													{policy.badge}
												</Badge>
												<span class="font-mono text-[11px] text-muted-foreground">
													v{policy.version}
												</span>
											</div>
											<p class="text-xs text-muted-foreground">
												{policy.scope}
											</p>
										</div>
									</div>
								</AccordionTrigger>

								<AccordionContent class="pt-3 pb-4">
									<Separator class="mb-4" />

									<div class="space-y-3 pr-2 pl-10">
										<h4 class="text-xs font-semibold tracking-wide text-foreground uppercase">
											Key Provisions & Guarantees
										</h4>

										<ul class="space-y-2">
											{#each policy.keyPoints as point}
												<li class="flex items-start gap-2 text-xs text-muted-foreground">
													<CheckCircle2
														class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
													/>
													<span>{point}</span>
												</li>
											{/each}
										</ul>

										<div
											class="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 p-2.5 text-xs"
										>
											<div class="flex items-center gap-1.5 text-muted-foreground">
												<FileText class="h-3.5 w-3.5" />
												<span>Source: docs/{policy.number}-{policy.id}.md</span>
											</div>
											<span class="text-[11px] text-muted-foreground">
												Effective: {policy.lastUpdated}
											</span>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						{/each}
					</Accordion>
				</div>
			</TabsContent>

			<!-- TAB 2: Publisher Profile & Organization -->
			<TabsContent value="profile" class="mt-6 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle class="text-base font-bold">Publisher Profile</CardTitle>
						<CardDescription class="text-xs">
							Public organization profile shown across the Granthalay reader store and book details.
						</CardDescription>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid gap-4 sm:grid-cols-2">
							<div class="space-y-2">
								<Label for="pub-name" class="text-xs font-medium">Publisher / Imprint Name</Label>
								<Input
									id="pub-name"
									bind:value={publisherName}
									placeholder="e.g. Granthalay Press"
									class="text-xs"
								/>
							</div>

							<div class="space-y-2">
								<Label for="pub-slug" class="text-xs font-medium">Identifier Slug</Label>
								<Input
									id="pub-slug"
									bind:value={publisherSlug}
									disabled
									class="bg-muted/50 font-mono text-xs text-muted-foreground"
								/>
							</div>

							<div class="space-y-2">
								<Label for="pub-email" class="text-xs font-medium">Official Contact Email</Label>
								<Input id="pub-email" type="email" bind:value={contactEmail} class="text-xs" />
							</div>

							<div class="space-y-2">
								<Label for="pub-web" class="text-xs font-medium">Website URL</Label>
								<Input id="pub-web" type="url" bind:value={websiteUrl} class="text-xs" />
							</div>
						</div>

						<div class="space-y-2">
							<Label for="pub-bio" class="text-xs font-medium">Publisher Description & Bio</Label>
							<Textarea id="pub-bio" rows={4} bind:value={publisherBio} class="text-xs" />
						</div>

						<Separator class="my-2" />

						<div class="space-y-3">
							<h3 class="text-xs font-bold tracking-wide text-foreground uppercase">
								Publisher Notification Preferences
							</h3>

							<div class="flex items-center justify-between rounded-lg border border-border p-3">
								<div class="space-y-0.5">
									<Label class="text-xs font-semibold">Weekly Sales & Royalty Summary</Label>
									<p class="text-[11px] text-muted-foreground">
										Receive aggregated telemetry report of catalog sales every Monday.
									</p>
								</div>
								<Switch bind:checked={notifyOnSales} />
							</div>

							<div class="flex items-center justify-between rounded-lg border border-border p-3">
								<div class="space-y-0.5">
									<Label class="text-xs font-semibold">Automated EPUB Validation Alerts</Label>
									<p class="text-[11px] text-muted-foreground">
										Get notified when automated schema or accessibility checks detect issues.
									</p>
								</div>
								<Switch bind:checked={notifyOnAudit} />
							</div>

							<div class="flex items-center justify-between rounded-lg border border-border p-3">
								<div class="space-y-0.5">
									<Label class="text-xs font-semibold">Policy & Governance Updates</Label>
									<p class="text-[11px] text-muted-foreground">
										Receive 30-day advance notice for any platform policy revisions.
									</p>
								</div>
								<Switch bind:checked={notifyOnPolicyUpdate} />
							</div>
						</div>
					</CardContent>
					<CardFooter class="flex justify-end gap-2 border-t pt-4">
						<Button onclick={saveProfile} size="sm" class="gap-1.5 text-xs font-semibold">
							<Save class="h-3.5 w-3.5" />
							Save Changes
						</Button>
					</CardFooter>
				</Card>
			</TabsContent>

			<!-- TAB 3: Commerce & Payouts -->
			<TabsContent value="commerce" class="mt-6 space-y-6">
				<Card>
					<CardHeader>
						<div class="flex items-center justify-between">
							<div>
								<CardTitle class="text-base font-bold">Stripe Connect Payouts</CardTitle>
								<CardDescription class="text-xs">
									Automated merchant settlement gateway for catalog digital sales.
								</CardDescription>
							</div>
							<Badge
								variant="outline"
								class="border-emerald-500/40 text-xs text-emerald-600 dark:text-emerald-400"
							>
								Connected
							</Badge>
						</div>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid gap-4 sm:grid-cols-2">
							<div class="rounded-xl border border-border bg-muted/20 p-3.5">
								<span class="text-xs text-muted-foreground">Connected Account ID</span>
								<p class="mt-1 font-mono text-xs font-semibold text-foreground">
									acct_1N498bF3k9XpL21z
								</p>
							</div>

							<div class="rounded-xl border border-border bg-muted/20 p-3.5">
								<span class="text-xs text-muted-foreground">Standard Royalty Terms</span>
								<p class="mt-1 text-xs font-semibold text-primary">70% Net to Publisher</p>
							</div>

							<div class="rounded-xl border border-border bg-muted/20 p-3.5">
								<span class="text-xs text-muted-foreground">Settlement Frequency</span>
								<p class="mt-1 text-xs font-semibold text-foreground">
									Rolling 14-Day Direct Deposit
								</p>
							</div>

							<div class="rounded-xl border border-border bg-muted/20 p-3.5">
								<span class="text-xs text-muted-foreground">Tax Form Verification</span>
								<p class="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
									Verified (Form W-8 / GSTIN on file)
								</p>
							</div>
						</div>

						<Alert class="border-secondary bg-secondary/40">
							<CreditCard class="h-4 w-4 text-primary" />
							<AlertTitle class="text-xs font-semibold">Zero Setup or Listing Fees</AlertTitle>
							<AlertDescription class="text-xs text-muted-foreground">
								Granthalay does not charge upfront slot fees or catalog listing fees. Royalties are
								calculated automatically from reader purchases.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			</TabsContent>

			<!-- TAB 4: API & Modulith Integration -->
			<TabsContent value="api" class="mt-6 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle class="text-base font-bold">API Credentials & Endpoints</CardTitle>
						<CardDescription class="text-xs">
							Manage secure access keys for connecting CLI publishing pipelines and ERP catalog sync
							tools.
						</CardDescription>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-2">
							<Label class="text-xs font-medium">Granthalay Modulith API Endpoint</Label>
							<Input
								value="https://api.granthalay.org/v1"
								readonly
								class="bg-muted/50 font-mono text-xs text-muted-foreground"
							/>
						</div>

						<div class="space-y-2">
							<Label class="text-xs font-medium">Publisher Live API Key</Label>
							<div class="flex gap-2">
								<Input
									type="password"
									value="gpub_live_7a89f92e01b44d71ac99e2"
									readonly
									class="font-mono text-xs"
								/>
								<Button
									variant="outline"
									size="icon"
									onclick={copyKey}
									class="shrink-0"
									title="Copy API Key"
								>
									{#if copiedApiKey}
										<Check class="h-4 w-4 text-emerald-600" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</Button>
							</div>
							<p class="text-[11px] text-muted-foreground">
								Use this key in CI/CD release workflows or automated batch ingestion scripts. Never
								share this secret.
							</p>
						</div>

						<Separator class="my-2" />

						<div class="space-y-2 rounded-lg border border-border bg-muted/10 p-3.5">
							<div class="flex items-center gap-2">
								<Lock class="h-4 w-4 text-muted-foreground" />
								<span class="text-xs font-semibold text-foreground">API Scope & Permissions</span>
							</div>
							<p class="text-xs text-muted-foreground">
								This key grants <code
									class="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground"
									>catalog:write</code
								>,
								<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground"
									>release:manage</code
								>, and
								<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground"
									>analytics:read</code
								>
								on publisher organization
								<strong class="text-foreground">pub_granthalay_press</strong>.
							</p>
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	</div>
</PublisherLayout>
