<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/form/TextField.svelte';
	import { errorToast, toastTrigger } from '$lib/components/Toasts';
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
</script>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-full text-token space-y-4">
			<h3 class=" font-semibold">Reset password</h3>
			<p>Write down your new password</p>
			<TextField
				name="password"
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
