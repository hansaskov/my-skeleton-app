<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { z, AnyZodObject } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	const { path, value, errors, constraints } = formFieldProxy(form, field);

	$: boolValue = value as Writable<boolean>;
	export let titleName = String(path);
</script>

<label class="flex items-center space-x-2">
	<input
		class="checkbox"
		type="checkbox"
		data-invalid={$errors}
		bind:checked={$boolValue}
		{...$constraints}
		{...$$restProps}
	/>
	<p>{titleName}</p>
</label>
