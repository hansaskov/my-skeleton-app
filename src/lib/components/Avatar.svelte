<script lang="ts">
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import IconButton from './IconButton.svelte';

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'avatarPopup',
		placement: 'bottom-end',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};
</script>

<!-- Avatar button-->
<button use:popup={popupSettings}>
	<Avatar
		initials="HA"
		width="w-10"
		border="border-4 	border-surface-300-600-token hover:!border-primary-500"
		cursor="cursor-pointer"
	/></button
>

<!-- Pop up -->
<div class="card w-48 p-2" data-popup="avatarPopup">
	<div class=" w-full">
		<IconButton icon="lucide:gift" name="My wishlist" href="/wishlist" />
		<hr />
		<IconButton icon="lucide:settings" name="Settings" href="/settings" />
		<hr />
		<IconButton icon="lucide:log-out" name="Logout" href="/logout" />
	</div>

</div>
