<script lang="ts">
	import { fly, type FlyParams } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { isLoadingPage } from '$lib/stores.ts/loading';

	const duration = 250;
	const delay = duration + 33;
	const y = 8;

	beforeNavigate(({ to }) => {
		if (to?.route.id) {
			isLoadingPage.set(true);
		}
	});
	afterNavigate(() => isLoadingPage.set(false));

	const transitionIn: FlyParams = { easing: cubicOut, y, duration, delay };
	const transitionOut: FlyParams = { easing: cubicIn, y: -y, duration };
</script>

{#key $isLoadingPage}
	{#if $isLoadingPage}
		<div />
	{:else}
		<div in:fly={transitionIn} out:fly={transitionOut}>
			<slot />
		</div>
	{/if}
{/key}
