<script lang="ts">
	import { Plus, Trash2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

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

<Card class="border-border bg-card">
	<CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
		<div>
			<CardTitle class="text-sm font-semibold text-card-foreground">
				Multi-Territory Pricing & Availability
			</CardTitle>
			<CardDescription class="text-xs text-muted-foreground">
				Configure pricing and sales territory availability for this edition.
			</CardDescription>
		</div>

		<Button
			variant="outline"
			size="sm"
			onclick={addTerritory}
			class="gap-1.5 text-xs font-semibold"
		>
			<Plus class="h-3.5 w-3.5" />
			Add Territory
		</Button>
	</CardHeader>

	<CardContent class="pt-4">
		<div class="overflow-x-auto">
			<Table class="min-w-[520px]">
				<TableHeader>
					<TableRow>
						<TableHead class="w-28 text-xs font-medium">Territory Code</TableHead>
						<TableHead class="w-28 text-xs font-medium">Currency</TableHead>
						<TableHead class="w-36 text-xs font-medium">Retail Price</TableHead>
						<TableHead class="text-xs font-medium">Storefront Available</TableHead>
						<TableHead class="w-16 text-right text-xs font-medium">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each items as item, i (item.territory + i)}
						<TableRow>
							<TableCell class="py-2.5">
								<Input
									type="text"
									bind:value={item.territory}
									oninput={() => onUpdate(items)}
									class="h-8 w-20 uppercase"
								/>
							</TableCell>
							<TableCell class="py-2.5">
								<Input
									type="text"
									bind:value={item.currency}
									oninput={() => onUpdate(items)}
									class="h-8 w-20 uppercase"
								/>
							</TableCell>
							<TableCell class="py-2.5">
								<Input
									type="number"
									step="0.01"
									value={(item.amountInCents / 100).toFixed(2)}
									onchange={(e) => updatePrice(i, parseFloat(e.currentTarget.value) || 0)}
									class="h-8 w-28"
								/>
							</TableCell>
							<TableCell class="py-2.5">
								<div class="flex items-center space-x-2">
									<Switch
										checked={item.isAvailable}
										onCheckedChange={() => toggleAvailability(i)}
									/>
									<span class="text-xs text-muted-foreground">
										{item.isAvailable ? 'Active' : 'Disabled'}
									</span>
								</div>
							</TableCell>
							<TableCell class="py-2.5 text-right">
								<Button
									variant="ghost"
									size="icon"
									onclick={() => removeTerritory(i)}
									title="Remove Territory"
									class="h-8 w-8 text-muted-foreground hover:text-destructive"
								>
									<Trash2 class="h-3.5 w-3.5" />
								</Button>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	</CardContent>
</Card>
