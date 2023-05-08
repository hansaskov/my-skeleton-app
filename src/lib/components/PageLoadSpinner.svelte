<script lang="ts">
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	// Only show spinner if page transition takes more than 100ms
	const wait = (delay: number | undefined) => new Promise((res) => setTimeout(res, delay));

	let isLoading = false;
	beforeNavigate(({ to }) => {
		if (to?.route.id) {
			isLoading = true;
		}
	});
	afterNavigate(() => (isLoading = false));
</script>

{#if isLoading}
	<!-- svelte-ignore empty-block -->
	{#await wait(150) then}
		<div transition:fade>
			<ProgressRadial
				stroke={125}
				meter="stroke-primary-400"
				track="stroke-primary-500/30"
				width="w-8"
			/>
		</div>
	{/await}
{/if}
