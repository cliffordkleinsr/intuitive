<script lang="ts">
	import Pricer from '$lib/custom/blocks/monet/pricer.svelte';
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
</script>

<Meta {...props} />
<Pricer {...pricerprops} />
