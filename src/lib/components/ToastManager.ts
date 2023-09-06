import type { ToastSettings } from '@skeletonlabs/skeleton';

export function errorToastSettings(message: string) {
	return {
		message: message,
		background: 'variant-filled-error'
	} satisfies ToastSettings;
}

export function sucessToastSettings(message: string) {
	return {
		message: message,
		background: 'variant-filled-success'
	} satisfies ToastSettings;
}
