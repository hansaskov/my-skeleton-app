<script lang="ts">
	import { handleMessage } from '$lib/components/ToastManager';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import TextField from '$lib/components/form/TextField.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';

	const toastStore = getToastStore();

	export let data: PageData;

	const form = superForm(data.form, {
		taintedMessage: null,
		delayMs: 150,
		onUpdated({ form }) {
			if (form.message) {
				handleMessage(form.message, toastStore);
			}
		}
	});

	function convertToNestedList<T>(items: T[], chunkSize: number): T[][] {
		const nestedLists: T[][] = Array.from({ length: chunkSize }, () => []);

		items.forEach((item, index) => {
			const innerListIndex = index % chunkSize;
			nestedLists[innerListIndex].push(item);
		});

		return nestedLists;
	}

	const nestedWishes = convertToNestedList(data.wishlist.wishs, 4);
</script>

<section class="grid grid-cols-2 md:grid-cols-4 gap-2">
	{#each nestedWishes as wishblock}
		<div class="grid gap-4">
			{#each wishblock as wish}
				<div>
                    <div class="card variant-glass">
                        <div>
                            <img class="rounded-t-lg" src={wish.imageUrl} alt="" />
                        </div>
                        <footer class=" flex justify-between items-center p-4 border-t bg-surface-100-800-token border-surface-200-700-token">
                            <h3 class="text-xl font-extralight">{wish.name}</h3>
                            <p class="text-sm ">Updated {new Date(wish.updatedAt).toLocaleDateString()}</p>
                        </footer>
                    </div>
                    
				</div>
			{/each}
		</div>
	{/each}
</section>

<tr />

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" action="?/create" use:form.enhance>
		<div class="card p-8 w-full space-y-4">
			<h3 class="h3 font-semibold">Create a new wishlist!</h3>
			<TextField {form} field="name" titleName="Name" placeholder="Iphone 7" />
			<TextField {form} field="price" type="number" titleName="Price" placeholder="799" />
			<SelectField
				{form}
				field="currency"
				titleName="Currency"
				choises={['DKK', 'EUR', 'USD', 'GBP']}
			/>
			<TextField
				{form}
				field="imageUrl"
				titleName="Image url (optional)"
				placeholder="https://apple.com/iphone_7.png"
			/>
			<TextField {form} field="wishlistId" type="hidden" />
			<button class="btn variant-filled-primary w-full">Submit</button>
		</div>
	</form>
</div>
