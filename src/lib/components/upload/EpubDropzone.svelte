<script lang="ts">
	import { UploadCloud, FileCheck, XCircle, RotateCcw } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';

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
				<FileCheck class="h-6 w-6 shrink-0 text-emerald-500" />
				<div class="truncate">
					<p class="truncate text-sm font-medium text-emerald-950 dark:text-emerald-200">
						{selectedFileName}
					</p>
					<p class="text-xs text-emerald-600 dark:text-emerald-400">{selectedFileSize}</p>
				</div>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onclick={resetSelection}
				class="gap-1 text-xs text-emerald-700 hover:bg-emerald-500/20 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
				title="Change file"
			>
				<RotateCcw class="h-3.5 w-3.5" />
				Change
			</Button>
		</div>
	{:else}
		<div
			role="region"
			aria-label="EPUB File Upload Dropzone"
			ondragover={onDragOver}
			ondragleave={onDragLeave}
			ondrop={onDrop}
			class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all {isDragging
				? 'scale-[1.01] border-primary bg-primary/10'
				: 'border-border bg-card/50 hover:border-primary/60'}"
		>
			<UploadCloud
				class="mb-3 h-10 w-10 {isDragging
					? 'text-primary'
					: 'text-muted-foreground'} transition-colors"
			/>
			<h4 class="text-sm font-semibold text-card-foreground">Drag & drop your EPUB file here</h4>
			<p class="mt-1 text-xs text-muted-foreground">
				Standard EPUB 2 or EPUB 3 (up to {maxSizeMb}MB)
			</p>

			<label class="mt-4">
				<Button size="sm" class="cursor-pointer font-semibold">Browse Files</Button>
				<input type="file" {accept} {disabled} onchange={onFileInput} class="sr-only" />
			</label>
		</div>
	{/if}

	{#if errorMessage}
		<div class="mt-3">
			<Alert variant="destructive">
				<XCircle class="h-4 w-4" />
				<AlertTitle class="text-xs font-semibold">Upload Error</AlertTitle>
				<AlertDescription class="text-xs">{errorMessage}</AlertDescription>
			</Alert>
		</div>
	{/if}
</div>
