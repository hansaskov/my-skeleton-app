<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>


<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	
	<div class="card p-8 w-full text-token space-y-4">
		<h1>Profile</h1>
		<p>User id: {data.user.userId}</p>
		<p>Email: {data.user.email}</p>
	</div>

</div>
