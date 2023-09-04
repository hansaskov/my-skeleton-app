<script>

	import { getDrawerStore } from "@skeletonlabs/skeleton";
    import { page } from "$app/stores";

    const drawerStore = getDrawerStore()

    $page.url.pathname

</script>
<nav class="list-nav p-4">
    <ul>
        <li><a href="/wishlist" on:click={drawerStore.close} >Wishlist</a></li>
        <li><a href="/family" on:click={drawerStore.close}>Family</a></li>
        <li><a href="/invites" on:click={drawerStore.close}>Invites</a></li>
    </ul>
</nav>