<script lang="ts">
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;

	const { path, value, errors, constraints } = formFieldProxy(form, field);

	export let titleName = String(path);
	export let useError = true;
</script>

<label>
	<span>{titleName}</span>
	<textarea
		class="textarea variant-form-material"
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
</label>

{#if useError && $errors}<span class="text-error-500-400-token font-semibold text-sm"
		>{$errors}</span
	>{/if}
