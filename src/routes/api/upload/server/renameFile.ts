import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from '$lib/server/s3';
import { PUBLIC_S3_BUCKET_NAME as BUCKET } from '$env/static/public';

async function renameObjectKey(oldKey: string, newKey: string): Promise<void> {
	// Copy the object to the new key
	await S3.send(
		new CopyObjectCommand({
			Bucket: BUCKET,
			CopySource: `${BUCKET}/${oldKey}`,
			Key: newKey
		})
	);

	// Delete the original object
	await S3.send(
		new DeleteObjectCommand({
			Bucket: BUCKET,
			Key: oldKey
		})
	);
}

const prefix = 'temp/';
async function moveFileFromTempFolder(url: string) {
	const oldKey = url;
	const newKey = url.substring(prefix.length);
	await renameObjectKey(oldKey, newKey);
	return `https://image.hjemmet.net/${newKey}`;
}

export { renameObjectKey, moveFileFromTempFolder };
