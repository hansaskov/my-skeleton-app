<script lang="ts">
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	let popupSettings: PopupSettings = {
		event: 'click',
		target: 'avatarPopup',
		placement: 'bottom-end',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	export let initials: string | undefined = undefined;
	export let src: string | undefined = undefined;
</script>

<!-- Avatar button-->
<button use:popup={popupSettings}>
	<Avatar
		{initials}
		{src}
		fill="fill-tertiary-50"
		width="w-11"
		border="border-2 	border-surface-300-600-token hover:!border-primary-500"
		cursor="cursor-pointer"
	/></button
>

<!-- Pop up -->
<div class="card w-48 px-1" data-popup="avatarPopup">
	<div class=" w-full">
		<a href="/settings" class="btn bg-primary-hover-token w-full my-1">
			<iconify-icon class="w-5 justify-center" icon="lucide:settings" />
			<p class="flex-grow text-justify">Settings</p>
		</a>
		<hr />
		<form method="POST" action="/logout">
			<button type="submit" class="btn bg-primary-hover-token w-full my-1">
				<iconify-icon class="w-5 justify-center" icon="lucide:log-out" />
				<p class="flex-grow text-justify">Log out</p>
			</button>
		</form>
	</div>
</div>
