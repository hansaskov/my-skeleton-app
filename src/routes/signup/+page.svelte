<script lang="ts">
	import type { PageData } from './$types';
	import { superForm, formFieldProxy } from 'sveltekit-superforms/client'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const errorToast: ToastSettings = {
		message: '',
		background: 'variant-filled-error'
	};

	function triggerErrorToast(message: string) {
		errorToast.message = message;
		toastStore.trigger(errorToast);
	}

	export let data: PageData;

	const { form, enhance, errors, constraints, capture, restore } = superForm(data.form, {
		taintedMessage: null,
		onUpdate: ({ form, cancel }) => {
			const allErrors = Object.values(form.errors).flat();
			const uniqueErrors = [...new Set(allErrors)];
			
			for (const error of uniqueErrors) {
				triggerErrorToast(error)
			}
		}
	});

	export const snapshot = { capture, restore };
</script>

<SuperDebug data={$form} />

<h2>Create an account</h2>
<form class="label" method="POST" use:enhance>
	<label for="username">Username</label>
	<input
		type="text"
		name="username"
		class="input"
		placeholder="hansaskov"
		data-invalid={$errors.username}
		bind:value={$form.username}
		{...$constraints.username}
	/>
	<label for="password">Password</label>
	<input
		type="password"
		name="password"
		class="input"
		placeholder="*********"
		data-invalid={$errors.password}
		bind:value={$form.password}
		{...$constraints.password}
	/>

	<div><button class="btn variant-filled">Submit</button></div>
</form>
