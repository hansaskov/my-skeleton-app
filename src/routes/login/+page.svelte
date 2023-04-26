<script lang="ts">
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	const errorToast: ToastSettings = {
		message: '',
		background: 'variant-filled-error'
	};

	function triggerErrorToast(message: string) {
		errorToast.message = message;
		toastStore.trigger(errorToast);
	}

	export let data: PageData;

	const { form, enhance, errors, constraints } = superForm(data.form, {
		taintedMessage: null,
		onUpdate: ({ form, cancel }) => {
			const allErrors = Object.values(form.errors).flat();
			const uniqueErrors = [...new Set(allErrors)];
			
			for (const error of uniqueErrors) {
				triggerErrorToast(error)
			}
		}
	});

</script>

<SuperDebug data={$form} />

<div>
	<h2>Sign in</h2>
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
		{#if $errors.username}<span class="invalid">{$errors.username}</span>{/if}
		<label for="password">Password</label>
		<input
			type="password"
			name="password"
			class="input"
			placeholder="*****"
			data-invalid={$errors.password}
			bind:value={$form.password}
			{...$constraints.password}
		/>

		<div><button class="btn variant-filled">Login</button></div>
	</form>

	<span>or</span>
	<div><a href="/signup" class="btn variant-filled">signup</a></div>
</div>
