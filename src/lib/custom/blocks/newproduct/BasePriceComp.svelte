<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { featureList } from './pricelist';
</script>

<div class="mx-auto flex max-w-5xl flex-col p-5">
	<div class="grid w-full gap-2 md:grid-cols-3">
		{#each featureList as pkg}
			<Card.Root class={['flex h-full flex-col', pkg.title === 'Enterprise' ? 'col-span-3' : '']}>
				<Card.Header class="text-center">
					<Card.Title>{pkg.title}</Card.Title>
					<Card.Title class="text-4xl">
						${pkg.cost}
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
	</div>
</div>
