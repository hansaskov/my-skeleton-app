<script lang="ts">
	import type { Currency } from "$lib/server/drizzle/schema";

    export let price: number;
    export let currency: Currency;
  
    let formattedPrice: string;
  
    $: {
      switch(currency) {
        case "DKK":
          formattedPrice = `${price} kr`;
          break;
        case "EUR":
          formattedPrice = `€${price}`;
          break;
        case "USD":
          formattedPrice = `$${price}`;
          break;
        case "GBP":
          formattedPrice = `£${price}`;
          break;
        default:
          formattedPrice = `${price}`;
          break;
      }
    }
  </script>
  
  <style>
    /* Optional styling */
  </style>
  
  <span>{formattedPrice}</span>
  