<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/form/TextField.svelte';
	import { isLoadingForm } from '$lib/stores.ts/loading';
	import { handleMessage } from '$lib/components/ToastManager';
	import { getToastStore } from '@skeletonlabs/skeleton';
	export let data: PageData;

	const toastStore = getToastStore()

	const form = superForm(data.form, {
		taintedMessage: null,
		delayMs: 150,
		onUpdated({ form }) {
			if (form.message) {
				handleMessage(form.message, toastStore);
			}
		}
	});
	form.delayed.subscribe((v) => ($isLoadingForm = v));
</script>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-full text-token space-y-4">
			<h3 class="h3 font-semibold">Reset password</h3>
			<p>Write down your new password</p>
			<TextField
				{form}
				field="password"
				type="password"
				titleName="Password"
				placeholder="********"
			/>
			<button class="btn variant-filled-primary w-full">Submit</button>
		</div>
	</form>
</div>
