<script lang="ts">
	import Prim from './prim.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { clientPackage } from './sub.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { cardList } from './items';
	import Portal2 from './Portal2.svelte';

	let {
		table = false,
		applyLogic = true,
		href = '/client/register',
		Message = 'Sign Up'
	} = $props();

	let checked = $state(false);
	let portalporps = {
		title: 'Order Summary',
		desctiption: 'For package'
	};
</script>

<Prim {table} >
	{#snippet switcher()}
		<Switch id="annual" bind:checked />
	{/snippet}
	{#snippet cardItems()}
		{#each cardList as item}
			<Card.Root
				class="{item.subtitles === clientPackage.plan
					? 'border-primary'
					: ''} h-full transition duration-1000 dark:shadow-lg hover:dark:shadow-orange-500/50"
			>
				<Card.Header>
					{#if item.subtitles === 'Standard Business'}
						<Button class="mx-auto h-6 w-32" disabled>MOST POPULAR</Button>
					{/if}

					<Card.Title class="pb-5 text-center font-bold">{item.subtitles}</Card.Title>

					{#if checked}
						<Card.Title class="pb-2 text-center text-5xl font-bold">${item.offers}</Card.Title>
					{:else}
						<Card.Title class="pb-2 text-center text-5xl font-bold"
							>{item.subtitles === 'Enterprise' ? '' : '$'}{item.prices}</Card.Title
						>
					{/if}
					<Card.Description class="text-center">{item.comments}</Card.Description>
				</Card.Header>
				<Card.Content>
					<ul class="mt-7 space-y-2.5 text-sm">
						{#each item.features as feat}
							<li class="flex space-x-2">
								<svg
									class="mt-0.5 size-4 flex-shrink-0 text-blue-600 dark:text-blue-500"
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
								<span class="text-gray-800 dark:text-neutral-400">
									{feat}
								</span>
							</li>
						{/each}
					</ul>
				</Card.Content>
				<Card.Footer>
					{#if item.subtitles === 'Enterprise'}
						<Button variant="outline" class="w-full " href="/about#contact">Contact Support</Button>
					{:else if applyLogic}
						<Portal2 {...portalporps}>
							{#snippet trigger({ props })}
								<Button {...props} variant="outline" class="w-full">Hello</Button>
							{/snippet}
						</Portal2>
					{:else}
						<Button variant="outline" class=" w-full" {href}>
							{Message}
						</Button>
					{/if}
				</Card.Footer>
			</Card.Root>
		{/each}
	{/snippet}
</Prim>
