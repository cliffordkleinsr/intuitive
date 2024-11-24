<script lang="ts">
	import type { PageData } from './$types';
	import Pricer from '$lib/custom/blocks/monet/pricer.svelte';
	let { data }: { data: PageData } = $props();
	const {
		otp,
		features: { plan }
	} = data;
	const pricerprops = {
		onetime: otp,
		selected_plan: plan,
		Message: 'Upgrade'
	};
</script>

<Pricer {...pricerprops} />
