<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	// Your selected Skeleton theme:
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	// Skeleton UI framework
	import {
		AppBar,
		AppShell,
		Drawer,
		LightSwitch,
		Modal,
		
		drawerStore,
		storePopup, 
	} from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import type { LayoutData } from './$types';
	import Avatar from '$lib/components/Avatar.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import PageLoadSpinner from '$lib/components/PageLoadSpinner.svelte';
	import FlashMessageToast from '$lib/components/FlashMessageToast.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });


	export let data: LayoutData;

	$: user = data.user;
	$: userInfo = data.userInfo;
	$: positionClasses = $drawerStore.open ? 'translate-x-[25%]' : '';
</script>

<FlashMessageToast />
<Modal />

<Drawer>
	<h2 class="h2 p-4">Navigation</h2>
	<hr />
	<Navigation/>
</Drawer>

<AppShell
	class="transition-transform {positionClasses}"
	slotSidebarLeft="w-0 md:w-52 bg-surface-500/10"
>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex justify-between items-center gap-4">
					<button
						class="md:hidden btn-icon btn-sm bg-primary-hover-token"
						on:click={() => {
							drawerStore.open();
						}}
						id="al"
						aria-label="Open nav"
					>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<a href="/" class="text-xl btn bg-primary-hover-token font-semibold uppercase">Askov</a>
					<PageLoadSpinner />
				</div>
			</svelte:fragment>

			<div class="flex flex-row justify-between items-center gap-4">
				<a
					href="/wishlist"
					class="hidden md:block text-md btn bg-primary-hover-token font-semibold capitalize"
					>Wishlist
				</a>
				<a
					href="/family"
					class="hidden md:block text-md btn bg-primary-hover-token font-semibold capitalize"
					>Family
				</a>
				<a
				href="/invites"
				class="hidden md:block text-md btn bg-primary-hover-token font-semibold capitalize"
				>invites
			</a>
			</div>

			<svelte:fragment slot="trail">
				<div class="flex justify-between items-center gap-4">
					<LightSwitch />
					{#if user}
						{#if userInfo?.imageUrl}
							<Avatar src={userInfo?.imageUrl || undefined} />
						{:else}
							<Avatar initials={user.email} />
						{/if}
					{:else}
						<a href="/login" class="btn variant-filled-primary">Login</a>
					{/if}
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Router Slot -->

	<main>
		<PageTransition>
			<div class="container p-4 mx-auto transition-transform {positionClasses}">
				<slot />
			</div>
		</PageTransition>
	</main>
	<!-- ---- / ---- -->
</AppShell>
