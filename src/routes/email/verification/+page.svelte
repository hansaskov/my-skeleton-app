<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';
	import { successToast, toastTrigger } from '$lib/components/Toasts';

	export let data: PageData;
	export let form: ActionData;

	if (data.message) {
		toastTrigger(successToast, data.message)
	}
</script>

<Seo
	title="Askov | E-mail Verification"
	type="WebPage"
	description="Please check and verify your email by navigating to the link send in your inbox"
/>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<div class="card p-8 w-full text-token space-y-4">
		<h1>Email verification</h1>
		<p>Please check {data.user.email} for a verification email</p>
		<h2>Resend verification email</h2>
		<form
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						successToast.message = 'E-mail sent';
						toastStore.trigger(successToast);
					}
				};
			}}
		>
			<input class="btn variant-filled-primary" type="submit" value="Resend email" />
		</form>
	</div>
</div>

{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
