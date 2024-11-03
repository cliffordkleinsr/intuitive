<script>
	import Hero from '$lib/custom/homecomponents/hero.svelte';
	import Newfeats from '$lib/custom/homecomponents/newfeats.svelte';
	import Meta from '$lib/custom/seo/meta.svelte';

	const props = {
		title: 'Intuitive Insights KE',
		description: 'Gather Insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...props} />
<Hero />
<Newfeats />
