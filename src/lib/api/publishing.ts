import { apiFetch } from './client';

export interface PublisherResponse {
	id: string;
	legalName: string;
	imprintName?: string;
	contactEmail: string;
	contactPhone?: string;
	primaryCountry: string;
	defaultCurrency: string;
	taxId?: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface OnboardPublisherRequest {
	legalName: string;
	imprintName?: string;
	contactEmail: string;
	contactPhone?: string;
	primaryCountry: string;
	defaultCurrency: string;
	taxId?: string;
}

export interface UpdatePublisherProfileRequest {
	legalName?: string;
	imprintName?: string;
	contactEmail?: string;
	contactPhone?: string;
	primaryCountry?: string;
	defaultCurrency?: string;
	taxId?: string;
}

export interface PublisherMemberResponse {
	id: string;
	publisherId: string;
	accountId: string;
	role: 'ADMIN' | 'EDITOR' | 'VIEWER';
	joinedAt: string;
}

export interface AddPublisherMemberRequest {
	accountId: string;
	role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface SubmitEditionRequest {
	publisherId: string;
	editionId: string;
	title: string;
	isbn?: string;
}

export interface ReviewSubmissionRequest {
	approve: boolean;
	rejectionReason?: string;
	reviewedBy: string;
}

export interface PublishReleaseRequest {
	scheduledAt?: string;
	performedBy: string;
}

export interface WithdrawReleaseRequest {
	reason: string;
	performedBy: string;
}

export interface ReplaceEditionRequest {
	newEditionId: string;
	performedBy: string;
}

export interface UpdateAvailabilityRequest {
	territory: string;
	availableFrom?: string;
	availableUntil?: string;
	isAvailable: boolean;
	performedBy: string;
}

export interface SubmissionResponse {
	id: string;
	publisherId: string;
	editionId: string;
	title: string;
	isbn?: string;
	status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'SCHEDULED' | 'WITHDRAWN';
	rejectionReason?: string;
	scheduledAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface PublishingAuditEventResponse {
	id: string;
	submissionId: string;
	publisherId: string;
	action: string;
	performedBy: string;
	details?: string;
	createdAt: string;
}

export interface StorageObjectResponse {
	id: string;
	editionId: string;
	fileName: string;
	fileSize: number;
	contentType: string;
	sha256Hash: string;
	storagePath: string;
	createdAt: string;
}

export const publishingApi = {
	onboardPublisher: (data: OnboardPublisherRequest) =>
		apiFetch<PublisherResponse>('/publishing/publishers/onboard', {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	getMyPublishers: () => apiFetch<PublisherResponse[]>('/publishing/publishers/me'),

	getPublisherById: (publisherId: string) =>
		apiFetch<PublisherResponse>(`/publishing/publishers/${publisherId}`),

	updatePublisherProfile: (publisherId: string, data: UpdatePublisherProfileRequest) =>
		apiFetch<PublisherResponse>(`/publishing/publishers/${publisherId}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		}),

	addPublisherMember: (publisherId: string, data: AddPublisherMemberRequest) =>
		apiFetch<PublisherMemberResponse>(`/publishing/publishers/${publisherId}/members`, {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	submitEdition: (data: SubmitEditionRequest) =>
		apiFetch<SubmissionResponse>('/publishing/submissions', {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	reviewSubmission: (submissionId: string, data: ReviewSubmissionRequest) =>
		apiFetch<SubmissionResponse>(`/publishing/submissions/${submissionId}/review`, {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	publishRelease: (submissionId: string, data: PublishReleaseRequest) =>
		apiFetch<SubmissionResponse>(`/publishing/submissions/${submissionId}/publish`, {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	withdrawRelease: (submissionId: string, data: WithdrawReleaseRequest) =>
		apiFetch<SubmissionResponse>(`/publishing/submissions/${submissionId}/withdraw`, {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	replaceEdition: (submissionId: string, data: ReplaceEditionRequest) =>
		apiFetch<SubmissionResponse>(`/publishing/submissions/${submissionId}/replace`, {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	updateAvailability: (editionId: string, data: UpdateAvailabilityRequest) =>
		apiFetch<void>(`/publishing/editions/${editionId}/availability`, {
			method: 'PUT',
			body: JSON.stringify(data)
		}),

	getSubmissionHistory: (submissionId: string) =>
		apiFetch<PublishingAuditEventResponse[]>(`/publishing/submissions/${submissionId}/history`),

	uploadEpub: (editionId: string, file: File) => {
		const formData = new FormData();
		formData.append('file', file);
		return apiFetch<StorageObjectResponse>(`/storage/epubs/${editionId}`, {
			method: 'POST',
			body: formData
		});
	},

	getStorageObjectByEdition: (editionId: string) =>
		apiFetch<StorageObjectResponse>(`/storage/epubs/${editionId}`)
};
