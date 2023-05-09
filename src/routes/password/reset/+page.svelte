<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/TextField.svelte';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import Seo from '$lib/components/Seo.svelte';

	const errorToast: ToastSettings = {
		message: '',
		background: 'variant-filled-error'
	};

	const successToast: ToastSettings = {
		message: '',
		background: 'variant-filled-success'
	};

	export let data: PageData;

	const form = superForm(data.form, {
		taintedMessage: null,
		onUpdated: ({ form }) => {
			if (form.valid) {
				successToast.message = `Password reset sent to ${form.data.email}`;
				toastStore.trigger(successToast);
			} else {
				const allErrors = Object.values(form.errors).flat();
				const uniqueErrors = [...new Set(allErrors)];

				for (const error of uniqueErrors) {
					errorToast.message = error;
					toastStore.trigger(errorToast);
				}
			}
		}
	});
</script>

<Seo
	title="Askov | Password reset"
	type="WebPage"
	description="Page to reset the password given an email"
/>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-full text-token space-y-4">
			<h3 class=" font-semibold">Reset password</h3>
			<p>Choose an E-mail to be sent a password reset link</p>
			<TextField
				name="email"
				{form}
				field="email"
				titleName="E-mail"
				placeholder="Enter your E-mail"
			/>
			<button class="btn variant-filled-primary w-full">Submit</button>
		</div>
	</form>
</div>
