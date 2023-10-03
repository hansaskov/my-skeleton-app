<script lang="ts">
	export let wish: {
		id: string;
		name: string;
		imageUrl: string | null;
		updatedAt: Date;
		wishlistId: string;
		price: number;
		currency: 'DKK' | 'EUR' | 'USD' | 'GBP';
	};

    

</script>

<article class="card variant-glass overflow-hidden relative">
	<button type="button" class="btn-icon btn-icon-sm absolute top-2 left-2 variant-filled-tertiary">
		<iconify-icon width="16" height="16" icon="lucide:pen" />
	</button>
	<button type="button" class="btn-icon btn-icon-sm absolute top-2 right-2 variant-filled-error">
		<iconify-icon width="16" height="16" icon="lucide:trash-2" />
	</button>
	<div>
		<img
			class="rounded-t-lg w-full object-cover"
			src={wish.imageUrl || 'path_to_default_image.png'}
			alt={wish.name ? `Image of ${wish.name}` : 'Wishlist item image'}
		/>
	</div>
	<footer
		class="flex justify-between items-center p-4 border-t bg-surface-100-800-token border-surface-200-700-token space-x-4"
	>
		<h3 class="text-xl font-extralight">{wish.name}</h3>
		<div class="flex space-x-2">
			<p class="text-sm">Updated {new Date(wish.updatedAt).toLocaleDateString()}</p>
		</div>
	</footer>
</article>
