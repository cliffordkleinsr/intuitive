<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { featureList } from './pricelist';
	import Portal2 from '../Portals/Portal2.svelte';
	import Check from 'lucide-svelte/icons/check';

	let { signup = true } = $props();
	let list = $state();
	if (!signup) {
		list = featureList.filter((fl) => fl.id !== '1');
	} else {
		list = featureList;
	}
</script>

<div class="mx-auto flex max-w-5xl flex-col p-5">
	<div class="grid w-full gap-2 md:grid-cols-3">
		{#each list as pkg}
			<Card.Root
				class={['flex h-full flex-col', pkg.title === 'Enterprise' && signup ? 'col-span-2' : '']}
			>
				<Card.Header class="text-center">
					<Card.Title>{pkg.title}</Card.Title>
					<Card.Title class="text-4xl">
						${pkg.cost}
					</Card.Title>
					<Card.Description>
						<span>{pkg.comments}</span>
						{#if pkg.title === 'Enterprise'}
							<span class="text-primary">Everything in Professional +</span>
						{/if}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<ul class="mt-7 space-y-2.5 text-sm">
						{#each pkg.features as feat}
							<li class="flex space-x-2">
								<svg
									class="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-500"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
								<span class="text-gray-800 dark:text-neutral-400">
									{feat}
								</span>
							</li>
						{/each}
					</ul>
				</Card.Content>

				<Card.Footer class="mt-auto">
					{#if signup}
						<Button variant="default" class="w-full" href="/client/login">Sign Up</Button>
					{:else}
						<Portal2>
							<!-- trigger -->
							{#snippet trigger({ props })}
								<Button variant="secondary" class="w-full" {...props}>Subscribe</Button>
							{/snippet}
							<!-- children -->
							<div class="mx-auto w-full max-w-md">
								<h1 class="text-2xl">Order Summary</h1>
								<p>Review your selected plan before confirming</p>
								<div class="flex items-center justify-between space-y-4">
									<h3 class="text-lg font-semibold">{pkg.title}</h3>
									<span class="text-2xl font-bold">
										${pkg.cost}
									</span>
								</div>

								<ul class="space-y-2">
									{#each pkg.features.slice(0, 3) as feature}
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
									sessionStorage.setItem(
										'aurium',
										JSON.stringify({
											plan: pkg.title,
											price: pkg.cost
										})
									)}
								href="/client-console/billing/summary"
							>
								Checkout With
								<img
									class="w-14"
									src="https://upload.wikimedia.org/wikipedia/commons/0/0b/M-PESA.png"
									alt="Mpesa"
								/>
							</Button>
						</Portal2>
					{/if}
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
