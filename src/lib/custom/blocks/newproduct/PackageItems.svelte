<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	// import { hasContext } from 'svelte';

	import Check from 'lucide-svelte/icons/check';
	import { packageList } from './items';
	import { slide } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import { getContext } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import Portal2 from '../Portals/Portal2.svelte';

	let { cluster } = $props();
	// $inspect(getContext('logic'))
	let logic = getContext('logic');
	const isDesktop = new MediaQuery('min-width: 768px');
</script>

{#if !isDesktop.current}
	{#if cluster === 'advantage'}
		<div
			class="grid w-full gap-2 py-2 text-center text-sm font-semibold text-muted-foreground"
			transition:slide={{ duration: 500, easing: sineInOut, delay: 300, axis: 'y' }}
		>
			<p>
				* This price represents a sum total of 6 packages for each specified package (except
				premium).
			</p>
			<p>Each package in this cluster applies a 5% discount</p>
		</div>
	{:else if cluster === 'advanced'}
		<div
			class="grid w-full gap-2 py-2 text-center text-sm font-semibold text-muted-foreground"
			transition:slide={{ duration: 400, easing: sineInOut, delay: 400 }}
		>
			<p>* This price represents a sum total of 10 packages for each specified package.</p>
			<p>Each package in this cluster applies a 10% discount</p>
		</div>
	{/if}
{/if}
<div class="grid gap-1 md:grid-cols-3">
	{#each packageList as pkg}
		<Card.Root class="relative overflow-hidden">
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
				<ul class="mt-7 h-64 space-y-2.5 text-sm">
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
				{#if logic}
					<Button variant="secondary" class=" w-full" href="/client/login">Sign Up</Button>
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
									${cluster === 'advantage'
										? pkg.six_pack
										: cluster === 'advanced'
											? pkg.ten_pack
											: pkg.one_pack}
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
							<div class="border-b py-5 outline-2">
								<span class="text-lg font-semibold"> Package type: </span>
								<span class="float-end text-end text-lg font-bold">
									{cluster === 'advantage'
										? '6 Pack'
										: cluster === 'advanced'
											? '10 Pack'
											: 'On Demand'}
								</span>
							</div>
						</div>
						<Button
							class="mt-3 w-full max-w-md"
							variant="black"
							onclick={() =>
								localStorage.setItem(
									'aurium',
									JSON.stringify({
										plan: pkg.title,
										price:
											cluster === 'advantage'
												? pkg.six_pack
												: cluster === 'advanced'
													? pkg.ten_pack
													: pkg.one_pack,
										packagetype:
											cluster === 'advantage'
												? 'six_pack'
												: cluster === 'advanced'
													? 'ten_pack'
													: 'one_pack'
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
{#if isDesktop.current}
	{#if cluster === 'advantage'}
		<div
			class="grid w-full gap-2 py-2 text-center text-sm font-semibold text-muted-foreground"
			transition:slide={{ duration: 500, easing: sineInOut, delay: 300, axis: 'y' }}
		>
			<p>
				* This price represents a sum total of 6 packages for each specified package (except
				premium).
			</p>
			<p>Each package in this cluster applies a 5% discount</p>
		</div>
	{:else if cluster === 'advanced'}
		<div
			class="grid w-full gap-2 py-2 text-center text-sm font-semibold text-muted-foreground"
			transition:slide={{ duration: 400, easing: sineInOut, delay: 400 }}
		>
			<p>* This price represents a sum total of 10 packages for each specified package.</p>
			<p>Each package in this cluster applies a 10% discount</p>
		</div>
	{/if}
{/if}
