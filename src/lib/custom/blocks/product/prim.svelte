<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';

	import Check from 'lucide-svelte/icons/check';
	import Minus from 'lucide-svelte/icons/minus';
	import type { Snippet } from 'svelte';

	interface Primitive {
		class?: string;
		table: boolean;
		cardItems: Snippet;
		switcher: Snippet;
	}
	let { class: classname, table, cardItems, switcher }: Primitive = $props();
</script>

<div class="py-12 sm:py-14">
	<h2 class="text-center text-base font-semibold leading-7 text-primary">Pricing</h2>
	<p class="mt-2 text-center text-4xl font-bold tracking-tight sm:text-5xl">
		Choose the right plan for your business
	</p>
	<!-- End Title -->
	<!-- Switch -->
	<div class="flex items-center justify-center py-12">
		<Label class="me-3 min-w-14 text-sm text-gray-500 dark:text-neutral-400" for="airplane-mode"
			>Monthly</Label
		>
		{@render switcher()}
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
	<div class="mx-auto mt-5 grid max-w-md gap-4 lg:items-center">
		{@render cardItems()}
	</div>
	<!-- Comparison table -->
	{#if table}
		<div class="mx-auto mt-20 max-w-[85rem] lg:mt-32">
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
