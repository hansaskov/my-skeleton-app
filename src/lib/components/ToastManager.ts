import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

class ToastManager {
	private static instance: ToastManager;

	private errorToast: ToastSettings = {
		message: '',
		background: 'variant-filled-error'
	};

	private successToast: ToastSettings = {
		message: '',
		background: 'variant-filled-success'
	};

	// Make the class singleton
	static getInstance(): ToastManager {
		if (!ToastManager.instance) {
			ToastManager.instance = new ToastManager();
		}
		return ToastManager.instance;
	}

	trigger = {
		error: (message: string) => {
			this.errorToast.message = message;
			toastStore.trigger(this.errorToast);
		},
		success: (message: string) => {
			this.successToast.message = message;
			toastStore.trigger(this.successToast);
		}
	};
}

// Usage
export const toastManager = ToastManager.getInstance();
// toastManager.trigger.error('An error occurred!');
// toastManager.trigger.success('Operation successful!');
