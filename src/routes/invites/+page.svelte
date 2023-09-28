<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;

	const invites = data.familyInvites;
	const pendingInvites = data.pendingInvites;
</script>

    <div class="my-4" />
	{#if invites.length > 0}
		<div
			class="w-full text-token card variant-glass-surface shadow-2xl p-4 border border-surface-700
        rounded-container-token space-y-4"
		>
			<dl class="list-dl">
				{#each invites as { family, user, id: inviteId }, i}
					{#if i != 0}
						<hr />
					{/if}
					<div class="flex justify-between">
						<Avatar src={user.info.imageUrl ?? undefined} width="w-12" rounded="rounded-md"
						></Avatar>
						<p class="truncate">
							<span class="font-semibold">{user.info.fullname}</span> Has invited you to join family
							<span class="uppercase font-bold"> {family.name}</span>
						</p>
						<form method="post" action="?/accept">
							<input hidden name="familyId" bind:value={family.id} />
							<input hidden name="inviteId" bind:value={inviteId} />
							<button class="btn variant-outline-primary">Accept</button>
							<button formaction="?/decline" class="btn variant-outline-primary">Decline</button>
						</form>
					</div>
				{/each}
			</dl>
		</div>
	{:else}
		You have no invites
	{/if}



	{#if pendingInvites.length > 0}
        
    <hr class="my-8"/>
        
        <h3 class="flex h3 items-start justify-start">  </h3>
		<div
			class="w-full text-token card variant-glass-surface shadow-2xl p-4 border border-surface-700
    rounded-container-token space-y-4"
		>
			<dl class="list-dl">
				{#each pendingInvites as { family, id: inviteId, email}, i}
					{#if i != 0}
						<hr />
					{/if}
					<div class="flex justify-between">
						<Avatar initials={email} width="w-12" rounded="rounded-md"
						></Avatar>
						<p class="truncate">
							You have invited
							<span class="font-semibold">{email}</span>
							to join family
							<span class="uppercase font-bold"> {family.name}</span>
						</p>
						<form  method="post" action="?/accept">
							<input hidden name="inviteId" bind:value={inviteId} />
							<button  formaction="?/decline" class="w- btn variant-outline-primary">Cancel</button>
						</form>
					</div>
				{/each}
			</dl>
		</div>
	{/if}
