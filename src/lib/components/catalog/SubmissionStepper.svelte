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
	<ol class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 2xl:gap-4">
		{#each steps as step (step.id)}
			{@const isCompleted = currentStep > step.id}
			{@const isCurrent = currentStep === step.id}
			<li class="relative">
				<button
					type="button"
					disabled={step.id > currentStep}
					onclick={() => onSelectStep(step.id)}
					class="group flex w-full flex-col rounded-xl border p-3.5 text-left transition-all {isCurrent
						? 'border-primary bg-primary/10 shadow-xs'
						: isCompleted
							? 'border-emerald-500/40 bg-card hover:border-emerald-500/60'
							: 'cursor-not-allowed border-border bg-card/40 opacity-50'}"
				>
					<div class="flex items-center space-x-2.5">
						<span
							class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold {isCompleted
								? 'bg-emerald-600 text-white'
								: isCurrent
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground'}"
						>
							{#if isCompleted}
								<Check class="h-3 w-3 stroke-[3]" />
							{:else}
								{step.id}
							{/if}
						</span>
						<span
							class="text-xs font-semibold {isCurrent
								? 'text-primary'
								: isCompleted
									? 'text-card-foreground'
									: 'text-muted-foreground'}"
						>
							{step.title}
						</span>
					</div>
					<p class="mt-1 truncate pl-7 text-[11px] text-muted-foreground">
						{step.description}
					</p>
				</button>
			</li>
		{/each}
	</ol>
</nav>
