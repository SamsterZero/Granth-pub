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

<div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
	<h3 class="border-b border-zinc-800 pb-3 text-sm font-semibold text-zinc-100">
		Catalog & Metadata Details
	</h3>

	<div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
		<!-- Title -->
		<div>
			<label for="book-title" class="block text-xs font-medium text-zinc-300">
				Book Title <span class="text-rose-400">*</span>
			</label>
			<input
				id="book-title"
				type="text"
				bind:value={title}
				oninput={notify}
				required
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				placeholder="e.g. Beyond the Silent Sky"
			/>
		</div>

		<!-- Subtitle -->
		<div>
			<label for="book-subtitle" class="block text-xs font-medium text-zinc-300">
				Subtitle (Optional)
			</label>
			<input
				id="book-subtitle"
				type="text"
				bind:value={subtitle}
				oninput={notify}
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				placeholder="e.g. Chronicle of the First Explorers"
			/>
		</div>

		<!-- Primary Author -->
		<div>
			<label for="book-author" class="block text-xs font-medium text-zinc-300">
				Primary Author / Creator <span class="text-rose-400">*</span>
			</label>
			<input
				id="book-author"
				type="text"
				bind:value={author}
				oninput={notify}
				required
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				placeholder="e.g. Arthur C. Clarke"
			/>
		</div>

		<!-- ISBN -->
		<div>
			<label for="book-isbn" class="block text-xs font-medium text-zinc-300">
				ISBN-13 (Optional)
			</label>
			<input
				id="book-isbn"
				type="text"
				bind:value={isbn}
				oninput={notify}
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				placeholder="978-0-123456-47-2"
			/>
		</div>

		<!-- Language -->
		<div>
			<label for="book-lang" class="block text-xs font-medium text-zinc-300"> Language </label>
			<select
				id="book-lang"
				bind:value={language}
				onchange={notify}
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
			>
				<option value="en">English (en)</option>
				<option value="es">Spanish (es)</option>
				<option value="fr">French (fr)</option>
				<option value="de">German (de)</option>
				<option value="hi">Hindi (hi)</option>
				<option value="mr">Marathi (mr)</option>
				<option value="ja">Japanese (ja)</option>
			</select>
		</div>

		<!-- Genre -->
		<div>
			<label for="book-genre" class="block text-xs font-medium text-zinc-300">
				Genre / Subject
			</label>
			<select
				id="book-genre"
				bind:value={genre}
				onchange={notify}
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
			>
				<option value="Fiction">Fiction</option>
				<option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
				<option value="Non-Fiction">Non-Fiction</option>
				<option value="Technology">Technology</option>
				<option value="History">History</option>
				<option value="Philosophy">Philosophy</option>
			</select>
		</div>

		<!-- Description / Blurb -->
		<div class="md:col-span-2">
			<label for="book-desc" class="block text-xs font-medium text-zinc-300">
				Book Description / Synopsis
			</label>
			<textarea
				id="book-desc"
				rows="4"
				bind:value={description}
				oninput={notify}
				class="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				placeholder="Enter book description or promotional synopsis..."></textarea>
		</div>
	</div>
</div>
