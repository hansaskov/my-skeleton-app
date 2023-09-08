<script lang="ts">
	import Carosel from '$lib/components/carosel/Carosel.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	import { Avatar, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import InviteComponent from './inviteComponent.svelte';
	import DeleteComponent from './deleteComponent.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { inviteFamilyMemberSchema } from '$lib/schemas/family';
	import { handleMessage } from '$lib/components/ToastManager';

	const modalStore = getModalStore()
	const toastStore = getToastStore()

	const inviteFamilyMemberForm = superForm(data.inviteFamilyMemberForm, {
		resetForm: true,
		validationMethod: 'oninput',
		validators: inviteFamilyMemberSchema,
		onUpdated({form}) {
			if (form.message) {
				handleMessage(form.message, toastStore)
			}
		},
	});


function inviteUserModal(familyId: string) {
	const modalComponent: ModalComponent = {
		ref: InviteComponent,
		props: { form: inviteFamilyMemberForm , familyId: familyId},
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	modalStore.trigger(modal)
	return undefined
} 

function deleteFamilyModal({familyId, familyName}: { familyId: string, familyName: string}) {
	const modalComponent: ModalComponent = {
		ref: DeleteComponent,
		props: { familyId, familyName},
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	modalStore.trigger(modal)
	return undefined

}

</script>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<div class="flex flex-col gap-8 items-center justify-center">
		<h1 class="h1 capitalize">Your family page</h1>

		{#if data.families}
			{#each data.families as {family, familyRole}}
				<div class="flex flex-col px-2 variant-glass-surface card items-center">
					<header class="card-header">
						<h2 class="h2 capitalize">{family.name}</h2>
					</header>
					<section class="p-2">
						<Carosel>
							{#each family.familiesOnUsers as {user}}
								<div class="relative card-hover w-32 h-48">
									{#if user.info?.imageUrl}
									<a href={user.info?.imageUrl} target="_blank">
										<img
											class="rounded-container-token object-cover w-full h-full"
											src={user.info.imageUrl ?? "static/Default_pfp.svg"}
											alt={user.info.fullname}
											title={user.info.fullname}
											loading="lazy"
										/>
									</a>
									{:else}
									<Avatar initials={user.info.fullname} width="w-full h-full" background="bg-surface-300-600-token" border="rounded-lg"  ></Avatar>
									{/if}
									{#if familyRole == 'MODERATOR'}
										<button
										type="button"
										class="btn-icon btn-icon-sm absolute top-2 right-2 variant-ghost-error">
										<iconify-icon width="16" height="16" icon="lucide:x" />
									</button>
										
									{/if}
 
								</div>
							{/each}
						</Carosel>
					</section>
					{#if familyRole == 'MODERATOR'}
					<footer class="card-footer flex flex-row gap-4">
						<button class="btn btn-sm variant-filled font-semibold w-16" on:click={inviteUserModal(family.id)}>Invite</button>
						<button class="btn btn-sm variant-filled font-semibold w-16" on:click={deleteFamilyModal({familyId: family.id, familyName: family.name })}>Delete</button>
					</footer>
					{/if}
				</div>
			{/each}
		{/if}

		<a href="/family/create" class="text-md btn variant-filled font-semibold capitalize"
			>Create family
		</a>
	</div>
</div>
