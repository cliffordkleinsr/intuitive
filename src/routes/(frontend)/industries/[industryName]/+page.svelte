<script lang="ts">
	import Meta from '$lib/custom/seo/meta.svelte';

	// import Features from '$lib/components/blocks/features.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	// import { CldImage } from 'svelte-cloudinary';
	export let data: PageData;
	// console.log(data)
	$: data;

	const props = {
		title: `Industries • Intuitive Insights KE • ${data.industry.title}`,
		description: 'Gather insightful feedback, analyze data, and make informed decisions.',
		type: 'Website'
	};
</script>

<Meta {...props} />

<div class="container mx-auto place-content-evenly px-4 py-10 sm:px-6 lg:px-8">
	<div class="gap-32 lg:flex">
		<div class="flex flex-col gap-2 space-y-5 lg:max-w-5xl">
			<h2 class="mb-1 text-2xl font-bold text-primary dark:text-white md:text-4xl">
				{data.industry.title}
			</h2>
			<p class="text-md text-gray-800 dark:text-neutral-200">
				<span class="font-bold">The challenge:</span>
				{data.industry.challenge}
			</p>
			<p class="text-md text-gray-800 dark:text-neutral-200 lg:max-w-5xl">
				<span class="font-bold">The solution:</span>
				{data.industry.solution}
			</p>
			{#each data.industry.checks as check}
				<ul class="mt-3 max-w-4xl space-y-4 sm:space-y-4">
					<li class="flex space-x-3">
						<span
							class="mt-0.5 flex size-5 items-center justify-center rounded-full bg-orange-50 text-primary dark:bg-orange-800/30 dark:text-primary"
						>
							<svg
								class="size-3.5 flex-shrink-0"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
							>
						</span>
						<span class="text-sm sm:text-base">
							{check.content}
						</span>
					</li>
				</ul>
			{/each}
		</div>
		<!-- <CldImage
			class="mt-20 rounded-lg dark:shadow-lg dark:shadow-orange-500/50 lg:h-[35em]"
			width="auto"
			height="auto"
			src={data.industry.image}
			alt="industries"
		/> -->
		<img class="lg:h-[35em] rounded-lg mt-20 dark:shadow-lg dark:shadow-orange-500/50" src={data.industry.image} alt="">
	</div>
	<Separator class="mt-10" />
	<h1 class="mt-5 text-lg font-bold antialiased">Example:</h1>
	<p
		class="text-md mt-3 w-full overflow-hidden truncate text-wrap text-gray-800 dark:text-neutral-200"
	>
		{data.industry.examples}
	</p>
</div>
<Separator />
<!-- <Features />  -->
