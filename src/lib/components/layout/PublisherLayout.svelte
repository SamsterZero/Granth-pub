<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		BookOpen,
		UploadCloud,
		BarChart3,
		LogOut,
		Building2,
		Layers,
		Menu,
		ExternalLink,
		Settings
	} from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let mobileNavOpen = $state(false);

	const navItems = [
		{
			href: '/submissions',
			title: 'Submissions & Catalog',
			icon: Layers,
			iconColor: 'text-primary'
		},
		{
			href: '/submissions/new',
			title: 'New Book Submission',
			icon: UploadCloud,
			iconColor: 'text-emerald-600 dark:text-emerald-400'
		},
		{
			href: '/analytics',
			title: 'Sales & Analytics',
			icon: BarChart3,
			iconColor: 'text-muted-foreground'
		},
		{
			href: '/settings',
			title: 'Settings & Policies',
			icon: Settings,
			iconColor: 'text-muted-foreground'
		}
	];
</script>

<div class="flex min-h-screen w-full bg-background font-sans text-foreground antialiased">
	<!-- Desktop & Laptop Sidebar Navigation -->
	<aside
		class="3xl:w-80 hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground lg:flex 2xl:w-72"
	>
		<!-- Brand Header -->
		<div class="flex items-center space-x-3 px-2 py-3">
			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
			>
				<BookOpen class="h-5 w-5" />
			</div>
			<div class="truncate">
				<h1 class="text-sm font-bold tracking-tight text-sidebar-foreground">Granthalay</h1>
				<span class="text-[11px] font-semibold tracking-wider text-primary uppercase"
					>Publisher Hub</span
				>
			</div>
		</div>

		<Separator class="my-2 bg-sidebar-border" />

		<!-- Nav Links -->
		<nav class="mt-4 flex-1 space-y-1">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground 2xl:text-sm"
				>
					<item.icon class="h-4 w-4 shrink-0 {item.iconColor}" />
					<span class="truncate">{item.title}</span>
				</a>
			{/each}
		</nav>

		<!-- Bottom User Info -->
		<div class="pt-4">
			<Separator class="mb-3 bg-sidebar-border" />
			<div class="flex items-center justify-between px-2">
				<div class="truncate">
					<p class="truncate text-xs font-semibold text-sidebar-foreground">Granthalay Press</p>
					<p class="truncate text-[10px] text-muted-foreground">admin@granthalay.org</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					href="/account/sign-in"
					title="Sign Out"
					class="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
				>
					<LogOut class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</aside>

	<!-- Main Workspace Area -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar Header -->
		<header
			class="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-card/75 px-4 backdrop-blur sm:px-6 2xl:px-8"
		>
			<!-- Mobile / Tablet Menu & Brand -->
			<div class="flex items-center space-x-2.5 lg:hidden">
				<Sheet bind:open={mobileNavOpen}>
					<SheetTrigger
						class={buttonVariants({ variant: 'ghost', size: 'icon' }) + ' h-9 w-9 text-foreground'}
					>
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</SheetTrigger>
					<SheetContent side="left" class="w-72 bg-sidebar p-4 text-sidebar-foreground">
						<SheetHeader class="text-left">
							<div class="flex items-center space-x-3 px-2 py-2">
								<div
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
								>
									<BookOpen class="h-5 w-5" />
								</div>
								<div>
									<SheetTitle class="text-sm font-bold text-sidebar-foreground">
										Granthalay
									</SheetTitle>
									<span class="text-[11px] font-semibold tracking-wider text-primary uppercase">
										Publisher Hub
									</span>
								</div>
							</div>
						</SheetHeader>

						<Separator class="my-3 bg-sidebar-border" />

						<nav class="mt-2 flex-1 space-y-1">
							{#each navItems as item}
								<a
									href={item.href}
									onclick={() => (mobileNavOpen = false)}
									class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								>
									<item.icon class="h-4 w-4 shrink-0 {item.iconColor}" />
									<span>{item.title}</span>
								</a>
							{/each}
							<Separator class="my-2 bg-sidebar-border" />
							<a
								href="https://samsterzero.github.io/Granthalay/store"
								target="_blank"
								rel="noreferrer"
								onclick={() => (mobileNavOpen = false)}
								class="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<div class="flex items-center gap-3">
									<BookOpen class="h-4 w-4 shrink-0 text-primary" />
									<span>Public Storefront</span>
								</div>
								<ExternalLink class="h-3.5 w-3.5" />
							</a>
						</nav>

						<div class="absolute right-4 bottom-4 left-4 border-t border-sidebar-border pt-4">
							<div class="flex items-center justify-between px-2">
								<div class="truncate">
									<p class="truncate text-xs font-semibold text-sidebar-foreground">
										Granthalay Press
									</p>
									<p class="truncate text-[10px] text-muted-foreground">admin@granthalay.org</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									href="/account/sign-in"
									title="Sign Out"
									class="h-8 w-8 text-muted-foreground hover:text-foreground"
								>
									<LogOut class="h-4 w-4" />
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>

				<div class="flex items-center space-x-2">
					<BookOpen class="h-5 w-5 text-primary" />
					<span class="text-sm font-bold tracking-tight text-foreground sm:text-base">
						Granthalay Pub
					</span>
				</div>
			</div>

			<!-- Status indicator (Laptop / Desktop / Ultrawide) -->
			<div class="hidden items-center space-x-2 text-xs text-muted-foreground lg:flex">
				<span>Connected to</span>
				<span
					class="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary"
				>
					Granthalay Modulith API v1
				</span>
			</div>

			<!-- Action Tools & Theme Switcher -->
			<div class="flex items-center space-x-2 sm:space-x-3">
				<Button
					variant="ghost"
					size="sm"
					href="https://samsterzero.github.io/Granthalay/store"
					target="_blank"
					rel="noreferrer"
					class="hidden text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
				>
					Storefront
					<ExternalLink class="ml-1 h-3 w-3" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					href="/settings"
					class="h-8 gap-1.5 px-2.5 text-xs font-semibold sm:h-9 sm:px-3"
				>
					<Settings class="h-3.5 w-3.5" />
					<span>Settings</span>
				</Button>
				<ThemeToggle />
			</div>
		</header>

		<!-- Main Workspace Body (Responsive Container up to Ultrawide) -->
		<main class="3xl:p-12 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 2xl:p-10">
			<div class="3xl:max-w-[2100px] mx-auto w-full max-w-7xl 2xl:max-w-[1700px]">
				{@render children()}
			</div>
		</main>
	</div>
</div>
