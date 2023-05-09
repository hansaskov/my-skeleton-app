<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
</script>

<Seo title="Askov | Public" type="WebPage" description="Showcase how a public site is accessable" />

<div class="flex flex-col gap-8 items-center justify-center">
	<h1>Public page</h1>
	<p>Everyone can view the contents of this page</p>
	{#if data.user}
		<p>Hidden data can only be seen when logged in</p>
		{data.user.email}
	{/if}
</div>
