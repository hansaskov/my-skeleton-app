<script lang="ts">
	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { inviteFamilyMemberSchema } from '$lib/schemas/family';
	import TextField from '$lib/components/form/TextField.svelte';
	import type { Message } from '$lib/schemas/message';

	const modalStore = getModalStore()

	export let form: SuperForm<typeof inviteFamilyMemberSchema, Message>;
	export let familyId: string;


	const errors = form.allErrors;
</script>

<!-- @component This example creates a simple form modal. -->
<div class="modal-example-form card px-4 py-4 w-modal shadow-xl space-y-4">
	<header class="text-2xl font-bold">Family invitation!</header>
	<article>Invite a new family member by inserting their email!</article>

	<form method="post" action="?/inviteToFamily" >
		<div class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
			<TextField {form} field="email" titleName="E-mail" placeholder="Their email" />
			<input type="hidden" name="familyId" bind:value={familyId} />
		</div>
		<div class=" mt-4 flex justify-start flex-row-reverse gap-4">
			<button class="btn variant-filled" disabled={$errors.length > 0} >Invite member</button>
			<button class="btn variant-outline" on:click={() => modalStore.close()}>Close</button>
		</div>
	</form>
</div>
