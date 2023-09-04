<script lang="ts">
	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore()

	export let familyId: string;
	export let familyName: string;

</script>

<!-- @component This example creates a simple form modal. -->
<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
	<header class="text-2xl font-bold">Delete the family "{familyName}" ?</header>
	<article>Are you sure you want to delete the family {familyName}? This action cannot be reverted</article>

	<form method="post" action="?/deleteFamily" >
		<input type="hidden" name="familyId" bind:value={familyId} />
		<div class=" mt-4 flex justify-end gap-4">
			<div class="btn variant-filled"  on:click={() => modalStore.close()} on:keypress={() => modalStore.close()} aria-label="Close" role='button' tabindex=-1>Close</div>
			<button class="btn variant-filled-error">Delete</button>
		</div>
	</form>
</div>
