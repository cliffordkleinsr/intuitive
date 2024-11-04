<script lang="ts">
	import Meta from '$lib/custom/seo/meta.svelte';
	import type { SEO } from '$lib/types';
	import type { PageData } from './$types';
	// import { CldImage } from 'svelte-cloudinary';
	let { data }: { data: PageData } = $props();
	let endpoint = $derived(data);

	let Pageprops = $state<SEO>({
		title: '',
		description: '',
		type: ''
	});
	$effect(() => {
		Pageprops = {
			title: `Services • Intuitive Insights KE • ${endpoint.service.title}`,
			description: 'Gather insightful feedback, analyze data, and make informed decisions.',
			type: 'Website'
		};
	});
</script>

<Meta {...Pageprops} />

<section
	class="container mx-auto grid place-content-evenly gap-16 py-10 sm:px-6 lg:grid-cols-2 lg:px-8"
>
	<div class="px-4 py-8 sm:py-8 lg:px-6">
		<div class="mb-8 max-w-screen-md gap-2 lg:mb-16">
			<h2 class="mb-4 text-4xl font-bold tracking-tight text-primary dark:text-white">
				{endpoint.service.title}
			</h2>
			<p class="sm:text-md text-gray-500 dark:text-gray-400">{endpoint.service.sub}</p>
		</div>
		<div class="max-w-screen-md space-y-8 md:grid md:gap-12 md:space-y-0">
			{#each endpoint.service.services as serve}
				<div>
					<h3 class="mb-2 text-lg font-bold dark:text-white">{serve.Name}</h3>
					<p class="text-gray-500 dark:text-gray-400">{serve.content}</p>
				</div>
			{/each}
		</div>
	</div>
	<!-- <CldImage
		class="mx-auto max-w-sm rounded-xl lg:mx-0 lg:my-24 lg:max-w-lg"
		width="auto"
		height="auto"
		src={endpoint.service.img}
		alt="Description of my image"
	/> -->
	<img
		class="mx-auto max-w-sm rounded-xl lg:mx-0 lg:my-24 lg:max-w-lg"
		src={endpoint.service.img}
		alt="s"
	/>
</section>
