<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message/client';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { Toast } from '@skeletonlabs/skeleton';
	import { errorToastSettings, sucessToastSettings } from './ToastManager';

	const toastStore = getToastStore()

	const flash = getFlash(page, {
		clearOnNavigate: false
	});

	let isGotoNavigated = false;
	afterNavigate(({ type }) => {
		isGotoNavigated = ['goto'].includes(type as string);
	});

	flash.subscribe(($flash) => {
		if (!$flash) return;
		if ($flash.page != $page.url.pathname) return;
		if (!isGotoNavigated) return;

		 if ($flash.type === 'error'){
			const errorToast = errorToastSettings($flash.message)
			toastStore.trigger(errorToast)
		 } else if ($flash.type === 'success') {
			const sucessToast = sucessToastSettings($flash.message)
			toastStore.trigger(sucessToast)
		 }
	});
</script>

<Toast />
