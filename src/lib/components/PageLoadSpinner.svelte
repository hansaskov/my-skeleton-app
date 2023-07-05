<script lang="ts">
	import { isLoadingForm, isLoadingPage } from '$lib/stores.ts/loading';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	// Only show spinner if page transition takes more than 100ms
	const wait = (delay: number | undefined) => new Promise((res) => setTimeout(res, delay));
</script>

{#if $isLoadingForm || $isLoadingPage}
	<!-- svelte-ignore empty-block -->
	{#await wait(150) then}
		<div transition:fade|global>
			<ProgressRadial
				stroke={125}
				meter="stroke-secondary-500"
				track="stroke-primary-800/20"
				width="w-10"
			/>
		</div>
	{/await}
{/if}
