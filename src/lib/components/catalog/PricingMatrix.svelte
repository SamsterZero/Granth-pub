<script lang="ts">
	import { Plus, Trash2 } from 'lucide-svelte';

	export interface TerritoryPrice {
		territory: string;
		currency: string;
		amountInCents: number;
		isAvailable: boolean;
	}

	interface Props {
		prices: TerritoryPrice[];
		onUpdate: (prices: TerritoryPrice[]) => void;
	}

	let { prices, onUpdate }: Props = $props();

	let items = $state<TerritoryPrice[]>([]);

	$effect(() => {
		if (items.length === 0 && prices.length > 0) {
			items = [...prices];
		} else if (items.length === 0) {
			items = [
				{ territory: 'US', currency: 'USD', amountInCents: 999, isAvailable: true },
				{ territory: 'EU', currency: 'EUR', amountInCents: 899, isAvailable: true },
				{ territory: 'GB', currency: 'GBP', amountInCents: 799, isAvailable: true },
				{ territory: 'IN', currency: 'INR', amountInCents: 49900, isAvailable: true }
			];
		}
	});

	function addTerritory() {
		items = [
			...items,
			{ territory: 'CA', currency: 'CAD', amountInCents: 1199, isAvailable: true }
		];
		onUpdate(items);
	}

	function removeTerritory(index: number) {
		items = items.filter((_, i) => i !== index);
		onUpdate(items);
	}

	function updatePrice(index: number, val: number) {
		items[index].amountInCents = Math.round(val * 100);
		onUpdate(items);
	}

	function toggleAvailability(index: number) {
		items[index].isAvailable = !items[index].isAvailable;
		onUpdate(items);
	}
</script>

<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
	<div class="flex items-center justify-between border-b border-zinc-800 pb-3">
		<div>
			<h3 class="text-sm font-semibold text-zinc-100">Multi-Territory Pricing & Availability</h3>
			<p class="text-xs text-zinc-400">
				Configure pricing and sales territory availability for this edition.
			</p>
		</div>

		<button
			type="button"
			onclick={addTerritory}
			class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
		>
			<Plus class="h-3.5 w-3.5" />
			Add Territory
		</button>
	</div>

	<div class="mt-4 overflow-x-auto">
		<table class="w-full text-left text-xs">
			<thead>
				<tr class="border-b border-zinc-800 text-zinc-400">
					<th class="py-2.5 font-medium">Territory Code</th>
					<th class="py-2.5 font-medium">Currency</th>
					<th class="py-2.5 font-medium">Retail Price</th>
					<th class="py-2.5 font-medium">Storefront Available</th>
					<th class="py-2.5 text-right font-medium">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-800/60 text-zinc-300">
				{#each items as item, i (item.territory + i)}
					<tr>
						<td class="py-3">
							<input
								type="text"
								bind:value={item.territory}
								oninput={() => onUpdate(items)}
								class="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 uppercase focus:border-indigo-500 focus:outline-none"
							/>
						</td>
						<td class="py-3">
							<input
								type="text"
								bind:value={item.currency}
								oninput={() => onUpdate(items)}
								class="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 uppercase focus:border-indigo-500 focus:outline-none"
							/>
						</td>
						<td class="py-3">
							<div class="relative w-28">
								<input
									type="number"
									step="0.01"
									value={(item.amountInCents / 100).toFixed(2)}
									onchange={(e) => updatePrice(i, parseFloat(e.currentTarget.value) || 0)}
									class="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
								/>
							</div>
						</td>
						<td class="py-3">
							<label class="inline-flex cursor-pointer items-center space-x-2">
								<input
									type="checkbox"
									checked={item.isAvailable}
									onchange={() => toggleAvailability(i)}
									class="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
								/>
								<span class="text-xs text-zinc-400">{item.isAvailable ? 'Active' : 'Disabled'}</span
								>
							</label>
						</td>
						<td class="py-3 text-right">
							<button
								type="button"
								onclick={() => removeTerritory(i)}
								class="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
								title="Remove Territory"
							>
								<Trash2 class="h-3.5 w-3.5" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
