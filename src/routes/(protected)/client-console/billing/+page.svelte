<script lang="ts">
	import type { PageData } from './$types';
	import Pricer from '$lib/custom/blocks/monet/pricer.svelte';

	let { data }: { data: PageData } = $props();
	const { otp } = data;
	let value = $state('4826298');
	const pricerprops = {
		onetime: otp,
		Message: 'Select Plan'
	};
</script>

<div class="m-5 flex justify-center">
	<Pricer {...pricerprops} />
</div>
