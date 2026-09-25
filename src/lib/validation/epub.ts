import JSZip from 'jszip';
import sanitizeHtml from 'sanitize-html';

export interface ValidationError {
	severity: 'error' | 'warning';
	field: string;
	message: string;
}

export interface ValidationReport {
	valid: boolean;
	hasWarnings: boolean;
	status: 'VALID' | 'WARNINGS' | 'BLOCKED';
	errors: ValidationError[];
	metadata: {
		title: string;
		creator: string;
		language: string;
		identifier?: string;
		description?: string;
		publisher?: string;
		rights?: string;
	};
	manifestItemCount: number;
	spineItemCount: number;
	hasCover: boolean;
	coverBlob?: Blob;
	toc: Array<{ title: string; href: string }>;
	samplePreviewHtml?: string;
}

export async function validateEpub(file: File | ArrayBuffer): Promise<ValidationReport> {
	const errors: ValidationError[] = [];
	const metadata = {
		title: 'Unknown Title',
		creator: 'Unknown Author',
		language: 'en',
		identifier: '',
		description: '',
		publisher: '',
		rights: ''
	};
	const toc: Array<{ title: string; href: string }> = [];
	let hasCover = false;
	let coverBlob: Blob | undefined;
	let samplePreviewHtml = '';

	let zip: JSZip;
	try {
		zip = await JSZip.loadAsync(file);
	} catch {
		return {
			valid: false,
			hasWarnings: false,
			status: 'BLOCKED',
			errors: [
				{ severity: 'error', field: 'archive', message: 'File is not a valid ZIP / EPUB archive.' }
			],
			metadata,
			manifestItemCount: 0,
			spineItemCount: 0,
			hasCover: false,
			toc: []
		};
	}

	// 1. mimetype check
	const mimetypeFile = zip.file('mimetype');
	if (!mimetypeFile) {
		errors.push({
			severity: 'error',
			field: 'mimetype',
			message: 'Missing mimetype file in archive root.'
		});
	} else {
		const mimetypeContent = (await mimetypeFile.async('string')).trim();
		if (mimetypeContent !== 'application/epub+zip') {
			errors.push({
				severity: 'error',
				field: 'mimetype',
				message: `Invalid mimetype "${mimetypeContent}", expected "application/epub+zip".`
			});
		}
	}

	// 2. container.xml check
	const containerFile = zip.file('META-INF/container.xml');
	if (!containerFile) {
		errors.push({
			severity: 'error',
			field: 'container.xml',
			message: 'Missing META-INF/container.xml file.'
		});
		return {
			valid: false,
			hasWarnings: false,
			status: 'BLOCKED',
			errors,
			metadata,
			manifestItemCount: 0,
			spineItemCount: 0,
			hasCover: false,
			toc: []
		};
	}

	const containerXml = await containerFile.async('string');
	const parser = new DOMParser();
	const containerDoc = parser.parseFromString(containerXml, 'application/xml');
	const rootfile = containerDoc.querySelector('rootfile');
	const opfPath = rootfile?.getAttribute('full-path');

	if (!opfPath) {
		errors.push({
			severity: 'error',
			field: 'container.xml',
			message: 'container.xml does not declare a rootfile full-path.'
		});
		return {
			valid: false,
			hasWarnings: false,
			status: 'BLOCKED',
			errors,
			metadata,
			manifestItemCount: 0,
			spineItemCount: 0,
			hasCover: false,
			toc: []
		};
	}

	// 3. OPF Package Document check
	const opfFile = zip.file(opfPath);
	if (!opfFile) {
		errors.push({
			severity: 'error',
			field: 'opf',
			message: `Referenced package document not found at "${opfPath}".`
		});
		return {
			valid: false,
			hasWarnings: false,
			status: 'BLOCKED',
			errors,
			metadata,
			manifestItemCount: 0,
			spineItemCount: 0,
			hasCover: false,
			toc: []
		};
	}

	const opfXml = await opfFile.async('string');
	const opfDoc = parser.parseFromString(opfXml, 'application/xml');
	const basePath = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

	// Metadata Extraction
	const titleEl = opfDoc.querySelector('title');
	if (titleEl?.textContent) metadata.title = titleEl.textContent.trim();
	else
		errors.push({
			severity: 'warning',
			field: 'metadata.title',
			message: 'Book title not found in OPF metadata.'
		});

	const creatorEl = opfDoc.querySelector('creator');
	if (creatorEl?.textContent) metadata.creator = creatorEl.textContent.trim();
	else
		errors.push({
			severity: 'warning',
			field: 'metadata.creator',
			message: 'Primary author/creator not specified.'
		});

	const langEl = opfDoc.querySelector('language');
	if (langEl?.textContent) metadata.language = langEl.textContent.trim();

	const idEl = opfDoc.querySelector('identifier');
	if (idEl?.textContent) metadata.identifier = idEl.textContent.trim();

	const descEl = opfDoc.querySelector('description');
	if (descEl?.textContent) metadata.description = descEl.textContent.trim();

	// Manifest & Spine Check
	const manifestItems = opfDoc.querySelectorAll('manifest > item');
	const manifestItemCount = manifestItems.length;
	const manifestMap = new Map<string, { href: string; mediaType: string; properties?: string }>();

	manifestItems.forEach((item) => {
		const id = item.getAttribute('id');
		const href = item.getAttribute('href');
		const mediaType = item.getAttribute('media-type') || '';
		const properties = item.getAttribute('properties') || '';
		if (id && href) {
			manifestMap.set(id, { href, mediaType, properties });
		}
	});

	const spineItems = opfDoc.querySelectorAll('spine > itemref');
	const spineItemCount = spineItems.length;

	if (spineItemCount === 0) {
		errors.push({
			severity: 'error',
			field: 'spine',
			message: 'OPF spine has no readable itemref elements.'
		});
	}

	// DRM / Encryption inspection
	const encryptionXml = zip.file('META-INF/encryption.xml');
	if (encryptionXml) {
		errors.push({
			severity: 'warning',
			field: 'security.encryption',
			message:
				'Encryption/DRM detected in META-INF/encryption.xml. Ensure files can be rendered by standard readers.'
		});
	}

	// Cover detection
	const coverItem =
		opfDoc.querySelector('manifest > item[properties~="cover-image"]') ||
		opfDoc.querySelector('manifest > item[id="cover"]') ||
		opfDoc.querySelector('manifest > item[id="cover-image"]');

	if (coverItem) {
		const coverHref = coverItem.getAttribute('href');
		if (coverHref) {
			const fullCoverPath = basePath + coverHref;
			const coverFile = zip.file(fullCoverPath);
			if (coverFile) {
				const blob = await coverFile.async('blob');
				hasCover = true;
				coverBlob = blob;
			}
		}
	}

	// First chapter sample extraction for preview
	if (spineItems.length > 0) {
		const firstIdref = spineItems[0].getAttribute('idref');
		if (firstIdref && manifestMap.has(firstIdref)) {
			const chapterItem = manifestMap.get(firstIdref)!;
			const chapterFile = zip.file(basePath + chapterItem.href);
			if (chapterFile) {
				const rawContent = await chapterFile.async('string');
				samplePreviewHtml = sanitizeHtml(rawContent, {
					allowedTags: [
						'p',
						'b',
						'i',
						'em',
						'strong',
						'h1',
						'h2',
						'h3',
						'h4',
						'blockquote',
						'div',
						'span',
						'ul',
						'li',
						'ol'
					],
					allowedAttributes: {}
				});
			}
		}
	}

	// Table of Contents Check (nav or ncx)
	const navItem = opfDoc.querySelector('manifest > item[properties~="nav"]');
	if (navItem) {
		const navHref = navItem.getAttribute('href');
		if (navHref) {
			const navFile = zip.file(basePath + navHref);
			if (navFile) {
				const navHtml = await navFile.async('string');
				const navDoc = parser.parseFromString(navHtml, 'text/html');
				const links = navDoc.querySelectorAll(
					'nav[epub\\:type="toc"] a, nav[role="doc-toc"] a, nav a'
				);
				links.forEach((a) => {
					if (a.textContent?.trim()) {
						toc.push({ title: a.textContent.trim(), href: a.getAttribute('href') || '' });
					}
				});
			}
		}
	}

	const hasErrors = errors.some((e) => e.severity === 'error');
	const hasWarnings = errors.some((e) => e.severity === 'warning');

	return {
		valid: !hasErrors,
		hasWarnings,
		status: hasErrors ? 'BLOCKED' : hasWarnings ? 'WARNINGS' : 'VALID',
		errors,
		metadata,
		manifestItemCount,
		spineItemCount,
		hasCover,
		coverBlob,
		toc: toc.slice(0, 20),
		samplePreviewHtml
	};
}
