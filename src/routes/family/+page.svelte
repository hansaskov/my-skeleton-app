<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let elemUsers: HTMLDivElement;

	function multiColumnLeft(): void {
		let x = elemUsers.scrollWidth;
		if (elemUsers.scrollLeft !== 0) x = elemUsers.scrollLeft - elemUsers.clientWidth;
		elemUsers.scroll(x, 0);
	}

	function multiColumnRight(): void {
		let x = -0;
		// -1 is used because different browsers use different methods to round scrollWidth pixels.
		if (elemUsers.scrollLeft < elemUsers.scrollWidth - elemUsers.clientWidth - 1)
			x = elemUsers.scrollLeft + elemUsers.clientWidth;
		elemUsers.scroll(x, 0);
	}
</script>

<div class="flex flex-col gap-8 items-center justify-center">
	<h1 class="h1 capitalize">Your family page</h1>

	{#if data.families}
		{#each data.families as family}
			<h3 class="h3 capitalize">Family {family.name}</h3>
			<div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
				<!-- Button: Left -->
				<button type="button" class="btn-icon variant-filled" on:click={multiColumnLeft}>
					<iconify-icon class="w-5 justify-center" icon="lucide:arrow-left" />
				</button>
				<!-- Carousel -->
				<div
					bind:this={elemUsers}
					class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto"
				>
					{#each family.users as familyMember}
						<a
							href={familyMember.userInfo?.imageUrl}
							target="_blank"
							class="shrink-0 w-[28%] snap-start"
						>
							<img
								class="rounded-container-token hover:brightness-75"
								src={familyMember.userInfo?.imageUrl}
								alt={familyMember.userInfo?.fullname}
								title={familyMember.userInfo?.fullname}
								loading="lazy"
							/>
						</a>
					{/each}
				</div>
				<!-- Button-Right -->
				<button type="button" class="btn-icon variant-filled" on:click={multiColumnRight}>
					<iconify-icon class="w-5 justify-center" icon="lucide:arrow-right" />
				</button>
			</div>
		{/each}
	{/if}
</div>
