<script lang="ts">
	import type { PageData } from './$types';
	import Pricer from '$lib/custom/blocks/product/pricer.svelte';
	import Pricecomponent from '$lib/custom/blocks/newproduct/Pricecomponent.svelte';

	let { data }: { data: PageData } = $props();
	const signup = false;
	// const { otp } = data;
	// let value = $state('4826298');
	// const pricerprops = {
	// 	onetime: otp,
	// 	Message: 'Select Plan'
	// };
</script>

<div class="flex justify-center py-5">
	<!-- <Pricer {...pricerprops} /> -->
	<Pricecomponent {signup} />
</div>
