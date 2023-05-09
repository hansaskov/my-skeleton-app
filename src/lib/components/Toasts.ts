import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

export const errorToast: ToastSettings = {
	message: '',
	background: 'variant-filled-error'
};

export const successToast: ToastSettings = {
	message: '',
	background: 'variant-filled-success'
};

export function toastTrigger(toast: ToastSettings, message: string) {
	toast.message = message;
	toastStore.trigger(toast);
}
