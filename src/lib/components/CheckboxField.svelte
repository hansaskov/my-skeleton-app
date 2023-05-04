<script lang="ts">
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { Writable } from 'svelte/store';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;

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

