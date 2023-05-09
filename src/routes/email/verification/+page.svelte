<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const successToast: ToastSettings = {
		message: '',
		background: 'variant-filled-success'
	};

	if (data.message) {
		successToast.message = data.message;
		toastStore.trigger(successToast);
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
		<form method="post" use:enhance>
			<input class="btn variant-filled-primary" type="submit" value="Resend email" />
		</form>
	</div>
</div>

{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
