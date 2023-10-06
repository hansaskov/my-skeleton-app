<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { Currency, NewWishSchema, Wish, WishlistRole } from '$lib/server/drizzle/schema';
	import type { Writable } from 'svelte/store';
	import type { Message } from '$lib/schemas/message';
	import PriceDisplay from '$lib/components/PriceDisplay.svelte';

	export let wish: Wish;
	export let createForm: SuperForm<typeof NewWishSchema, Message>;
	export let selectedWishId: Writable<string>;
	export let wishlistRole: WishlistRole;

	const { form: formStore } = createForm;

	$: isSelected = $selectedWishId === wish.id;
	$: displayedImage = isSelected ? $formStore.imageUrl : wish.imageUrl || '/img_placeholder.jpg';
	$: displayedName = isSelected ? $formStore.name : wish.name;

	function toggleEditMode() {
		if (isSelected) {
			selectedWishId.set('');
			formStore.set({
				name: '',
				price: '' as unknown as number,
				wishlistId: '',
				currency: 'DKK',
				imageUrl: undefined
			});
		} else {
			selectedWishId.set(wish.id);
			formStore.set(wish);
		}
	}
</script>

<article
	class="card variant-glass overflow-hidden relative transition-all duration-300 transform hover:shadow-lg"
	class:border-2={isSelected}
	class:border-blue-500={isSelected}
	class:shadow-md={isSelected}
	class:scale-105={isSelected}
	{...$$restProps}
>
	{#if wishlistRole === 'EDITABLE'}
		<button
			type="button"
			on:click={toggleEditMode}
			class="btn-icon btn-icon-sm absolute top-2 left-2 variant-filled-tertiary"
		>
			<iconify-icon width="16" height="16" icon="lucide:pen" />
		</button>

		<form method="post" action="?/delete">
			<input type="hidden" name="wishId" bind:value={wish.id} />
			<button class="btn-icon btn-icon-sm absolute top-2 right-2 variant-filled-error">
				<iconify-icon width="16" height="16" icon="lucide:trash-2" />
			</button>
		</form>
	{/if}

	<div class="relative w-full" style="padding-bottom: 56.25%;"> <!-- 56.25% for 16:9 aspect ratio -->
		<img
			class="rounded-t-lg w-full h-full absolute top-0 left-0 object-cover"
			src={displayedImage}
			alt={`Image of ${displayedName}`}
		/>
	</div>
	
	<footer class="p-2 md:p-4 border-t bg-surface-100-800-token border-surface-200-700-token space-y-2">
		<h3 class="text-base md:text-xl font-semibold truncate">{displayedName}</h3>
		<p class="text-xs md:text-sm text-gray-600">Updated {new Date(wish.updatedAt).toLocaleDateString()}</p>
		<div class="flex justify-between items-center">
			<span class="text-base md:text-lg font-medium">
				<PriceDisplay price={wish.price} currency={wish.currency} />
			</span>
			{#if wish.pageUrl}
				<a href={wish.pageUrl} class="text-blue-600 hover:underline text-sm md:text-md">View</a>
			{/if}
		</div>
	</footer>
</article>
