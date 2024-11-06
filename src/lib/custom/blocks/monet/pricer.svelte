<script lang="ts">
	import Prim from './prim.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { cardList, otp } from './items';
	import Portal2 from './Portal2.svelte';
	import Check from 'lucide-svelte/icons/check';

	let {
		table = false,
		applyLogic = true,
		href = '/client/register',
		Message = 'Sign Up',
		onetime = false,
		selected_plan = ''
	} = $props();

	let checked = $state(false);
	let cardlists = $state.raw(cardList);
	if (!onetime) {
		cardlists = [...cardList, otp];
	}
</script>

<Prim {table}>
	{#snippet switcher()}
		<Switch id="annual" bind:checked />
	{/snippet}
	{#snippet cardItems()}
		{#each cardlists as item}
			<Card.Root
				class="h-full transition duration-1000 dark:shadow-lg hover:dark:shadow-orange-500/50"
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
						<Portal2>
							{#snippet trigger({ props })}
								<Button {...props} variant="outline" class="w-full">
									{selected_plan === item.prices ? 'Current Plan' : Message}
								</Button>
							{/snippet}
							<div class="mx-auto w-full max-w-md">
								<h1 class="text-2xl">Order Summary</h1>
								<p>Review your selected plan before confirming</p>
								<div class="flex items-center justify-between space-y-4">
									<h3 class="text-lg font-semibold">{item.subtitles}</h3>
									<span class="text-2xl font-bold"
										>${checked !== true ? item.prices : String(parseInt(item.offers) * 12)}</span
									>
								</div>
								<p class="mb-1 text-sm text-muted-foreground">
									Billed {checked !== true ? 'Monthly' : 'Yearly'}
								</p>
								<ul class="space-y-2">
									{#each item.features.slice(0, 3) as feature}
										<li class="flex items-center">
											<Check class="mr-2 h-4 w-4 text-green-500" />
											<span class="text-sm">{feature}</span>
										</li>
									{/each}
								</ul>
							</div>
							<Button
								class="mt-3 w-full max-w-md"
								variant="black"
								onclick={() =>
									localStorage.setItem(
										'aurium',
										JSON.stringify({
											plan: item.subtitles,
											price: checked !== true ? item.prices : String(parseInt(item.offers) * 12)
										})
									)}
								href="/client-console/billing/summary"
							>
								Confirm Order
							</Button>
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
