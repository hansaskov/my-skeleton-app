<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message/client';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { Toast } from '@skeletonlabs/skeleton';
	import { toastManager } from './ToastManager';

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

		if ($flash.type === 'error') 
			toastManager.trigger.error($flash.message);
		if ($flash.type ==='success') 
			toastManager.trigger.success($flash.message);
	});
</script>

<Toast />
