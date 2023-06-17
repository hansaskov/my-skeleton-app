<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/form/TextField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import { errorToast, successToast, toastTrigger } from '$lib/components/Toasts';
	import { isLoadingForm } from '$lib/stores.ts/loading';

	export let data: PageData;

	const form = superForm(data.form, {
		taintedMessage: null,
		delayMs: 100,
		onUpdate: ({ form }) => {
			const allErrors = Object.values(form.errors).flat();
			const uniqueErrors = [...new Set(allErrors)];

			for (const error of uniqueErrors) {
				toastTrigger(errorToast, error);
			}
		}
	});

	form.delayed.subscribe((v) => {
		$isLoadingForm = v;
	});

	if (data.message) {
		toastTrigger(successToast, data.message);
	}
</script>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-full text-token space-y-4">
			<h3 class=" font-semibold">Tell me about yourself</h3>

			<TextField name="full_name" field="full_name" {form} titleName="Your Full name" type="text" />
			<TextField name="birthdate" field="birthdate" {form} titleName="Your Birthdate" type="date" />
			<TextAreaField
				name="description"
				field="description"
				{form}
				titleName="A description about you"
				class="textarea"
			/>

			<button class="btn variant-filled-primary w-full">Submit</button>
		</div>
	</form>
</div>
