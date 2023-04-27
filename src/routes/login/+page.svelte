<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from '$lib/components/TextField.svelte';

	export let data: PageData;
	
	const form = superForm(data.form);

</script>

<form method="POST" use:form.enhance>
	<div class="card p-4 w-full text-token space-y-4">
		<h3>Sign in with credentials</h3>
		<TextField name="username" {form} field="username" />
		<TextField name="password" {form} field="password" />

		<div><button class="btn variant-filled">Submit</button></div>
	</div>
</form>
