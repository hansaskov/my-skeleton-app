import type { Message } from '$lib/schemas/message';
import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

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

export function handleMessage(message: Message, toastStore: ToastStore) {
	if (message.type === 'error') {
		const errorToast = errorToastSettings(message.text);
		toastStore.trigger(errorToast);
	} else if (message.type === 'success') {
		const sucessToast = sucessToastSettings(message.text);
		toastStore.trigger(sucessToast);
	}
}
