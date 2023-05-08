<script lang="ts">
	import { fly, type FlyParams } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let isLoading = false;
	beforeNavigate(({ to }) => {
		if (to?.route.id) {
			isLoading = true;
		}
	});

	afterNavigate(() => (isLoading = false));

	const duration = 250;
	const delay = duration + 33;
	const y = 8;

	export let pathname: string;

	const transitionIn: FlyParams = { easing: cubicOut, y, duration, delay };
	const transitionOut = { easing: cubicIn, y: -y, duration };
</script>

{#key pathname}
	<div in:fly={transitionIn} out:fly={transitionOut}>
		<slot />
	</div>
{/key}
