
<script lang="ts">
    import { handleMessage } from '$lib/components/ToastManager';
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageData } from './$types';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import TextField from '$lib/components/form/TextField.svelte';
    import SelectField from '$lib/components/form/SelectField.svelte';
	import WishCard from './WishCard.svelte';

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

<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each nestedWishes as wishblock}
        <div class="grid gap-4">
            {#each wishblock as wish}
			<div>
               <WishCard {wish}/>
			</div>
            {/each}
        </div>
    {/each}
</section>

<hr class="border-t border-gray-200 my-8" />

<div class="flex flex-col items-center justify-center pt-12 mx-auto space-y-8">
    <form method="POST" action="?/create" use:form.enhance>
        <div class="card p-8 w-full space-y-4">
            <h3 class="h3 font-semibold">Add a new item to your wishlist!</h3>
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