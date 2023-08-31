<script lang="ts">
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

<div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
	<!-- Button: Left -->
	<button type="button" class="btn-icon variant-filled-primary" on:click={multiColumnLeft}>
		<iconify-icon class="w-5 justify-center" icon="lucide:arrow-left" />
	</button>

	<!-- Carousel -->
	<div
		bind:this={elemUsers}
		class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto"
	>
		<slot />
	</div>

	<!-- Button-Right -->
	<button type="button" class="btn-icon variant-filled-primary" on:click={multiColumnRight}>
		<iconify-icon class="w-5 justify-center" icon="lucide:arrow-right" />
	</button>
</div>
