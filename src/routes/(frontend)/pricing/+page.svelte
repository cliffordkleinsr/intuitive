<script lang="ts">
	import Pricer from '$lib/custom/blocks/pricer.svelte';
	import Meta from '$lib/custom/seo/meta.svelte';
	const props = {
		title: 'Pricing • Intuitive Insights',
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...props} />
<Pricer />
