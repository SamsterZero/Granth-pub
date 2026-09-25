<script lang="ts">
	import { UploadCloud, FileCheck, XCircle, RotateCcw } from 'lucide-svelte';

	interface Props {
		onFileSelect: (file: File) => void;
		accept?: string;
		maxSizeMb?: number;
		disabled?: boolean;
	}

	let {
		onFileSelect,
		accept = '.epub,application/epub+zip',
		maxSizeMb = 500,
		disabled = false
	}: Props = $props();

	let isDragging = $state(false);
	let errorMessage = $state<string | null>(null);
	let selectedFileName = $state<string | null>(null);
	let selectedFileSize = $state<string | null>(null);

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function handleFile(file: File) {
		errorMessage = null;

		if (!file.name.toLowerCase().endsWith('.epub') && file.type !== 'application/epub+zip') {
			errorMessage = 'Only .epub files are supported.';
			return;
		}

		const sizeInMb = file.size / (1024 * 1024);
		if (sizeInMb > maxSizeMb) {
			errorMessage = `File size exceeds the ${maxSizeMb}MB maximum limit.`;
			return;
		}

		selectedFileName = file.name;
		selectedFileSize = formatBytes(file.size);
		onFileSelect(file);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (disabled) return;

		if (e.dataTransfer && e.dataTransfer.files.length > 0) {
			handleFile(e.dataTransfer.files[0]);
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) isDragging = true;
	}

	function onDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function onFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			handleFile(target.files[0]);
		}
	}

	function resetSelection() {
		selectedFileName = null;
		selectedFileSize = null;
		errorMessage = null;
	}
</script>

<div class="w-full">
	{#if selectedFileName}
		<div
			class="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-colors"
		>
			<div class="flex items-center space-x-3 truncate">
				<FileCheck class="h-6 w-6 shrink-0 text-emerald-400" />
				<div class="truncate">
					<p class="truncate text-sm font-medium text-emerald-200">{selectedFileName}</p>
					<p class="text-xs text-emerald-400/80">{selectedFileSize}</p>
				</div>
			</div>
			<button
				type="button"
				onclick={resetSelection}
				class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
				title="Change file"
			>
				<RotateCcw class="h-3.5 w-3.5" />
				Change
			</button>
		</div>
	{:else}
		<div
			role="region"
			aria-label="EPUB File Upload Dropzone"
			ondragover={onDragOver}
			ondragleave={onDragLeave}
			ondrop={onDrop}
			class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all {isDragging
				? 'scale-[1.01] border-indigo-400 bg-indigo-500/10'
				: 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'}"
		>
			<UploadCloud
				class="mb-3 h-10 w-10 {isDragging ? 'text-indigo-400' : 'text-zinc-400'} transition-colors"
			/>
			<h4 class="text-sm font-semibold text-zinc-100">Drag & drop your EPUB file here</h4>
			<p class="mt-1 text-xs text-zinc-400">Standard EPUB 2 or EPUB 3 (up to {maxSizeMb}MB)</p>

			<label
				class="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 hover:bg-indigo-500"
			>
				<span>Browse Files</span>
				<input type="file" {accept} {disabled} onchange={onFileInput} class="sr-only" />
			</label>
		</div>
	{/if}

	{#if errorMessage}
		<div
			class="mt-3 flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
			role="alert"
		>
			<XCircle class="h-4 w-4 shrink-0 text-red-400" />
			<span>{errorMessage}</span>
		</div>
	{/if}
</div>
