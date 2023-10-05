<script lang="ts">
	import type { SuperForm } from "sveltekit-superforms/client";
	import type { NewWishSchema, Wish, WishlistRole } from "$lib/server/drizzle/schema";
	import type { Writable } from "svelte/store";
	import type { Message } from "$lib/schemas/message";

	export let wish: Wish;
	export let createForm: SuperForm<typeof NewWishSchema, Message>;
	export let selectedWishId: Writable<string>;
	export let wishlistRole: WishlistRole

	const { form: formStore } = createForm;

	$: isSelected = $selectedWishId === wish.id;

	function toggleEditMode() {
		if (isSelected) {
			selectedWishId.set("");
			formStore.set({
				name: "",
				price: 0,
				wishlistId: "",
				currency: 'DKK',
				imageUrl: undefined
			});
		} else {
			selectedWishId.set(wish.id);
			formStore.set(wish);
		}
	}
</script>

<article class={`card variant-glass overflow-hidden relative transition-transform duration-300 transform ${isSelected ? 'border-2 border-blue-500 shadow-md scale-105' : ''}`}>
	{#if wishlistRole === 'EDITABLE'}
		<button type="button" on:click={toggleEditMode} class="btn-icon btn-icon-sm absolute top-2 left-2 variant-filled-tertiary">
			<iconify-icon width="16" height="16" icon="lucide:pen" />
		</button>

		<form method="post" action="?/delete">
			<input type="hidden" name="wishId" bind:value={wish.id} />
			<button class="btn-icon btn-icon-sm absolute top-2 right-2 variant-filled-error">
				<iconify-icon width="16" height="16" icon="lucide:trash-2" />
			</button>
		</form>
	{/if}
	
	<div>
		<img
			class="rounded-t-lg w-full object-cover"
			src={isSelected ? $formStore.imageUrl : wish.imageUrl || '/img_placeholder.jpg'}
			alt={`Image of ${isSelected ? $formStore.name : wish.name}`}
		/>
	</div>

	<footer class="flex justify-between items-center p-4 border-t bg-surface-100-800-token border-surface-200-700-token space-x-4">
		<h3 class="text-xl font-extralight">{isSelected ? $formStore.name : wish.name}</h3>
		<p class="text-sm">Updated {new Date(wish.updatedAt).toLocaleDateString()}</p>
	</footer>
</article>