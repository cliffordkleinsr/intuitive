<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import Check from 'lucide-svelte/icons/check';
	import Minus from 'lucide-svelte/icons/minus';
	import { clientPackage } from '$lib/store';
	import * as Dialog from '$lib/components/ui/dialog';

	import type { CartItems } from '$lib/custom/functions/helpers';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Input } from '$lib/components/ui/input';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let checked = false;
	let isDesktop = true;

	if (browser) {
		isDesktop = window.innerWidth >= 768;
	}
	export let table: boolean = true;
	export let applyLogic: boolean = false;
	export let href: string = '/client/register';
	export let Message: string = 'Sign Up';
	export let selected_plan: string | null = '';
	export let onetime: boolean = false;
	// pricing cards
	export let cardItems: CartItems = [
		{
			id: 'prod_QjUMG44vCFNGXO',
			subtitles: 'Basic',
			prices: '50',
			offers: '45',
			priceMn: 'price_1Ps1ODRpYHoLk6LSg56V1no0',
			priceYr: 'price_1Ps1ODRpYHoLk6LSMN8kgMJf',
			comments: 'All the basics for an entry level business',
			features: [
				'Up to 2 surveys per month',
				'Up to 5 questions per survey.',
				'Access to a limited respondent pool (100 respondents per survey)',
				'Email support.'
			]
		},
		{
			id: 'prod_QTg6aK5zM7RlUw',
			subtitles: 'Standard Business',
			prices: '200',
			offers: '180',
			priceMn: 'price_1PcikKRpYHoLk6LSwn6RloI0',
			priceYr: 'price_1PcikKRpYHoLk6LSiWl3cO16',
			comments: 'Everything you need for a growing business',
			features: [
				'Up to 4 surveys per month.',
				'Up to 15 questions per survey.',
				'Access to an expanded respondent pool (250 respondents per survey)',
				'Advanced demographic segmentation (income, education level).',
				'Analytics and reporting.',
				'Email support.'
			]
		},
		{
			id: 'prod_QTgA9EH6qo3dRu',
			subtitles: 'Premium Business',
			prices: '1200',
			offers: '1080',
			priceMn: 'price_1Ps1UARpYHoLk6LSTei2ionx',
			priceYr: 'price_1Ps1UARpYHoLk6LSOaIVGyUe',
			comments: 'Advanced features for scaling your business',
			features: [
				'Up to 6 surveys per month.',
				'Up to 30 questions per survey.',
				'Access to a large  respondent pool (500 respondents per survey)',
				'Advanced demographic segmentation (income, education level).',
				'Analytics and reporting.',
				'On demand technical support.'
			]
		},
		{
			id: 'N/A',
			subtitles: 'Enterprise',
			prices: 'Custom',
			offers: 'Custom',
			priceMn: 'N/A',
			priceYr: 'N/A',
			comments: 'Enterprise level needs',
			features: ['Unlimited users', 'Unlimited Plan features', 'Unlimited Product support']
		}
	];

	const otp = {
		id: 'prod_QjUCV2u3waC96D',
		subtitles: 'One-time',
		prices: '30',
		offers: '30',
		priceMn: 'price_1Ps1ELRpYHoLk6LSjizQbL8q',
		priceYr: 'price_1Ps1ELRpYHoLk6LSjizQbL8q',
		comments: 'One time trial for platform features',
		features: [
			'One time survey',
			'Up to 5 questions for the one time survey.',
			'Access to a limited respondent pool (100 respondents per survey)',
			'Email support.'
		]
	};
	if (!onetime) {
		cardItems = [otp, ...cardItems];
	}
</script>

