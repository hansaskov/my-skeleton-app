<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;

	const birthdate = data.userInfo.birthdate;
	const year = birthdate?.getFullYear();
	const month = birthdate?.getMonth();
	const day = birthdate?.getDate();
</script>

<Seo
	title="Askov | Private"
	type="WebPage"
	description="Showcase how a private site is accessable"
/>

<div class="flex flex-col gap-2 items-center justify-between">
	<div class="card p-8 w-full text-token space-y-4">
		<h1 class="h1">Protected Page!</h1>
		<p>Name: {data.userInfo.fullname}</p>
		<p>E-mail: {data.user.email}</p>
		<p>Birthday: {day} / {month} / {year}</p>
		<p>Description: {data.userInfo.description}</p>
		<Avatar
			src={data.userInfo.imageUrl || 'Default_pfp.svg'}
			fill="fill-tertiary-80"
			width="w-20"
			border="border-2 	border-surface-300-600-token"
		/>
	</div>
</div>
