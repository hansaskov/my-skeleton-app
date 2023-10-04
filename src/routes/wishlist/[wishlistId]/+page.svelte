
<script lang="ts">
    import { handleMessage } from '$lib/components/ToastManager';
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageData } from './$types';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import WishCard from './WishCard.svelte';
	import CreateForm from './CreateForm.svelte';

    const toastStore = getToastStore();

    export let data: PageData;

    const createForm = superForm(data.createForm, {
        taintedMessage: null,
        delayMs: 150,
        onUpdated({ form }) {
            if (form.message) {
                handleMessage(form.message, toastStore);
            }
        }
    });

    superForm(data.deleteForm, {
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

<CreateForm form = {createForm} />