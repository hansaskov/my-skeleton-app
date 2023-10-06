<script lang="ts">
	import SelectField from '$lib/components/form/SelectField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import type { Message } from '$lib/schemas/message';
	import type { NewWishSchema } from '$lib/server/drizzle/schema';
	import type { Writable } from 'svelte/store';
	import type { SuperForm } from 'sveltekit-superforms/client';

	export let form: SuperForm<typeof NewWishSchema, Message>;
	export let selectedWishId: Writable<string>;

	const { form: formStore } = form;

	$: isEditMode = $selectedWishId !== '';
	$: formAction = isEditMode ? '?/update' : '?/create';
	$: headerText = isEditMode ? `Editing: ${$formStore.name}` : 'Add a new item to your wishlist!';

	function cancelEdit() {
		selectedWishId.set('');
		formStore.set({
			name: "",
			price: '' as unknown as number,
			wishlistId: "",
			currency: 'DKK',
			imageUrl: undefined
		});
	}
</script>

<div class="flex flex-col items-center justify-center mx-auto space-y-8">
	<form method="POST" action={formAction}>
		<div class="card p-8 w-full space-y-4">
			<h3 class="h3 font-semibold">{headerText}</h3>
			<TextField {form} field="name" titleName="Name" placeholder="Iphone 7" />
			<TextField {form} field="price" type="number" titleName="Price" placeholder="799" />
			<SelectField {form} field="currency" titleName="Currency" choises={['DKK', 'EUR', 'USD', 'GBP']} />
			<TextField {form} field="pageUrl" titleName="Page url (optional)" placeholder="https://apple.com/iphone" />
			<TextField {form} field="imageUrl" titleName="Image url (optional)" placeholder="https://apple.com/iphone_7.png" />
			<TextField {form} field="wishlistId" type="hidden" />
			<input type="hidden" name="id" bind:value={$selectedWishId} />
            <div class="flex space-x-2">
				{#if isEditMode}
					<button type="button" class="btn variant-filled-error w-full" on:click={cancelEdit}>Cancel</button>
				{/if}
				<button class="btn variant-filled-primary w-full">{isEditMode ? 'Update' : 'Submit'}</button>
            </div>
		</div>
	</form>
</div>
