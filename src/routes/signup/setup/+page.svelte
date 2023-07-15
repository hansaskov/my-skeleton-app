<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/form/TextField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import { errorToast, toastTrigger } from '$lib/components/Toasts';
	import { isLoadingForm } from '$lib/stores.ts/loading';
	import { Avatar, FileDropzone } from '@skeletonlabs/skeleton';
	import { handleFileUpload } from '../../api/upload/client/handleFileUpload';

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

	const form_data = form.form;
</script>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-fit text-token space-y-4">
			<h3 class="h3 font-semibold">Tell me about yourself</h3>

			<TextField field="fullname" {form} titleName="Your Full name" type="text" />
			<TextField field="birthdate" {form} titleName="Your Birthdate" type="date" />
			<TextAreaField field="description"	{form}	titleName="A description about you"	/>
 
			<TextField
				readonly
				class="input variant-ghost-surface pointer-events-none opacity-50 bg-gray-200 "
				field="imageUrl"
				{form}
				titleName="Profile picture (optional)"
			/>


			<div class="flex w-fit items-center justify-between">
			<FileDropzone
				name="image.upload"
				accept="image/*"
				on:change={async (e) => {
					$form_data.imageUrl = await handleFileUpload(e);
				}}
			>
				<svelte:fragment slot="lead">
					<iconify-icon icon="lucide:file-input" width="32" height="32" />
				</svelte:fragment>
				<svelte:fragment slot="meta">PNG, JPG and SVG allowed.</svelte:fragment>
			</FileDropzone>


			{#if $form_data.imageUrl}
					<Avatar class="ml-4 w-1/3 "  src= "https://image.hjemmet.net/{$form_data.imageUrl}"></Avatar>
			{/if}
		</div>
			<button class="btn variant-filled-primary w-full">Submit</button>
		</div>
	</form>
</div>
