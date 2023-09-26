<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import TextField from '$lib/components/form/TextField.svelte';
	import { handleMessage } from '$lib/components/ToastManager';
	import { getToastStore } from '@skeletonlabs/skeleton';


	export let data: PageData;

	const toastStore = getToastStore()
	let oldBirthdate = ''
	let oldFullname = ''


	const form = superForm(data.form, {
		taintedMessage: null,
		delayMs: 150,
		onUpdated({form}) {
			if (form.message) {
				handleMessage(form.message, toastStore)
				if (form.message.type === 'success'){
					oldBirthdate = form.data.birthdate
					oldFullname = form.data.fullname
					changed = false
				}
			}
		},
	});

	const {form: formData} = form

	oldBirthdate = $formData.birthdate
	oldFullname = $formData.fullname
	let changed = false

	form.form.subscribe(({birthdate, fullname}) => {
		changed = (oldBirthdate != birthdate) || (oldFullname != fullname)
	})

</script>


<Seo
	title="Askov | Settings"
	type="WebPage"
	description="Showcase how a private site is accessable"
/>

<div class="flex flex-col items-center justify-center pt-8 mx-auto">
	<form method="POST" use:form.enhance>
		<div class="card p-8 w-fit text-token space-y-4">
			<h3 class="h3 font-semibold">{$formData.fullname} settings</h3>

			<TextField field="fullname"  type="text" {form} titleName="Your Full name"  />
			<TextField field="birthdate" type="date" {form} titleName="Your Birthdate"   />

			<button class="btn variant-filled-primary w-full" disabled={!changed} >Submit</button>
		</div>
	</form>
</div>