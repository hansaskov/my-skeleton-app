<script lang="ts">
    import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
    import type { SuperForm } from 'sveltekit-superforms/client';
    import { formFieldProxy } from 'sveltekit-superforms/client';
    import type { z, AnyZodObject } from 'zod';
  
    type T = $$Generic<AnyZodObject>;
  
    export let form: SuperForm<UnwrapEffects<T>, unknown>;
    export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
  
    const { path, value, errors, constraints } = formFieldProxy(form, field);
  </script>
  
  <label>
    {String(path)}<br />
    <input
      type="text"
      data-invalid={$errors}
      bind:value={$value}
      {...$constraints}
      {...$$restProps}
    />
  </label>
  {#if $errors}<span class="btn variant-filled-error">{$errors}</span>{/if}
  
