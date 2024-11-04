<script lang="ts">
	import Meta from '$lib/custom/seo/meta.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import type { SEO } from '$lib/types';
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
			title: `Industries • Intuitive Insights KE • ${endpoint.industry.title}`,
			description: 'Gather insightful feedback, analyze data, and make informed decisions.',
			type: 'Website'
		};
	});
</script>

<Meta {...Pageprops} />

<div class="container mx-auto place-content-evenly px-4 py-10 sm:px-6 lg:px-8">
	<div class="gap-32 lg:flex">
		<div class="flex flex-col gap-2 space-y-5 lg:max-w-5xl">
			<h2 class="mb-1 text-2xl font-bold text-primary dark:text-white md:text-4xl">
				{endpoint.industry.title}
			</h2>
			<p class="text-md text-gray-800 dark:text-neutral-200">
				<span class="font-bold">The challenge:</span>
				{endpoint.industry.challenge}
			</p>
			<p class="text-md text-gray-800 dark:text-neutral-200 lg:max-w-5xl">
				<span class="font-bold">The solution:</span>
				{endpoint.industry.solution}
			</p>
			{#each endpoint.industry.checks as check}
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
			src={endpoint.industry.image}
			alt="industries"
		/> -->
		<img
			class="mt-20 rounded-lg dark:shadow-lg dark:shadow-orange-500/50 lg:h-[35em]"
			src={endpoint.industry.image}
			alt=""
		/>
	</div>
	<Separator class="mt-10" />
	<h1 class="mt-5 text-lg font-bold antialiased">Example:</h1>
	<p
		class="text-md mt-3 w-full overflow-hidden truncate text-wrap text-gray-800 dark:text-neutral-200"
	>
		{endpoint.industry.examples}
	</p>
</div>
<Separator />
