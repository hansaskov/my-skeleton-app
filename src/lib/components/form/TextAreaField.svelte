<script lang="ts">
	import type { z, AnyZodObject } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	const { path, value, errors, constraints } = formFieldProxy(form, field);

	export let titleName = String(path);
	export let useError = true;
</script>

<label>
	<span class="capitalize">{titleName}</span>
	<textarea
		name={field}
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
