
<script lang=ts>
	import SelectField from "$lib/components/form/SelectField.svelte";
	import TextField from "$lib/components/form/TextField.svelte";
	import type { Message } from "$lib/schemas/message";
	import type { NewWishSchema } from "$lib/server/drizzle/schema";
	import type { SuperForm } from "sveltekit-superforms/client";

    export let form: SuperForm<typeof NewWishSchema, Message>;



    
</script>

<div class="flex flex-col items-center justify-center pt-12 mx-auto space-y-8">
    <form method="POST" action="?/create" use:form.enhance>
        <div class="card p-8 w-full space-y-4">
            <h3 class="h3 font-semibold">Add a new item to your wishlist!</h3>
            <TextField {form} field="name" titleName="Name" placeholder="Iphone 7" />
            <TextField {form} field="price" type="number" titleName="Price" placeholder="799" />
            <SelectField
                {form}
                field="currency"
                titleName="Currency"
                choises={['DKK', 'EUR', 'USD', 'GBP']}
            />
            <TextField
                {form}
                field="imageUrl"
                titleName="Image url (optional)"
                placeholder="https://apple.com/iphone_7.png"
            />
            <TextField {form} field="wishlistId" type="hidden" />
            <button class="btn variant-filled-primary w-full">Submit</button>
        </div>
    </form>
</div>