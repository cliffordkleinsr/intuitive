<script>
	import Meta from '$lib/custom/seo/meta.svelte';
	import { CldImage } from 'svelte-cloudinary';
	export let data;
	$: data;
	const props = {
		title: `Services • Intuitive Insights KE • ${data.service.title}`,
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...props} />

<section
	class="container mx-auto grid place-content-evenly gap-16 py-10 sm:px-6 lg:grid-cols-2 lg:px-8"
>
	<div class="px-4 py-8 sm:py-8 lg:px-6">
		<div class="mb-8 max-w-screen-md gap-2 lg:mb-16">
			<h2 class="mb-4 text-4xl font-bold tracking-tight text-primary dark:text-white">
				{data.service.title}
			</h2>
			<p class="sm:text-md text-gray-500 dark:text-gray-400">{data.service.sub}</p>
		</div>
		<div class="max-w-screen-md space-y-8 md:grid md:gap-12 md:space-y-0">
			{#each data.service.services as serve}
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
		src={data.service.img}
		alt="Description of my image"
	/> -->
	<img class="lg:my-24 rounded-xl max-w-sm lg:max-w-lg mx-auto lg:mx-0" src={data.service.img} alt="s">
</section>
