<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/TextField.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { errorToast, successToast, toastTrigger } from '$lib/components/Toasts';
	import { isLoadingForm } from '$lib/stores.ts/loading';

	export let data: PageData;

	const form = superForm(data.form, {
		taintedMessage: null,
		delayMs: 100,
		onUpdated: ({ form }) => {
			if (form.valid) {
				const message = `Password reset sent to ${form.data.email}`;
				toastTrigger(successToast, message);
			} else {
				const allErrors = Object.values(form.errors).flat();
				const uniqueErrors = [...new Set(allErrors)];

				for (const error of uniqueErrors) {
					toastTrigger(errorToast, error);
				}
			}
		}
	});

	form.delayed.subscribe((v) => {
		$isLoadingForm = v;
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
			<h3 class="h3 font-semibold">Reset password</h3>
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
