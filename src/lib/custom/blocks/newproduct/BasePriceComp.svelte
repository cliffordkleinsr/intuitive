<script>
	import * as Card from '$lib/components/ui/card';
	import { packageList } from './items';
	import Check from 'lucide-svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="mx-auto flex max-w-5xl flex-col p-5">
	<div class="grid w-full gap-2 md:grid-cols-3">
		{#each packageList as pkg}
			<Card.Root class="flex h-full flex-col">
				<Card.Header class="text-center">
					<Card.Title>{pkg.title}</Card.Title>
					<Card.Title class="text-4xl">
					${pkg.one_pack}
				</Card.Title>
					<Card.Description>{pkg.comments}</Card.Description>
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
					<Button variant="default" class="w-full" href="/client/login">Sign Up</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
		<Card.Root class="col-span-2">
			<Card.Header>
				<Card.Title>Consultancy Services</Card.Title>
				<Card.Description
					>Ideal for large organizations, enterprises that already have an established marketbase</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<ul class="space-y-3 text-sm">
					<li class="flex gap-x-3">
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
							Rapid Data Collection & Analysis
						</span>
					</li>
					<li class="flex gap-x-3">
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
						<span class="text-gray-800 dark:text-neutral-400"> Customer Experience </span>
					</li>
					<li class="flex gap-x-3">
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
							Corporate Reputation Management
						</span>
					</li>
					<li class="flex gap-x-3">
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
						<span class="text-gray-800 dark:text-neutral-400"> Brand Strategy & Positioning </span>
					</li>
					<li class="flex gap-x-3">
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
						<span class="text-gray-800 dark:text-neutral-400"> Digital Marketing Execution </span>
					</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button class="w-full" variant="secondary" data-sveltekit-reload href="/about#address"
					>Contact Us</Button
				>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
