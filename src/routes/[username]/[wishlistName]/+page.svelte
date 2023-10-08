
<script lang="ts">
    import { handleMessage } from '$lib/components/ToastManager';
    import { superForm } from 'sveltekit-superforms/client';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import WishCard from './WishCard.svelte';
	import CreateForm from './CreateForm.svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';

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

<Seo
	title="Askov | Wishlist"
	type="WebPage"
	description="A website to share and show wishlists"
/>
<section class="columns-2 lg:columns-3  gap-8">
    {#each data.wishlist.wishs as wish}
            <div class="py-4">
               <WishCard {wish} {createForm} {selectedWishId} wishlistRole={data.wishlistRole} />
            </div>
            
    {/each}
</section>


 {#if data.wishlistRole === 'EDITABLE'}
 <hr class="border-t border-gray-200 my-8" />
    <CreateForm form = {createForm} {selectedWishId} />
 {/if}
