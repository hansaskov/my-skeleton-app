<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const birthdate = data.userInfo.birthdate;
	const year = birthdate?.getFullYear();
	const month = birthdate?.getMonth();
	const day = birthdate?.getDate();
</script>

<Seo
	title="Askov | Settings"
	type="WebPage"
	description="Showcase how a private site is accessable"
/>

<div class="flex flex-col gap-2 items-center justify-between">
	<div class="card p-8 w-full text-token space-y-4">
		<h1 class="h1">{data.userInfo.fullname}</h1>
		<p>E-mail: {data.user?.email}</p>
		<p>Birthday: {day} / {month} / {year}</p>
	</div>
</div>
