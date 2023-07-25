<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/form/TextField.svelte';
	import CheckboxField from '$lib/components/form/CheckboxField.svelte';
	import { isLoadingForm } from '$lib/stores.ts/loading';
	import Seo from '$lib/components/Seo.svelte';
	import { schema } from '$lib/schemas/authentication';
	import { toastManager } from '$lib/components/ToastManager';

	export let data: PageData;

	const form = superForm(data.form, {
		taintedMessage: null,
		delayMs: 150,
		validators: schema.family,
		onUpdate: ({ form }) => {
			const allErrors = Object.values(form.errors).flat();
			const uniqueErrors = [...new Set(allErrors)];

			for (const error of uniqueErrors) {
				toastManager.trigger.error(error);
			}
		}
	});

	form.delayed.subscribe((v) => ($isLoadingForm = v));
</script>

<Seo
	title="Create Family"
	type="WebPage"
	description="Site to create a new family. The website contains a form that has a field of family name and a create button"
/>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-full space-y-4">
			<h3 class="h3 font-semibold">Create a new family for your profile!</h3>
			<TextField {form} field="name" titleName="Family name" placeholder="Your family's name" />
			<CheckboxField {form} field="is_public" titleName="Public?" />

			<button class="btn variant-filled-primary w-full">Submit</button>
		</div>
	</form>
</div>
