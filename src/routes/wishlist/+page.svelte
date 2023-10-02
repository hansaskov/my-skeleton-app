<script lang="ts">

import type { PageData } from './$types';

export let data: PageData;

</script>

<div class="flex flex-col items-center justify-center gap-4 mx-auto">

    {#each data.wishlists as wishlist}
        <a class="w-2/3 card card-hover p-4" href="wishlist/{wishlist.id}">
            <h2 class="h2 flex justify-center pb-4"> {wishlist.name} </h2>
            <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto">
                {#each Array.from({ length: 5 }) as _, i}
                    <div class="snap-start shrink-0 card bg-surface-backdrop-token py-20 w-40 md:w-80 text-center">{i + 1}</div>
                {/each} 
            </div>
        </a>

        
    {/each}


    <a href="/wishlist/create" class="text-md btn variant-filled font-semibold capitalize">   
        Create new wishlist
    </a>
</div>










