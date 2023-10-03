<script lang="ts">

import type { PageData } from './$types';

export let data: PageData;

</script>

<div class="flex flex-col items-center justify-center gap-4 mx-auto px-4 py-8">

    <!-- Main Title -->
    <h1 class="h1 font-bold mb-6">Your Wishlists</h1>

    <!-- Wishlist Loop -->
    {#each data.wishlists as wishlist}
        <a class="w-full md:w-2/3 card card-hover p-4 mb-4 border border-gray-700 rounded-lg hover:shadow-lg transition-shadow duration-300" href="wishlist/{wishlist.id}">

            <!-- Wishlist Title and Count -->
            <h2 class="h2 flex justify-between items-center pb-4">
                <span class="text-2xl">{wishlist.name}</span>
                <span class="text-sm text-gray-500">({wishlist.wishs.length} items)</span>
            </h2>

            <!-- Items within Wishlist -->
            <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto">
                {#each wishlist.wishs as wish, i}
                    <div class="snap-start shrink-0 card bg-surface-backdrop-token py-20 w-40 md:w-80 text-center relative overflow-hidden rounded-lg hover:shadow-md transition-shadow duration-300">
                        
                        <!-- Wish Image -->
                        {#if wish.imageUrl}
                            <img src={wish.imageUrl} alt={wish.name} class="absolute top-0 left-0 w-full h-full object-cover rounded-lg" />
                        {/if}

                        <!-- Wish Name Overlay -->
                        <div class="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-center py-2 text-lg font-semibold">
                            {wish.name}
                        </div>
                    </div>
                {/each}
            </div>
        </a>
    {/each}

    <!-- Create Wishlist Button -->
    <a href="/wishlist/create" class="text-lg btn variant-filled font-semibold capitalize mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
        Create new wishlist
    </a>
</div>
