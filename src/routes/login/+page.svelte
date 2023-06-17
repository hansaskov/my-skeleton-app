<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/form/TextField.svelte';
	import CheckboxField from '$lib/components/form/CheckboxField.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/stores';
	import { isLoadingForm } from '$lib/stores.ts/loading';
	import { errorToast, toastTrigger } from '$lib/components/Toasts';

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

	if (data.message) toastTrigger(errorToast, data.message);

	form.delayed.subscribe((v) => {
		$isLoadingForm = v;
	});
</script>

<Seo title="Askov | Login" type="WebPage" description="Login to hjemmet.net" />

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-full space-y-4">
			<h3 class="h3 font-semibold">Sign in to your account</h3>
			<TextField
				name="email"
				{form}
				field="email"
				titleName="E-mail"
				placeholder="Enter your E-mail"
			/>
			<TextField
				name="password"
				{form}
				field="password"
				type="password"
				titleName="Password"
				placeholder="********"
			/>

			<div class="flex items-center justify-between">
				<CheckboxField name="remember" {form} field="remember" titleName="Remember me" />
				<a class="anchor text-blue-800" href="/password/reset">Forgot password?</a>
			</div>

			<button class="btn variant-filled-primary w-full">Submit</button>

			<p class="flex justify-between">
				Don`t have an account yet?
				<a class=" anchor text-blue-800" href="/signup{$page.url.search}"> Sign up</a>
			</p>
		</div>

		<hr class="!border-t-2 my-4 bg-red-600" />
	</form>

	<a href="/api/oauth?provider=github" class="btn variant-filled">
		<iconify-icon class="w-5 justify-center" icon="lucide:github" />
		<p class="flex-grow text-justify">Login with Github</p>
	</a>
</div>
