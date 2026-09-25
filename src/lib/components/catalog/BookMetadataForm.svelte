<script lang="ts" module>
	export interface BookMetadata {
		title: string;
		subtitle?: string;
		author: string;
		description?: string;
		language: string;
		isbn?: string;
		genre?: string;
		publisher?: string;
	}
</script>

<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { NativeSelect, NativeSelectOption } from '$lib/components/ui/native-select';

	interface Props {
		metadata: BookMetadata;
		onUpdate: (metadata: BookMetadata) => void;
	}

	let { metadata, onUpdate }: Props = $props();

	let title = $state('');
	let subtitle = $state('');
	let author = $state('');
	let description = $state('');
	let language = $state('en');
	let isbn = $state('');
	let genre = $state('Fiction');
	let publisher = $state('');

	$effect(() => {
		title = metadata.title;
		subtitle = metadata.subtitle || '';
		author = metadata.author;
		description = metadata.description || '';
		language = metadata.language || 'en';
		isbn = metadata.isbn || '';
		genre = metadata.genre || 'Fiction';
		publisher = metadata.publisher || '';
	});

	function notify() {
		onUpdate({
			title,
			subtitle,
			author,
			description,
			language,
			isbn,
			genre,
			publisher
		});
	}
</script>

<Card class="border-border bg-card">
	<CardHeader class="border-b border-border pb-3">
		<CardTitle class="text-sm font-semibold text-card-foreground">
			Catalog & Metadata Details
		</CardTitle>
	</CardHeader>

	<CardContent class="pt-5">
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
			<!-- Title -->
			<div class="space-y-1.5">
				<Label for="book-title">
					Book Title <span class="text-destructive">*</span>
				</Label>
				<Input
					id="book-title"
					type="text"
					bind:value={title}
					oninput={notify}
					required
					placeholder="e.g. Beyond the Silent Sky"
				/>
			</div>

			<!-- Subtitle -->
			<div class="space-y-1.5">
				<Label for="book-subtitle">Subtitle (Optional)</Label>
				<Input
					id="book-subtitle"
					type="text"
					bind:value={subtitle}
					oninput={notify}
					placeholder="e.g. Chronicle of the First Explorers"
				/>
			</div>

			<!-- Primary Author -->
			<div class="space-y-1.5">
				<Label for="book-author">
					Primary Author / Creator <span class="text-destructive">*</span>
				</Label>
				<Input
					id="book-author"
					type="text"
					bind:value={author}
					oninput={notify}
					required
					placeholder="e.g. Arthur C. Clarke"
				/>
			</div>

			<!-- ISBN -->
			<div class="space-y-1.5">
				<Label for="book-isbn">ISBN-13 (Optional)</Label>
				<Input
					id="book-isbn"
					type="text"
					bind:value={isbn}
					oninput={notify}
					placeholder="978-0-123456-47-2"
				/>
			</div>

			<!-- Language -->
			<div class="space-y-1.5">
				<Label for="book-lang">Language</Label>
				<NativeSelect id="book-lang" bind:value={language} onchange={notify}>
					<NativeSelectOption value="en">English (en)</NativeSelectOption>
					<NativeSelectOption value="es">Spanish (es)</NativeSelectOption>
					<NativeSelectOption value="fr">French (fr)</NativeSelectOption>
					<NativeSelectOption value="de">German (de)</NativeSelectOption>
					<NativeSelectOption value="hi">Hindi (hi)</NativeSelectOption>
					<NativeSelectOption value="mr">Marathi (mr)</NativeSelectOption>
					<NativeSelectOption value="ja">Japanese (ja)</NativeSelectOption>
				</NativeSelect>
			</div>

			<!-- Genre -->
			<div class="space-y-1.5">
				<Label for="book-genre">Genre / Subject</Label>
				<NativeSelect id="book-genre" bind:value={genre} onchange={notify}>
					<NativeSelectOption value="Fiction">Fiction</NativeSelectOption>
					<NativeSelectOption value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</NativeSelectOption>
					<NativeSelectOption value="Non-Fiction">Non-Fiction</NativeSelectOption>
					<NativeSelectOption value="Technology">Technology</NativeSelectOption>
					<NativeSelectOption value="History">History</NativeSelectOption>
					<NativeSelectOption value="Philosophy">Philosophy</NativeSelectOption>
				</NativeSelect>
			</div>

			<!-- Description / Blurb -->
			<div class="space-y-1.5 md:col-span-2">
				<Label for="book-desc">Book Description / Synopsis</Label>
				<Textarea
					id="book-desc"
					rows={4}
					bind:value={description}
					oninput={notify}
					placeholder="Enter book description or promotional synopsis..."
				/>
			</div>
		</div>
	</CardContent>
</Card>