<!-- Pricing -->
<div class="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
	<!-- Title -->
	<div class="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
		<h2 class="text-2xl font-bold dark:text-white md:text-4xl md:leading-tight">Pricing</h2>
		<p class="mt-1 text-gray-600 dark:text-neutral-400">
			Whatever your status, our offers evolve according to your needs.
		</p>
	</div>
	<!-- End Title -->

	<!-- Switch -->
	<div class="flex items-center justify-center">
		<Label class="me-3 min-w-14 text-sm text-gray-500 dark:text-neutral-400" for="airplane-mode"
			>Monthly</Label
		>
		<Switch id="annual" bind:checked />
		<Label
			class="relative ms-3 min-w-14 text-sm text-gray-500 dark:text-neutral-400"
			for="airplane-mode"
			>Annual
			<span class="absolute -end-28 -top-10 start-auto">
				<span class="flex items-center">
					<svg
						class="-me-6 h-8 w-14"
						width="45"
						height="25"
						viewBox="0 0 45 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
							fill="currentColor"
							class="fill-gray-300 dark:fill-neutral-700"
						/>
					</svg>
					<span
						class="mt-3 inline-block whitespace-nowrap rounded-full bg-orange-600 px-2.5 py-1 text-[11px] font-semibold uppercase leading-5 tracking-wide text-white"
						>Save up to 10%</span
					>
				</span>
			</span>
		</Label>
	</div>
	<!-- End Switch -->

	<!-- Grid -->
	<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
		<!-- Card -->
		{#each cardItems as item}
			<Card.Root
				class="{item.subtitles === $clientPackage.plan
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
					</ul></Card.Content
				>
				<Card.Footer>
					{#if item.subtitles === 'Enterprise'}
						<Button variant="outline" class="w-full " href="/about#contact">Contact Support</Button>
					{:else if applyLogic}
						<!-- <Button 
                        variant="outline"
                        disabled={
                            selected_plan === item.prices
                        } 
                        class="w-full" 
                        on:click={()=> 
                            clientPackage.set({
                                plan : item.subtitles,
                                price : checked !== true? item.prices: String(parseInt(item.offers)*12),
                                priceId: checked !== true? item.priceMn: item.priceYr
                            })
                        } 
                    >
                        {selected_plan === item.prices? "Current Plan": Message}
                        
                    </Button> -->
						{#if isDesktop}
							<Dialog.Root>
								<Dialog.Trigger>
									<Button
										variant="outline"
										class="w-full"
										disabled={selected_plan === item.prices}
										onclick={() =>
											clientPackage.set({
												plan: item.subtitles,
												price:
													checked !== true
														? item.prices
														: item.subtitles === 'One-time'
															? item.prices
															: String(parseInt(item.offers) * 12),
												priceId: checked !== true ? item.priceMn : item.priceYr
											})}
									>
										{selected_plan === item.prices ? 'Current Plan' : Message}
									</Button>
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header class="grid gap-3">
										<Dialog.Title class="text-3xl text-muted-foreground">Checkout</Dialog.Title>
										<Dialog.Title class="text-xl text-muted-foreground">Order Summary</Dialog.Title>
										<Dialog.Description class=" text-md space-y-2">
											<form action="?/subscribe" method="post" class="grid gap-2">
												<p class="grid grid-cols-2 gap-2">
													Total <span class="font-semibold text-black">${$clientPackage.price}</span
													>
												</p>
												<Separator class="mb-5" />
												<Input
													type="text"
													name="priceId"
													value={$clientPackage.priceId}
													class="hidden"
												/>

												<Button
													variant="secondary"
													class="float-end flex gap-2"
													type="submit"
													disabled={parseInt($clientPackage.price) > 0 ? false : true}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="size-11"
														viewBox="0 0 512 214"
														><path
															fill="#635bff"
															d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774"
														/></svg
													>
													Checkout
												</Button>
											</form>
											<form action="" method="post" class="grid gap-2">
												<Button
													variant="secondary"
													class="float-end flex gap-2"
													disabled={parseInt($clientPackage.price) > 0 ? false : true}
												>
													<img
														class="w-14"
														src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/512px-M-PESA_LOGO-01.svg.png?20191120100524"
														alt=""
													/>
													Checkout
												</Button>
											</form>
										</Dialog.Description>
									</Dialog.Header>
								</Dialog.Content>
							</Dialog.Root>
						{:else}
							<Drawer.Root>
								<Drawer.Trigger>
									<Button
										variant="outline"
										class="w-full"
										onclick={() =>
											clientPackage.set({
												plan: item.subtitles,
												price: checked !== true ? item.prices : String(parseInt(item.offers) * 12),
												priceId: checked !== true ? item.priceMn : item.priceYr
											})}
									>
										{selected_plan === item.prices ? 'Current Plan' : Message}
									</Button>
								</Drawer.Trigger>
								<Drawer.Content>
									<Drawer.Header>
										<Drawer.Title>
											You have selected the <span class="font-bold text-black"
												>{$clientPackage.plan} package</span
											>
										</Drawer.Title>
										<Drawer.Description class=" text-md">
											Totaling: <span class="font-semibold text-black">${$clientPackage.price}</span
											>
										</Drawer.Description>
									</Drawer.Header>
									<Drawer.Footer>
										<Button>Submit</Button>
										<Drawer.Close>Cancel</Drawer.Close>
									</Drawer.Footer>
								</Drawer.Content>
							</Drawer.Root>
						{/if}
					{:else}
						<Button variant="outline" class=" w-full" {href}>
							{Message}
						</Button>
					{/if}
				</Card.Footer>
			</Card.Root>
		{/each}
		<!-- End Card -->
	</div>
	<!-- End Grid -->

	<!-- Comparison table -->
	{#if table}
		<div class="mt-20 lg:mt-32">
			<div class="mb-10 lg:mb-20 lg:text-center">
				<h3 class="text-2xl font-semibold dark:text-white">Compare plans</h3>
			</div>
			<Table.Root class="table-auto">
				<Table.Header>
					<Table.Row class="text-lg font-semibold dark:bg-neutral-900">
						<Table.Head class="w-[23rem] text-black dark:text-white">Plans</Table.Head>
						<Table.Head class="px-6 text-black dark:text-white">Basic</Table.Head>
						<Table.Head class="text-black dark:text-white">Standard</Table.Head>
						<Table.Head class="text-black dark:text-white">Premium</Table.Head>
						<Table.Head class="text-black dark:text-white">Enterprise</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row class="bg-gray-100 font-bold dark:bg-neutral-700">
						<Table.Cell>Survey Platform</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>High Volume Survey Generation</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Sample Size</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Specific target respondents</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row class="bg-gray-100 font-bold dark:bg-neutral-700">
						<Table.Cell>Social data</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Sharable link</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Data Access</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Statistics</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row class="bg-gray-100 font-bold dark:bg-neutral-700">
						<Table.Cell>On-chain data</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Target Demographics</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Total circulation (beta)</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Mystery Shopper</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row class="bg-gray-100 font-bold dark:bg-neutral-700">
						<Table.Cell>On Demand Support</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Billing Statements</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Customer Support</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Minus class=" h-5 w-5 text-neutral-700" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
						<Table.Cell>
							<!-- Check -->
							<Check class="h-5 w-5 text-orange-600" />
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
