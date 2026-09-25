<script lang="ts">
	import { Check } from 'lucide-svelte';

	interface Step {
		id: number;
		title: string;
		description: string;
	}

	interface Props {
		currentStep: number;
		steps: Step[];
		onSelectStep: (stepId: number) => void;
	}

	let { currentStep, steps, onSelectStep }: Props = $props();
</script>

<nav aria-label="Submission Progress" class="w-full">
	<ol class="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4">
		{#each steps as step (step.id)}
			{@const isCompleted = currentStep > step.id}
			{@const isCurrent = currentStep === step.id}
			<li class="relative">
				<button
					type="button"
					disabled={step.id > currentStep}
					onclick={() => onSelectStep(step.id)}
					class="group flex w-full flex-col rounded-xl border p-3.5 text-left transition-all {isCurrent
						? 'border-indigo-500 bg-indigo-500/10'
						: isCompleted
							? 'border-emerald-500/40 bg-zinc-900/60 hover:border-emerald-500/60'
							: 'cursor-not-allowed border-zinc-800 bg-zinc-950/40 opacity-60'}"
				>
					<div class="flex items-center space-x-2.5">
						<span
							class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold {isCompleted
								? 'bg-emerald-500 text-white'
								: isCurrent
									? 'bg-indigo-600 text-white'
									: 'bg-zinc-800 text-zinc-400'}"
						>
							{#if isCompleted}
								<Check class="h-3 w-3 stroke-[3]" />
							{:else}
								{step.id}
							{/if}
						</span>
						<span
							class="text-xs font-semibold {isCurrent
								? 'text-indigo-200'
								: isCompleted
									? 'text-zinc-200'
									: 'text-zinc-400'}"
						>
							{step.title}
						</span>
					</div>
					<p class="mt-1 truncate pl-7 text-[11px] text-zinc-400">
						{step.description}
					</p>
				</button>
			</li>
		{/each}
	</ol>
</nav>
