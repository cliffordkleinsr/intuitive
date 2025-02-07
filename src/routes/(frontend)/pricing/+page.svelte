<script lang="ts">
	import Pricecomponent from '$lib/custom/blocks/newproduct/Pricecomponent.svelte';
	import Pricer from '$lib/custom/blocks/product/pricer.svelte';
	import Meta from '$lib/custom/seo/meta.svelte';
	const props = {
		title: 'Pricing • Intuitive Insights',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
	let pricerprops = {
		table: true,
		applyLogic: false
	};
	// let signup =
</script>

<Meta {...props} />
<!-- <Pricer {...pricerprops} /> -->
<Pricecomponent />
