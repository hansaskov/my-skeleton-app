// Call backend to get url to upload to
async function fetchPresignedUrl(file: File) {
	const response = await fetch('/api/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fileName: file.name,
			fileType: file.type
		})
	});

	if (!response.ok) {
		console.error('Failed to get presigned URL');
	}

	return response;
}

// Upload using the presignedUrl
async function uploadToR2(presignedUrl: URL | RequestInfo, file: File) {
	const response = await fetch(presignedUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type
		},
		body: file
	});

	if (!response.ok) {
		console.error('Failed to upload file to R2');
	}

	return response;
}

async function handleFileUpload(e: Event) {
	const target = e.target as HTMLInputElement;

	const file = target.files?.[0];

	if (file) {
		const presignedUrlResponse = await fetchPresignedUrl(file);
		const { presignedUrl, objectKey } = await presignedUrlResponse.json();
		await uploadToR2(presignedUrl, file);
		return `${objectKey}`;
	}
}

export { fetchPresignedUrl, uploadToR2, handleFileUpload };
