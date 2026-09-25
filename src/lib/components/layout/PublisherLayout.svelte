<script lang="ts">
	import type { Snippet } from 'svelte';
	import { BookOpen, UploadCloud, BarChart3, LogOut, Building2, Layers } from 'lucide-svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class="flex min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white"
>
	<!-- Sidebar Navigation -->
	<aside class="hidden w-64 flex-col border-r border-zinc-800/80 bg-zinc-900/40 p-4 md:flex">
		<!-- Brand Header -->
		<div class="flex items-center space-x-3 border-b border-zinc-800/60 px-2 py-3">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md"
			>
				<BookOpen class="h-5 w-5 text-white" />
			</div>
			<div>
				<h1 class="text-sm font-bold tracking-tight text-white">Granthalay</h1>
				<span class="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase"
					>Publisher Hub</span
				>
			</div>
		</div>

		<!-- Nav Links -->
		<nav class="mt-6 flex-1 space-y-1">
			<a
				href="/submissions"
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800/60 hover:text-white"
			>
				<Layers class="h-4 w-4 text-indigo-400" />
				Submissions & Catalog
			</a>
			<a
				href="/submissions/new"
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800/60 hover:text-white"
			>
				<UploadCloud class="h-4 w-4 text-emerald-400" />
				New Book Submission
			</a>
			<a
				href="/analytics"
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
			>
				<BarChart3 class="h-4 w-4 text-zinc-400" />
				Sales & Analytics
			</a>
			<a
				href="/settings/profile"
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
			>
				<Building2 class="h-4 w-4 text-zinc-400" />
				Publisher Profile
			</a>
		</nav>

		<!-- Bottom User Info -->
		<div class="border-t border-zinc-800/60 pt-4">
			<div class="flex items-center justify-between px-2">
				<div class="truncate">
					<p class="truncate text-xs font-semibold text-zinc-200">Granthalay Press</p>
					<p class="truncate text-[10px] text-zinc-400">admin@granthalay.org</p>
				</div>
				<a
					href="/account/sign-in"
					class="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
					title="Sign Out"
				>
					<LogOut class="h-4 w-4" />
				</a>
			</div>
		</div>
	</aside>

	<!-- Main Content Area -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar Header -->
		<header
			class="flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/20 px-6 backdrop-blur"
		>
			<div class="flex items-center space-x-3 md:hidden">
				<BookOpen class="h-5 w-5 text-indigo-400" />
				<span class="text-sm font-bold text-white">Granthalay Pub</span>
			</div>

			<div class="hidden items-center space-x-2 text-xs text-zinc-400 md:flex">
				<span>Connected to</span>
				<span class="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] text-indigo-400"
					>Granthalay Modulith API v1</span
				>
			</div>

			<div class="flex items-center space-x-4">
				<a
					href="https://github.com/SamsterZero/Granthalay"
					target="_blank"
					rel="noreferrer"
					class="text-xs text-zinc-400 hover:text-zinc-200"
				>
					Storefront
				</a>
				<a
					href="/docs"
					class="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
				>
					Policies & Docs
				</a>
			</div>
		</header>

		<!-- Main Workspace Body -->
		<main class="flex-1 overflow-y-auto p-6 md:p-8">
			{@render children()}
		</main>
	</div>
</div>
