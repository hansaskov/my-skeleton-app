import { PUBLIC_S3_BUCKET_NAME } from '$env/static/public';
import { S3 } from '$lib/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json } from '@sveltejs/kit';

/**
 * Converts a string to a URL-friendly slug format.
 * Replaces spaces, dots, and special characters with dashes.
 */
const slugifyString = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\./g, '-')
		.replace(/-+/g, '-')
		.replace(/[^a-z0-9-]/g, '-');
};

export const POST = async ({ request }): Promise<Response> => {
	// First, we are getting the  fileName  and  fileType  from the request body (we will send them from the client
	const { fileName, fileType } = (await request.json()) as {
		fileName: string | undefined;
		fileType: string | undefined;
	};

	// Then we are doing some validation to make sure the parameters are not empty or undefined.
	if (!fileName || !fileType || fileName.trim() === '' || fileType.trim() === '') {
		return json({ message: 'Missing required parameters.' }, { status: 400 });
	}

	// To avoid any weird characters in the file name, we are using a slugifyString function to transform the file name into a URL-friendly string. We are also adding a timestamp to the file name to make sure we don't have any conflicts.
	const objectKey = `${slugifyString(Date.now().toString())}-${slugifyString(fileName)}`;

	// We are then using the getSignedUrl function from the @aws-sdk/s3-request-presigner package to generate a pre-signed URL. We are using the PutObjectCommand to create a new object in our bucket. We are also setting the  ACL  to  public-read  to make sure the file is publicly accessible.
	const presignedUrl = await getSignedUrl(
		S3,
		new PutObjectCommand({
			Bucket: PUBLIC_S3_BUCKET_NAME,
			Key: objectKey,
			ContentType: fileType,
			ACL: 'public-read'
		}),
		{
			expiresIn: 60 * 1 // 1 minute
		}
	);

	return json({ presignedUrl, objectKey });
};
