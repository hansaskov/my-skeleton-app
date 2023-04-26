<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h1>Profile</h1>
<div>
	<p>User id: {data.user.userId}</p>
	<p>Username: {data.user.username}</p>
</div>