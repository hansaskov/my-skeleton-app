<script lang="ts">
	import type { z, AnyZodObject } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	const { path, value, errors, constraints, } = formFieldProxy(form, field);

	export let titleName = String(path);
	export let useError = true;
</script>

<label class= "label">
	<span>{titleName}</span>
	<input
		name={field}
		type="text"
		aria-invalid={useError && $errors ? 'true' : undefined}
		class="input p-1.5"
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
</label>

{#if useError && $errors}
	{#each $errors as err}
		<ul>
			<li class="text-error-500-400-token font-semibold text-sm">
				{err}
			</li>
		</ul>
	{/each}
{/if}
