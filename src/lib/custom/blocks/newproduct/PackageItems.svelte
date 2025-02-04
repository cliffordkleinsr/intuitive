<script>
	import * as Card from '$lib/components/ui/card';

	import { Separator } from '$lib/components/ui/separator';

	import Check from 'lucide-svelte/icons/check';
	import { packageList } from './items';
	import { fly, slide } from 'svelte/transition';
	import { cubicInOut, sineInOut } from 'svelte/easing';

	let { cluster } = $props();
</script>

<div class="grid grid-cols-3 gap-1">
	{#each packageList as pkg}
		<Card.Root class="relative  overflow-hidden">
			{#if cluster === 'advantage' && pkg.title !== 'Enterprise'}
				<div class="absolute left-0 top-0 h-16 w-16">
					<!-- ribbon -->

					<div
						class="absolute left-[-34px] top-[32px] w-[160px] -rotate-45 transform bg-primary py-1 text-center text-sm font-semibold text-white"
					>
						Save 5%
					</div>

					<!-- end ribbon -->
				</div>
			{:else if cluster === 'advanced'}
				<div class="absolute left-0 top-0 h-16 w-16">
					<!-- ribbon -->

					<div
						class="absolute left-[-34px] top-[32px] w-[160px] -rotate-45 transform bg-primary py-1 text-center text-sm font-semibold text-white"
					>
						Save 10%
					</div>

					<!-- end ribbon -->
				</div>
			{/if}

			<Card.Header class="text-center">
				<Card.Title>{pkg.title}</Card.Title>
				<Card.Title class="text-4xl">
					${cluster === 'advantage'
						? pkg.six_pack
						: cluster === 'advanced'
							? pkg.ten_pack
							: pkg.one_pack}
				</Card.Title>
				<Card.Description>{pkg.comments}</Card.Description>
			</Card.Header>
			<Card.Content>
				<ul class="mt-7 space-y-2.5 text-sm">
					{#each pkg.features as feat}
						<li class="flex space-x-2">
							<Check class="size-4 text-blue-700" />
							<span class="text-gray-800 dark:text-neutral-400">
								{feat}
							</span>
						</li>
					{/each}
				</ul>
			</Card.Content>
			<Card.Footer>
				<Separator />
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
{#if cluster === 'advantage'}
	<div
		class="mt-10 grid w-full gap-2 text-center text-sm text-muted-foreground"
		transition:slide={{ duration: 500, easing: sineInOut, delay: 300, axis: 'y' }}
	>
		<p>* This price represents a sum total of 6 packages for each specified package.</p>
		<p>Each package in this cluster applies a 5% discount</p>
	</div>
{:else if cluster === 'advanced'}
	<div
		class="mt-10 grid w-full gap-2 text-center text-sm text-muted-foreground"
		transition:slide={{ duration: 400, easing: sineInOut, delay: 400 }}
	>
		<p>* This price represents a sum total of 10 packages for each specified package.</p>
		<p>Each package in this cluster applies a 10% discount</p>
	</div>
{/if}
