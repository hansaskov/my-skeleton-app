
<script lang="ts">
    import { handleMessage } from '$lib/components/ToastManager';
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageData } from './$types';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import WishCard from './WishCard.svelte';
	import CreateForm from './CreateForm.svelte';
	import { writable } from 'svelte/store';

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

    export const selectedWishId = writable("")
   
</script>

<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {#each data.wishlist.wishs as wish}
               <WishCard {wish} {createForm} {selectedWishId} wishlistRole={data.wishlistRole}/>
    {/each}
</section>


 {#if data.wishlistRole === 'EDITABLE'}
 <hr class="border-t border-gray-200 my-8" />
    <CreateForm form = {createForm} {selectedWishId} />
 {/if}
