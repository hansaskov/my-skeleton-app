<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data : PageData

	const { form, errors, constraints } = superForm(data.form);
</script>

<SuperDebug data={$form} />

<div>
	<h1>Sign in</h1>
	<form class="label" method="POST">
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
		<label for="password"></label>
		<input
			type="password"
			name="password"
			class="input"
			placeholder="*********"
			data-invalid={$errors.password}
			bind:value={$form.password}
			{...$constraints.password}
		/>
	
		<div><button class="btn variant-filled">Login</button></div>
	</form>
</div>