<script lang="ts">
	export let icon: string;
	export let name: string;
	export let href: string;
</script>

<a {href} class="btn bg-primary-hover-token w-full">
	<iconify-icon class="w-5 justify-center" {icon} />
	<p class="flex-grow text-justify">{name}</p>
</a>
